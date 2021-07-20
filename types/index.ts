export type CookieAttributes = object & {
  path?: string
  domain?: string
  expires?: number | Date
  sameSite?: string
  secure?: boolean
  [property: string]: any
}

export type CookieConverter = object & {
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

export type Cookies = CookiesConfig | CookiesApi
