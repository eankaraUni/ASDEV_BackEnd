function executeHandler(handlerFn) {
  return async (req, res) => {
    try {
      const result = await handlerFn(req, res);
      res.status(200).send(result);
    } catch (err) {
      console.error(err);
      res.status(err.statusCode || 500).send(err.message || "Unexpected error");
    }
  };
}

module.exports = { executeHandler };
