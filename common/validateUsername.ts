export const validateUsername = (username: string) => {
  if (['.', '-', '_'].some((ch) => username.endsWith(ch))) {
    return false
  }

  return /^[a-zA-Z][a-zA-Z0-9-\.\_]*$/.test(username)
}
