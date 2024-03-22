import { DatePicker as BaseDatePicker } from "antd";
import dateFnsGenerateConfig from 'rc-picker/lib/generate/dateFns'

export const DatePicker = BaseDatePicker.generatePicker<Date>(dateFnsGenerateConfig)
