export const hashCode = (str: string) => str
  .split('')
  .map(ch => ch.charCodeAt(0))
  .reduce((acc, c) => {
    acc = ((acc << 5) - acc) + c
    acc |= 0
    return acc
  }, 0)
