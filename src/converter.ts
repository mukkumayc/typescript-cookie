import { ReadConverter, WriteConverter } from '../types/index'

export const writeName: (name: string) => string = (name) =>
  encodeURIComponent(name)
    .replace(/%(2[346B]|5E|60|7C)/g, decodeURIComponent)
    .replace(/[()]/g, escape)

export const writeValue: WriteConverter<
string | number | boolean | undefined | null
> = (value: any): string => {
  return encodeURIComponent(value as string).replace(
    /%(2[346BF]|3[AC-F]|40|5[BDE]|60|7[BCD])/g,
    decodeURIComponent
  )
}

export const readName: (name: string) => string = decodeURIComponent

export const readValue: ReadConverter<string> = (value: string): string => {
  if (value[0] === '"') {
    value = value.slice(1, -1)
  }
  return value.replace(/(%[\dA-F]{2})+/gi, decodeURIComponent)
}
