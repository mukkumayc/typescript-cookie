type ReadOnlyConfig<T> = {
  readonly [Property in keyof T]: T[Property]
}

export type CookieAttributes = object & {
  path?: string
  domain?: string
  expires?: number | Date
  sameSite?: 'strict' | 'Strict' | 'lax' | 'Lax' | 'none' | 'None'
  secure?: boolean
  [property: string]: any
}

export type CookieAttributesConfig = ReadOnlyConfig<CookieAttributes>

export type ReadConverter = (value: string, name?: string) => any

export type WriteConverter = (value: any, name?: string) => string

export type CookieConverter = object & {
  read: ReadConverter
  write: WriteConverter
}

export type CookieConverterConfig = ReadOnlyConfig<CookieConverter>

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
  withConverter: (converter: {
    write?: WriteConverter
    read?: ReadConverter
  }) => Cookies
}

export type Cookies = CookiesConfig & CookiesApi
