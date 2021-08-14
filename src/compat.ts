import { CookieAttributes, CookieConverter, Cookies } from '../types/index'
import {
  setCookie,
  getCookie,
  getCookies,
  removeCookie,
  defaultAttributes,
  defaultConverter
} from './api'

function init (
  converter: CookieConverter,
  defaultAttributes: CookieAttributes
): Cookies {
  const api: any = {
    set: function (
      key: string,
      value: string | number | boolean,
      attributes?: CookieAttributes
    ): string | undefined {
      return setCookie(
        key,
        value,
        Object.assign({}, this.attributes, attributes),
        this.converter.write
      )
    },
    get: function (
      key?: string
    ): string | undefined | (object & { [property: string]: string }) {
      if (arguments.length === 0) {
        return getCookies(this.converter.read)
      }
      if (key == null) {
        return
      }
      return getCookie(key, this.converter.read)
    },
    remove: function (key: string, attributes?: CookieAttributes): void {
      removeCookie(key, Object.assign({}, this.attributes, attributes))
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

export default init(defaultConverter, defaultAttributes)
