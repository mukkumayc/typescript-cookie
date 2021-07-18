import defaultConverter from './converter.mjs'

function init (converter, defaultAttributes) {
  function set (key, value, attributes) {
    if (typeof document === 'undefined') {
      return
    }

    attributes = Object.assign({}, defaultAttributes, attributes)

    if (typeof attributes.expires === 'number') {
      attributes.expires = new Date(Date.now() + attributes.expires * 864e5)
    }
    if (attributes.expires) {
      attributes.expires = attributes.expires.toUTCString()
    }

    key = encodeURIComponent(key)
      .replace(/%(2[346B]|5E|60|7C)/g, decodeURIComponent)
      .replace(/[()]/g, escape)

    value = converter.write(value, key)

    let stringifiedAttributes = ''
    for (const attributeName in attributes) {
      if (!attributes[attributeName]) {
        continue
      }

      stringifiedAttributes += '; ' + attributeName

      if (attributes[attributeName] === true) {
        continue
      }

      // Considers RFC 6265 section 5.2:
      // ...
      // 3.  If the remaining unparsed-attributes contains a %x3B (";")
      //     character:
      // Consume the characters of the unparsed-attributes up to,
      // not including, the first %x3B (";") character.
      // ...
      stringifiedAttributes += '=' + attributes[attributeName].split(';')[0]
    }

    return (document.cookie = key + '=' + value + stringifiedAttributes)
  }

  function get (key) {
    if (typeof document === 'undefined' || (arguments.length && !key)) {
      return
    }

    // To prevent the for loop in the first place assign an empty array
    // in case there are no cookies at all.
    const cookies = document.cookie ? document.cookie.split('; ') : []
    const jar = {}
    for (let i = 0; i < cookies.length; i++) {
      const parts = cookies[i].split('=')
      let value = parts.slice(1).join('=')

      if (value[0] === '"') {
        value = value.slice(1, -1)
      }

      try {
        const foundKey = defaultConverter.read(parts[0])
        jar[foundKey] = converter.read(value, foundKey)

        if (key === foundKey) {
          break
        }
      } catch (e) {}
    }

    return key ? jar[key] : jar
  }

  return Object.create(
    {
      set: set,
      get: get,
      remove: function (key, attributes) {
        set(
          key,
          '',
          Object.assign({}, attributes, {
            expires: -1
          })
        )
      },
      withAttributes: function (attributes) {
        return init(
          this.converter,
          Object.assign({}, this.attributes, attributes)
        )
      },
      withConverter: function (converter) {
        return init(
          Object.assign({}, this.converter, converter),
          this.attributes
        )
      }
    },
    {
      attributes: { value: Object.freeze(defaultAttributes) },
      converter: { value: Object.freeze(converter) }
    }
  )
}

export default init(defaultConverter, { path: '/' })
