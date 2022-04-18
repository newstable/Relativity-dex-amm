import styled from 'styled-components'

const Column = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
`
export const ColumnCenter = styled(Column)`
  width:100%;
  align-items: center;
  justify-content:center;
  z-index:28;
  padding:0;
`
export const PlusButton = styled.div`
  align-items:center;
  text-align:center;
  padding:5px;
  justify-content:center;
  position: absolute;
  width: 50px;
  height: 50px;
  top: 165px;
  left: 250px;
  border-radius: 50px;
  z-index:29;
  background-color: white
`

export const AutoColumn = styled.div<{
  gap?: 'sm' | 'md' | 'lg' | string
  justify?: 'stretch' | 'center' | 'start' | 'end' | 'flex-start' | 'flex-end' | 'space-between'
}>`
  display: grid;
  z-index:5;
  grid-auto-rows: auto;
  grid-row-gap: ${({ gap }) => (gap === 'sm' && '8px') || (gap === 'md' && '12px') || (gap === 'lg' && '24px') || gap};
  justify-items: ${({ justify }) => justify && justify};
`

export default Column
