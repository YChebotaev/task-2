import { errorCodes } from "fastify"

export const parseNumber = (value: string | undefined) => {
  if (value == null) {
    throw new errorCodes.FST_ERR_VALIDATION('Value is not a number')
  }

  const num = Number(value)

  if (Number.isNaN(num)) {
    throw new errorCodes.FST_ERR_VALIDATION('Value is not a number')
  }

  return num
}
