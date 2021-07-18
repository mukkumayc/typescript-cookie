/* global QUnit */
import Cookies from '../dist/js.cookie.mjs'

const lifecycle = {
  afterEach: function () {
    // Remove the cookies created using js-cookie default attributes
    Object.keys(Cookies.get()).forEach(function (cookie) {
      Cookies.remove(cookie)
    })
    // Remove the cookies created using browser default attributes
    Object.keys(Cookies.get()).forEach(function (cookie) {
      Cookies.remove(cookie, {
        path: ''
      })
    })
  }
}

const using = function (assert) {
  function getQuery (key) {
    const queries = window.location.href.split('?')[1]
    if (!queries) {
      return
    }
    const pairs = queries.split(/&|=/)
    const indexBaseURL = pairs.indexOf(key)
    const result = pairs[indexBaseURL + 1]
    if (result) {
      return decodeURIComponent(result)
    }
  }
  function setCookie (name, value) {
    return {
      then: function (callback) {
        const iframe = document.getElementById('request_target')
        const serverURL = getQuery('integration_baseurl')
        Cookies.set(name, value)
        if (!serverURL) {
          callback(Cookies.get(name), document.cookie)
        } else {
          const requestURL = [
            serverURL,
            'encoding?',
            'name=' + encodeURIComponent(name),
            '&value=' + encodeURIComponent(value)
          ].join('')
          const done = assert.async()
          iframe.addEventListener('load', function () {
            const iframeDocument = iframe.contentWindow.document
            const root = iframeDocument.documentElement
            const content = root.textContent
            if (!content) {
              QUnit.ok(
                false,
                ['"' + requestURL + '"', 'content should not be empty'].join(
                  ' '
                )
              )
              done()
              return
            }
            try {
              const result = JSON.parse(content)
              callback(result.value, iframeDocument.cookie)
            } finally {
              done()
            }
          })
          iframe.src = requestURL
        }
      }
    }
  }
  return {
    setCookie: setCookie
  }
}

const quoted = function (input) {
  return '"' + input + '"'
}

export { lifecycle, using, quoted }
