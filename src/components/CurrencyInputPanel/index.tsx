import React, { useState, useContext, useCallback } from 'react'
import styled, { ThemeContext } from 'styled-components'
import { Currency, Pair } from '@pancakeswap-libs/sdk'
import { Button, ChevronDownIcon, Text } from '@pancakeswap-libs/uikit'
import { darken } from 'polished'
import { useCurrencyBalance } from '../../state/wallet/hooks'
import CurrencySearchModal from '../SearchModal/CurrencySearchModal'
import CurrencyLogo from '../CurrencyLogo'
import DoubleCurrencyLogo from '../DoubleLogo'
import { RowBetween } from '../Row'
import { Input as NumericalInput } from '../NumericalInput'
import { useActiveWeb3React } from '../../hooks'
import TranslatedText from "../TranslatedText"
import { TranslateString } from '../../utils/translateTextHelpers'

const InputRow = styled.div<{ selected: boolean }>`
  display: flex;
  flex-flow: column nowrap;
  border-radius:10px;
  border:1px solid #626263;
  margin:1px;
  height:350px;
  align-items: center;
  padding: ${({ selected }) => (selected ? '0.75rem 0.5rem 0.75rem 1rem' : '0.75rem 0.75rem 0.75rem 1rem')};
`

const CurrencySelect = styled.button<{ selected: boolean }>`
  align-items: center;
  width:100%;
  font-size: 25px;
  font-weight: 500;
  background-color: transparent;
  color: ${({ selected, theme }) => (selected ? theme.colors.card : '#FFFFFF')};
  outline: none;
  cursor: pointer;
  user-select: none;
  border: none;
  padding: 0.4rem 0.5rem;
  margin-top:20px;

  :hover {
    background-color: rgb(98, 98, 99);
  }
`

const LabelRow = styled.div`
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  color: ${({ theme }) => theme.colors.text};
  font-size: 0.75rem;
  line-height: 1rem;
  padding: 0.75rem 1rem 0 1rem;
  span:hover {
    cursor: pointer;
    color: ${({ theme }) => darken(0.2, theme.colors.textSubtle)};
  }
`

const Aligner = styled.span`
  background-color:transparent;
  display: flex;
  align-items: center;
  justify-content: space-between;
  color:white;
`

const InputPanel = styled.div<{ hideInput?: boolean }>`
  display: flex;
  flex-flow: row nowrap;
  position: relative;
  width:100%;
  color:#6b6b69;
  z-index: 1;
`

const Container = styled.div<{ hideInput: boolean }>`
  box-shadow: ${({ theme }) => theme.shadows.inset};
  width:100%;
  display:flex;
  flex-direction:column;
`

interface CurrencyInputPanelProps {
  value: string
  onUserInput: (value: string) => void
  onMax?: () => void
  showMaxButton: boolean
  label?: string
  onCurrencySelect?: (currency: Currency) => void
  currency?: Currency | null
  disableCurrencySelect?: boolean
  hideBalance?: boolean
  pair?: Pair | null
  hideInput?: boolean
  otherCurrency?: Currency | null
  id: string
  tokenStatue: string
  showCommonBases?: boolean
}

export default function CurrencyInputPanel({
  value,
  onUserInput,
  onMax,
  showMaxButton,
  label = TranslateString(132, 'Input'),
  onCurrencySelect,
  currency,
  disableCurrencySelect = false,
  hideBalance = false,
  pair = null, // used for double token logo
  hideInput = false,
  otherCurrency,
  id,
  tokenStatue,
  showCommonBases
}: CurrencyInputPanelProps) {

  const theme = useContext(ThemeContext)
  const [modalOpen, setModalOpen] = useState(false)
  const { account } = useActiveWeb3React()
  const selectedCurrencyBalance = useCurrencyBalance(account ?? undefined, currency ?? undefined)

  const handleDismissSearch = useCallback(() => {
    setModalOpen(false)
  }, [setModalOpen])

  return (
    <InputPanel id={id}>
      <Container hideInput={hideInput}>

        <InputRow style={hideInput ? { padding: '0', borderRadius: '8px' } : {}} selected={disableCurrencySelect}>
          <div style={{ height: "175px", borderBottom: "1px solid #626263", width: "100%", padding: "50px 10px" }}>
            <div style={{ display: "flex" }}>
              {pair ? (
                <DoubleCurrencyLogo currency0={pair.token0} currency1={pair.token1} size={16} margin />
              ) : currency ? (
                <CurrencyLogo currency={currency} size="24px" style={{ marginRight: '8px' }} />
              ) : null}
              {pair ? (
                <Text color="card" style={{ color: "#626263" }}>
                  {pair?.token0.symbol}:{pair?.token1.symbol}
                </Text>
              ) : (
                <Text color="card" style={{ color: "#626263" }}>
                  {(currency && currency.symbol && currency.symbol.length > 20
                    ? `${currency.symbol.slice(0, 4)
                    }...${currency.symbol.slice(currency.symbol.length - 5, currency.symbol.length)}`
                    : currency?.symbol) || <TranslatedText translationId={82}>Select a currency</TranslatedText>}
                </Text>
              )}
            </div>
            <CurrencySelect
              selected={!!currency}
              className="open-currency-select-button"
              onClick={() => {
                if (!disableCurrencySelect) {
                  setModalOpen(true)
                }
              }}
            >
              <Aligner>
                {pair ? (
                  <Text color="card" style={{ color: "white", fontSize: "26px" }}>
                    {pair?.token0.name}:{pair?.token1.name}
                  </Text>
                ) : (
                  <Text color="card" style={{ color: "white", fontSize: "26px" }}>
                    {(currency && currency.name && currency.name.length > 20
                      ? `${currency.name.slice(0, 4)
                      }...${currency.name.slice(currency.name.length - 5, currency.name.length)}`
                      : currency?.name) || <TranslatedText translationId={82}>Select</TranslatedText>}
                  </Text>
                )}
                {!disableCurrencySelect && <ChevronDownIcon color="white" />}
              </Aligner>
            </CurrencySelect>
          </div>
          {!hideInput && (
            <LabelRow>
              <RowBetween>
                <Text color="card" fontSize="14px">{label}</Text>
                {account && (
                  <Text color="white" onClick={onMax} fontSize="14px" style={{ display: 'inline', cursor: 'pointer' }}>
                    {!hideBalance && !!currency && selectedCurrencyBalance
                      ? `Balance: ${selectedCurrencyBalance?.toSignificant(6)}`
                      : ' -'}
                  </Text>
                )}
              </RowBetween>
            </LabelRow>
          )}
          <div style={{ width: "92%", margin: "55px 0 5px", fontSize: "17px", color: "#b68af1", textAlign: "left" }}>{tokenStatue}</div>
          {!hideInput && (
            <div style={{ display: "flex" }}>
              <NumericalInput
                className="token-amount-input"
                value={value}
                onUserInput={val => {
                  onUserInput(val)
                }}
              />
              {account && currency && showMaxButton && label !== 'To' && (
                <Button onClick={onMax} size="sm" variant="text">
                  MAX
                </Button>
              )}
            </div>
          )}

        </InputRow>
      </Container>
      {!disableCurrencySelect && onCurrencySelect && (
        <CurrencySearchModal
          isOpen={modalOpen}
          onDismiss={handleDismissSearch}
          onCurrencySelect={onCurrencySelect}
          selectedCurrency={currency}
          otherSelectedCurrency={otherCurrency}
          showCommonBases={showCommonBases}
        />
      )}
    </InputPanel>
  )
}
