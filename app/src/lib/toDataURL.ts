export const toDataURL = (file: File) => {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader()

    reader.addEventListener('load', () => {
      resolve(reader.result as string)
    })

    reader.addEventListener('error', () => {
      reject()
    })

    reader.readAsDataURL(file)
  })
}
