import { CookieAttributes, CookieConverter, Cookies } from '../types/index'
import {
  defaultAttributes,
  defaultCodec,
  getCookie,
  getCookies,
  removeCookie,
  setCookie
} from './api'

function init<W, R> (
  converter: CookieConverter<W, R>,
  defaultAttributes: CookieAttributes
): Cookies<W, R> {
  const api: any = {
    set: function (key: any, value: any, attributes?: any) {
      return setCookie(
        key,
        value,
        Object.assign({}, this.attributes, attributes),
        {
          encodeValue: this.converter.write
        }
      )
    },
    get: function (key?: any) {
      if (arguments.length === 0) {
        return getCookies(this.converter.read)
      }
      if (key == null) {
        return
      }
      return getCookie(key, this.converter.read)
    },
    remove: function (key: any, attributes?: any) {
      removeCookie(key, Object.assign({}, this.attributes, attributes))
    },
    withAttributes: function (attributes: any) {
      return init(
        this.converter,
        Object.assign({}, this.attributes, attributes)
      )
    },
    withConverter: function (converter: any) {
      return init(Object.assign({}, this.converter, converter), this.attributes)
    }
  }

  const config: any = {
    attributes: { value: Object.freeze(defaultAttributes) },
    converter: { value: Object.freeze(converter) }
  }

  return Object.create(api, config)
}

export default init(
  { read: defaultCodec.decodeValue, write: defaultCodec.encodeValue },
  defaultAttributes
)
