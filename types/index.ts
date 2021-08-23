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

export type ReadConverter<T> = (value: string, name?: string) => T

export type WriteConverter<T> = (value: T, name?: string) => string

export type CookieConverter<W, R> = object & {
  write: WriteConverter<W>
  read: ReadConverter<R>
}

export type CookieConverterConfig<W, R> = ReadOnlyConfig<CookieConverter<W, R>>

type CookiesConfig<W, R> = object & {
  readonly converter: CookieConverterConfig<W, R>
  readonly attributes: CookieAttributesConfig
}

type CookiesApi<W, R> = object & {
  set: (
    name: string,
    value: W,
    attributes?: CookieAttributes
  ) => string | undefined
  get: (
    name?: string | undefined | null
  ) => R | undefined | (object & { [property: string]: R })
  remove: (name: string, attributes?: CookieAttributes) => void
  withAttributes: <W, R>(attributes: CookieAttributes) => Cookies<W, R>
  withConverter: <W, R>(converter: {
    write?: WriteConverter<W>
    read?: ReadConverter<R>
  }) => Cookies<W, R>
}

export type Cookies<W, R> = CookiesConfig<W, R> & CookiesApi<W, R>
