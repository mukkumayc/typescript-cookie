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

export type Decoder<T> = (value: string, name?: string) => T

export type Encoder<T> = (value: T, name?: string) => string

export type CookieDecoding<T> = object & {
  readonly decodeName?: Decoder<string>
  readonly decodeValue?: Decoder<T>
}

export type CookieEncoding<T> = object & {
  readonly encodeName?: Encoder<string>
  readonly encodeValue?: Encoder<T>
}

export type CookieCodecConfig<W, R> = object & {
  readonly decodeName: Decoder<string>
  readonly decodeValue: Decoder<R>
  readonly encodeName: Encoder<string>
  readonly encodeValue: Encoder<W>
}

export type CookieConverter<W, R> = object & {
  read: Decoder<R>
  write: Encoder<W>
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
    write?: Encoder<W>
    read?: Decoder<R>
  }) => Cookies<W, R>
}

export type Cookies<W, R> = CookiesConfig<W, R> & CookiesApi<W, R>
