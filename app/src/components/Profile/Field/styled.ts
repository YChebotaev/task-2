import { styled } from 'styled-components'
import { Typography } from 'antd'

export const Root = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 8px;
`

export const Label = styled(Typography)`
  color: gray;
`

export const Value = styled(Typography)`
  font-weight: bold;
`
