let logRepo = require('../repos/logRepo')

let errorHelpers = {
    logErrorsToConsole: function (err, req, res, next) {
      console.error(`Log Entry: ${JSON.stringify(errorHelpers.errorBuilder(err))}`)
      console.error("*".repeat(80))
      next(err)
    },
    logErrorsToFile: function (err, req, res, next) {
      let errorObject = errorHelpers.errorBuilder(err)
      errorObject.requestInfo = {
        "hostname": req.hostname,
        "path": req.path,
        "app": req.app,
      }
      logRepo.write(errorObject, function (data) {
        console.log(data)
      }, function (err) {
        console.error(err)
      })
        next(err)
    },      
    clientErrorHandler: function (err, req, res, next) {
      if (req.xhr) {
        res.status(500).json({
          "status": 500,
          "statusText": "Internal server error",
          "message": "XMLHttpRequest error",
          "error": {
            "errno": 0,
            "call": "XMLHttpRequest call",
            "code": "INTERNAL_SERVER_ERROR",
            "message": "XMLHttpRequest error"
          }
        })
      } else {
        next(err)
      }
    },
    errorHandler: function (err, req, res, next) {
      res.status(500).json(errorHelpers.errorBuilder(err))
    },
    errorBuilder: function (err) {
      const DEFAULT_MESSAGE = "Internal server error"
      const DEFAULT_CODE = "INTERNAL_SERVER_ERROR"
      const UNKNOWN = "(unknown)"
      if (err) {
        return errorHelpers.responseObjectBuilder(
          DEFAULT_MESSAGE, err.message, err.errno, err.syscall, DEFAULT_CODE
        )
      } else {
        return errorHelpers.responseObjectBuilder(
          DEFAULT_MESSAGE, UNKNOWN, 500, UNKNOWN, DEFAULT_CODE
        )
      }
    },
    responseObjectBuilder: function (statusText, message, errno, call, code) {
      return {
        "status": 500,
        "statusText": statusText,
        "message": message, 
        "error": {
          "errno": errno, 
          "call": call,
          "code": code,
          "message": message
        }
      }
    }
  }
  
  module.exports = errorHelpers