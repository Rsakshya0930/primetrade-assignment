module.exports = (err, req, res, next) => {
  console.error(err.stack);

  if (err.name === 'SequelizeValidationError')
    return res.status(400).json({ success: false, errors: err.errors.map(e => e.message) });

  if (err.name === 'SequelizeUniqueConstraintError')
    return res.status(409).json({ success: false, message: 'Resource already exists' });

  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
};