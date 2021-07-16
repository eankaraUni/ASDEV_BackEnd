import { getDb } from "./dbinit.js";
import {IssueStatus} from "../models/statusRoles.module";

async function getUsers() {
    return await getDb().collection("User").find().toArray();
}
async function getIssuesAdmin() {
    return await getDb().collection("Issues").find().toArray();
}
// async function createUsers() {
//     return await getDb().collection("Issues").find().toArray();
// }
async function assignIssue(idIssue, assignedUser){
    return await getDb()
        .collection("Issue")
        .updateOne(
          { _id: new mongo.ObjectId(idIssue) },
          { $set: { assignedUser, status: IssueStatus.inProgress } }
        );
}

async function updateUser(username, data){
    return await getDb()
        .collection("User")
        .updateOne({ username: username }, { $set: { data } });
}

module.exports = {getUsers,getIssuesAdmin, assignUser, updateUser};

