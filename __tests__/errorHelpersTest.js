var sut = require('../helpers/errorHelpers.js')

describe('errorBuilder', () => {
    let err = {
        "errno" : 987,
        "call": "This is the system call",
        "code": "This is the error code",
        "message": "This is the message"
    }
    let expectedResult = {
        "status": 500,
        "statusText": "Internal server error",
        "message": err.message,
        "error": {
          "errno": err.errno,
          "call": err.syscall,
          "code": "INTERNAL_SERVER_ERROR",
          "message": err.message
        }
    }
    describe('valid error object', () => {
        let expectedResult = {
            "status": 500,
            "statusText": "Internal server error",
            "message": err.message,
            "error": {
              "errno": err.errno,
              "call": err.syscall,
              "code": "INTERNAL_SERVER_ERROR",
              "message": err.message
            }
        }
        it('returns fully-populated error response document', () => {
            expect(sut.errorBuilder(err)).toMatchObject(expectedResult)
        })
    })
    describe('null error object', () => {
        let expectedResult = {
            "status": 500,
            "statusText": "Internal server error",
            "message": "(unknown)",
            "error": {
              "errno": 500,
              "call": "(unknown)",
              "code": "INTERNAL_SERVER_ERROR",
              "message": "(unknown)"
            }
        }
        it('handles null err object gracefully', () => {
            expect(sut.errorBuilder(null)).toMatchObject(expectedResult)
        })
    })
})
describe('error logging functions', () => {
    describe('log errors to the console', () => {
        it('writes to the console', () => {
            const mockNext = jest.fn()
            jest.spyOn(global.console, 'error')
            sut.logErrorsToConsole(null, null, null, mockNext)
            expect(console.error).toHaveBeenCalledTimes(2)
        })
    })
})