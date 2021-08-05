export const readValue = (value: string): string => {
  return value.replace(/(%[\dA-F]{2})+/gi, decodeURIComponent)
}

export const writeValue = (value: string): string => {
  return encodeURIComponent(value).replace(
    /%(2[346BF]|3[AC-F]|40|5[BDE]|60|7[BCD])/g,
    decodeURIComponent
  )
}