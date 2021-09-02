import { Decoder, Encoder } from '../types/index'

export const encodeName: (name: string) => string = (name) =>
  encodeURIComponent(name)
    .replace(/%(2[346B]|5E|60|7C)/g, decodeURIComponent)
    .replace(/[()]/g, escape)

export const encodeValue: Encoder<
string | number | boolean | undefined | null
> = (value: any): string => {
  return encodeURIComponent(value as string).replace(
    /%(2[346BF]|3[AC-F]|40|5[BDE]|60|7[BCD])/g,
    decodeURIComponent
  )
}

export const decodeName: (name: string) => string = decodeURIComponent

export const decodeValue: Decoder<string> = (value: string): string => {
  if (value[0] === '"') {
    value = value.slice(1, -1)
  }
  return value.replace(/(%[\dA-F]{2})+/gi, decodeURIComponent)
}
