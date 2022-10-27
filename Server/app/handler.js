const asyncFn = fn =>
  function asyncUtilWrap(...args) {
    const fnReturn = fn(...args)
    const next = args[args.length - 1]
    return Promise.resolve(fnReturn).catch(next)
  }

const throwErrorMsg = (code, errorType, errorMessage, next) => error => {
  if (!error) error = new Error(errorMessage || 'Default Error')
  error.code = code
  error.errorType = errorType
  throw error
};

const throwIf = (fn, code, errorType, errorMessage, next) => result => {
  if (fn(result)) {
    return throwErrorMsg(code, errorType, errorMessage, next)()
  }
  return result
};

const sendSuccess = (res, message) => data => {
  res.status(200).json({ type: 'success', message, data })
}

const sendError = (res, status, message) => error => {
  res.status(status || error.status).json({
    type: 'error',
    message: message || error.message,
    error
  })
}

module.exports = {
  asyncFn,
  throwIf,
  throwErrorMsg,
  sendSuccess,
  sendError
}

/*
400 Bad Request Error:
 - Used when user fails to include a field (like no credit card information in a payment form)
 - Also used when user enters incorrect information (Example: Entering different passwords in a password field and password confirmation field).
401 Unauthorized Error: Used when user enters incorrect login information (like username, email or password).
403 Forbidden Error: Used when user is not allowed access the endpoint.
404 Not Found Error: Used when the endpoint cannot be found.
500 Internal Server Error: Used the request sent by the frontend is correct, but there was an error from the backend.
*/
