export function authorize(...roles) {
  return (request, _response, next) => {
    if (!request.user || !roles.includes(request.user.role)) {
      const error = new Error('You do not have permission to access this resource.'); error.statusCode = 403; return next(error);
    }
    return next();
  };
}
