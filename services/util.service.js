const fs = require('fs')

module.exports = {
  makeId,
  saveToFile,
}

function makeId(length = 5) {
  var txt = ''
  var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  for (let i = 0; i < length; i++) {
    txt += possible.charAt(Math.floor(Math.random() * possible.length))
  }
  return txt
}

function saveToFile(path, entities) {
  return new Promise((resolve, reject) => {
    fs.writeFile(path, JSON.stringify(entities, null, 2), (err) => {
      if (err) return reject(err)
      resolve()
    })
  })
}
