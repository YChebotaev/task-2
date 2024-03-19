import { styled } from 'styled-components'

type RootProps = {
  $backgroundImage: string
}

type AvatarProps = {
  $src: string
}

export const Root = styled.div<RootProps>`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  min-height: 200px;
  background-image: url("${({ $backgroundImage }) => $backgroundImage}");
  background-size: cover;
`

export const InnerContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
`

export const Avatar = styled.div<AvatarProps>`
  border: 4px solid #fff;
  border-radius: 100%;
  width: 82px;
  height: 82px;
  background-image: url("${({ $src }) => $src}");
  background-size: cover;
`
