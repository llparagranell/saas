export const validate = (schema) => (req, res, next) => {
  try {
    const data = schema.parse({
      body: req.body,
      params: req.params,
      query: req.query
    })
    req.validated = data
    next()
  } catch (err) {
    return res.status(400).json({
      message: "Validation failed",
      errors: err.errors || []
    })
  }
}
