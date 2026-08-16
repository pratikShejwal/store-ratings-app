export function notFoundHandler(req, res) {
  res.status(404).json({ message: 'Route not found' });
}

// eslint-disable-next-line no-unused-vars
export function errorHandler(err, req, res, next) {
  console.error(err);

  // Postgres unique violation
  if (err.code === '23505') {
    return res.status(409).json({ message: 'A record with this value already exists' });
  }

  // Postgres check constraint violation (e.g. rating value out of range)
  if (err.code === '23514') {
    return res.status(400).json({ message: 'Value violates database constraints' });
  }

  const status = err.status || 500;
  res.status(status).json({ message: err.message || 'Internal server error' });
}
