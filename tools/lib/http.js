const https = require('https')
const { URL } = require('url')

module.exports = {
  httpGet
}
function httpGet(url) {
  return new Promise((resolve, reject) => {
    let result = ''
    https
      .get(url, (res) => {
        if (res.statusCode && res.statusCode >= 300 && res.statusCode < 400) {
          // redirect
          let redirectUrl = res.headers.location
          if (!redirectUrl.startsWith('http')) {
            const baseUrl = new URL(url)
            baseUrl.pathname = redirectUrl
            redirectUrl = String(baseUrl)
          }
          resolve(httpGet(redirectUrl))
          return
        }
        res.setEncoding('utf8')
        res.on('data', (chunk) => {
          result += String(chunk)
        })
        res.on('end', () => {
          resolve(result)
        })
        res.on('error', reject)
      })
      .on('error', reject)
  })
}
