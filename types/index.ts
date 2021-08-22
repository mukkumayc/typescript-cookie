export type CookieAttributes = object & {
  path?: string
  domain?: string
  expires?: number | Date
  sameSite?: string
  secure?: boolean
  [property: string]: any
}

export type CookieAttributesConfig = object & {
  readonly path?: string
  readonly domain?: string
  readonly expires?: number | Date
  readonly sameSite?: string
  readonly secure?: boolean
  readonly [property: string]: any
}

export type ReadConverter = (value: string, name?: string) => any

export type WriteConverter = (value: any, name?: string) => string

export type CookieConverter = object & {
  read: ReadConverter
  write: WriteConverter
}

export type CookieConverterConfig = object & {
  readonly read: ReadConverter
  readonly write: WriteConverter
}

type CookiesConfig = object & {
  readonly converter: CookieConverterConfig
  readonly attributes: CookieAttributesConfig
}

type CookiesApi = object & {
  set: (
    name: string,
    value: any,
    attributes?: CookieAttributes
  ) => string | undefined
  get: (
    name?: string | undefined | null
  ) => string | undefined | (object & { [property: string]: any })
  remove: (name: string, attributes?: CookieAttributes) => void
  withAttributes: (attributes: CookieAttributes) => Cookies
  withConverter: (converter: { write?: WriteConverter, read?: ReadConverter }) => Cookies
}

export type Cookies = CookiesConfig & CookiesApi
