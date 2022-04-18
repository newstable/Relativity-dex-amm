import { createGlobalStyle } from 'styled-components'

const GlobalStyle = createGlobalStyle`
  body {
    background: ${({ theme }) => theme.colors.background};
    background-repeat:no-repeat;
    background-size:100% 104%;

    img {
      height: auto;
      max-width: 100%;
    }
  }
`

export default GlobalStyle
