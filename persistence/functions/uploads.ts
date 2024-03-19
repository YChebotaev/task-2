import { createCreateOperation, createDeleteOperation, createGetOperation } from '../lib'
import type { Upload, UploadCreateProps } from '../types'

export const uploadCreate = createCreateOperation<UploadCreateProps>('uploads')

export const uploadGet = createGetOperation<Upload>('uploads')

export const uploadDelete = createDeleteOperation('uploads')
