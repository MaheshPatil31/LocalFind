export function errorHandler(error, _request, response, _next) {
  let statusCode = error.statusCode || 500;
  if (error.name === 'ValidationError' || error.name === 'CastError') statusCode = 400;
  response.status(statusCode).json({
    message: statusCode === 500 ? 'Internal server error' : error.message,
  });
}
