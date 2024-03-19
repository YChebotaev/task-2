import { css, styled } from 'styled-components'

type RootProps = {
  $ltr: boolean
}

export const Root = styled.div<RootProps>`
  display: flex;
  border: 1px solid lightgray;
  border-radius: 5px;
  padding-left: 20px;
  padding-right: 20px;

  ${({ $ltr }) => $ltr && css`
    justify-content: flex-end;
  `}
`
