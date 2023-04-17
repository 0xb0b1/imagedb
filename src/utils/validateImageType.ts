export const validateImageType = (type: string): boolean => {
  const imageTypeRegex = /^image\/(jpe?g|gif|png|bmp|svg\+xml)$/i

  return imageTypeRegex.test(type)
}
