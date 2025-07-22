export const validate = (schema) => {
  return (req, _res, next) => {
    try {
      schema.parse({
        body: req.body,
        query: req.query,
        params: req.params,
        cookies: req.cookies,
        headers: req.headers,
      });
      next();
    } catch (error) {
      next(error);
    }
  };
};
