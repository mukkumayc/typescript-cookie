import { CookieAttributes, CookieConverter, Cookies } from '../types/index'
import set from './set'
import get from './get'
import defaultConverter from './converter'

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
      if (typeof document === 'undefined') {
        return
      }

      return set(
        key,
        value as string,
        Object.assign({}, this.attributes, attributes),
        this.converter
      )
    },
    get: function (key?: string): string | object | undefined {
      if (
        typeof document === 'undefined' ||
        (arguments.length > 0 && key == null)
      ) {
        return
      }

      return get(key, this.converter)
    },
    remove: function (key: string, attributes?: CookieAttributes): void {
      set(
        key,
        '',
        Object.assign({}, this.attributes, attributes, {
          expires: -1
        }),
        this.converter
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
