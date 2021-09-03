import { CookieAttributes, CookieConverter, Cookies } from '../types/index'
import {
  DEFAULT_ATTRIBUTES,
  DEFAULT_CODEC,
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
    set: function (name: any, value: any, attributes?: any) {
      return setCookie(
        name,
        value,
        Object.assign({}, this.attributes, attributes),
        {
          encodeValue: this.converter.write
        }
      )
    },
    get: function (name?: any) {
      if (arguments.length === 0) {
        return getCookies(this.converter.read)
      }
      if (name == null) {
        return
      }
      return getCookie(name, this.converter.read)
    },
    remove: function (name: any, attributes?: any) {
      removeCookie(name, Object.assign({}, this.attributes, attributes))
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
  { read: DEFAULT_CODEC.decodeValue, write: DEFAULT_CODEC.encodeValue },
  DEFAULT_ATTRIBUTES
)
