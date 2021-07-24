export type CookieAttributes = object & {
  path?: string
  domain?: string
  expires?: number | Date
  sameSite?: string
  secure?: boolean
  [property: string]: any
}

export type CookieConverter = object & {
  read: (value: string, name: string) => any
  write: (value: any, name: string) => string
}

type CookiesConfig = object & {
  readonly converter: CookieConverter
  readonly attributes: CookieAttributes
}

type CookiesApi = object & {
  set: (
    name: string,
    value: any,
    attributes?: CookieAttributes
  ) => string | undefined
  get: (name?: string) => string | object | undefined
  remove: (name: string, attributes?: CookieAttributes) => void
  withAttributes: (attributes: CookieAttributes) => Cookies
  withConverter: (converter: CookieConverter) => Cookies
}

export type Cookies = CookiesConfig & CookiesApi
