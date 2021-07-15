"use strict";

const { promisify } = require("util");

/**@typedef {'object' | 'array' | 'number' | 'string' | 'bool' | 'null' | 'objectId' | 'date' | 'int' | 'long' | 'double' | 'decimal' | 'regex'} BsonType */

/**
 * Json schema for validating mongodb documents
 * @see https://json-schema.org/
 * @see https://json-schema.org/understanding-json-schema/
 * @see https://docs.mongodb.com/manual/core/schema-validation/
 *
 * Schema validation can also be bypassed if neccessary
 * To find out which documents do not pass schema validation use query:
 *   db.<collectionName>.find({$nor: [{$jsonSchema: <schema>}]})
 *
 * @typedef {Object} JsonSchema
 * @property {BsonType | Array<BsonType>} [bsonType] - type of property, can be an array if supports multiple types,
 * N.B. null is considered a type and will validate against defined bsonType if property is part of object and is null,
 * to allow 'null' type use: bsonType: ['string', 'null']
 *
 * @property {Array<string>} [required] required properties (only for object type)
 * @property {Object<string, JsonSchema>} [properties] properties (only for object type)
 * @property {boolean} [additionalProperties] whether to allow additional properties, default=true (only for object type)
 * @property {Array} [enum] allowed values
 *
 * @property {JsonSchema} [items] item schema definition (only for array type)
 * @property {number} [minItems] minimum length of array (only for array type)
 * @property {number} [maxItems] maximum length of array (only for array type)
 * @property {boolean} [uniqueItems] if true each item must be unique, use for primitive types only! (only for array type)
 *
 * @property {number} [minLength] minimum string length (only for string type)
 * @property {number} [maxLength] maximum string length (only for string type)
 * */

/**
 * @param {import('mongodb').Db} db
 * @param {string} collection
 * @param {JsonSchema} [jsonSchema] $jsonSchema validation
 * @param {Object} [mongoSchema] validation schema using mongo queries, allows conditions with $or, $and
 * @param {{validationLevel?: 'strict' | 'moderate'}} [extra={validationLevel: 'strict'}]
 */
async function setSchemaValidator(
  db,
  collection,
  jsonSchema,
  mongoSchema,
  extra
) {
  jsonSchema = jsonSchema || {};
  mongoSchema = mongoSchema || {};
  extra = extra || {};
  extra.validationLevel = extra.validationLevel || "strict";

  try {
    await promisify(db.createCollection).call(db, collection);
  } catch (err) {
    // If collection already exists just ignore
    if (err.codeName !== "NamespaceExists") throw err;
  }

  await promisify(db.command).call(db, {
    collMod: collection,
    validator: Object.assign({}, mongoSchema, { $jsonSchema: jsonSchema }),
    validationLevel: extra.validationLevel,
  });
}

module.exports = { setSchemaValidator };
