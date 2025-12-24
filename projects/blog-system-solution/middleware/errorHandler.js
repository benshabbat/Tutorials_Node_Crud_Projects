export function errorHandler(err, req, res, next) {
  console.error(err.stack);
  res.status(500).json({ 
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
}

export function notFound(req, res) {
  res.status(404).json({ message: 'Route not found' });
}
