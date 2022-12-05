let fs = require('fs')

const FILE_NAME = './logs/log.txt'

let logRepo = {
  write: function (data, resolve, reject) {
    let toWrite = `Date/Time: ${new Date().toLocaleDateString()}\n`
    toWrite += `Exception Info: ${JSON.stringify(data)}\n`
    toWrite += `${"*".repeat(80)}\n`
    fs.writeFile(FILE_NAME, toWrite, function (err) {
      if (err) {
        reject(err)
      } else {
        resolve(true)
      }
    })
  }
}

module.exports = logRepo    
