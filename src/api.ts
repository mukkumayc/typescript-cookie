import defaultConverter from './converter'

type CookieAttributes = object & {
  path?: string
  domain?: string
  expires?: number | Date
  sameSite?: string
  secure?: boolean
  [property: string]: any
}

type CookieConverter = object & {
  read: (value: string, name: string) => string
  write: (value: string | number | boolean, name: string) => string
}

type CookiesConfig = object & {
  converter: CookieConverter
  attributes: CookieAttributes
}

type CookiesApi = object & {
  set: (
    name: any,
    value: string | number | boolean,
    attributes?: CookieAttributes
  ) => string | undefined
  get: (name?: string) => string | object | undefined
  remove: (name: string, attributes?: CookieAttributes) => void
  withAttributes: (attributes: CookieAttributes) => Cookies
  withConverter: (converter: CookieConverter) => Cookies
}

type Cookies = CookiesConfig | CookiesApi

function init (
  converter: CookieConverter,
  defaultAttributes: CookieAttributes
): Cookies {
  function set (
    key: string,
    value: string | number | boolean,
    attributes?: CookieAttributes
  ): string | undefined {
    if (typeof document === 'undefined') {
      return
    }

    key = encodeURIComponent(key)
      .replace(/%(2[346B]|5E|60|7C)/g, decodeURIComponent)
      .replace(/[()]/g, escape)

    value = converter.write(value, key)

    let stringifiedAttributes: string = ''
    const stringifiable: object & { [property: string]: any } = Object.assign(
      {},
      defaultAttributes,
      attributes
    )

    if (typeof stringifiable.expires === 'number') {
      stringifiable.expires = new Date(
        Date.now() + stringifiable.expires * 864e5
      )
    }
    if (stringifiable.expires != null) {
      stringifiable.expires = stringifiable.expires.toUTCString()
    }

    for (const attributeName in stringifiable) {
      if (
        stringifiable[attributeName] == null ||
        stringifiable[attributeName] === false
      ) {
        continue
      }

      stringifiedAttributes += `; ${attributeName}`

      if (stringifiable[attributeName] === true) {
        continue
      }

      // Considers RFC 6265 section 5.2:
      // ...
      // 3.  If the remaining unparsed-attributes contains a %x3B (";")
      //     character:
      // Consume the characters of the unparsed-attributes up to,
      // not including, the first %x3B (";") character.
      // ...
      const attributeValue: string = stringifiable[attributeName].split(';')[0]
      stringifiedAttributes += `=${attributeValue}`
    }

    return (document.cookie = `${key}=${value}${stringifiedAttributes}`)
  }

  function get (key?: string): string | object | undefined {
    if (
      typeof document === 'undefined' ||
      (arguments.length > 0 && key == null)
    ) {
      return
    }

    // To prevent the for loop in the first place assign an empty array
    // in case there are no cookies at all.
    const cookies: string[] =
      document.cookie.length > 0 ? document.cookie.split('; ') : []
    const jar: object & { [property: string]: any } = {}
    for (let i = 0; i < cookies.length; i++) {
      const parts: string[] = cookies[i].split('=')
      let value: string = parts.slice(1).join('=')

      if (value[0] === '"') {
        value = value.slice(1, -1)
      }

      try {
        const foundKey: string = defaultConverter.read(parts[0])
        jar[foundKey] = converter.read(value, foundKey)

        if (key === foundKey) {
          break
        }
      } catch (e) {}
    }

    return key != null ? jar[key] : jar
  }

  const api: any = {
    set: set,
    get: get,
    remove: (key: string, attributes?: CookieAttributes): void => {
      set(
        key,
        '',
        Object.assign({}, attributes, {
          expires: -1
        })
      )
    },
    withAttributes: function (attributes: CookieAttributes): Cookies {
      return init(
        this.converter,
        Object.assign({}, this.attributes, attributes)
      )
    },
    withConverter: function (converter: CookieConverter): Cookies {
      return init(Object.assign({}, this.converter, converter), this.attributes)
    }
  }
  const config: any = {
    attributes: { value: Object.freeze(defaultAttributes) },
    converter: { value: Object.freeze(converter) }
  }

  return Object.create(api, config)
}

export default init(defaultConverter, { path: '/' })
