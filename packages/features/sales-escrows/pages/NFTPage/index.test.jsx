import React from 'react'
import { render, fireEvent, waitFor, screen } from '../../../../../testUtils'
import '@testing-library/jest-dom'
import { NFTPage } from './index'

describe('NFT Page', () => {
  it('should collapse the description onClick', () => {
    const { container, getByText } = render(<NFTPage />)

    const setStateMock = jest.fn()
    const useStateMock = (useState) => [useState, setStateMock]
    jest.spyOn(React, 'useState').mockImplementation(useStateMock)

    const elementToClick = getByText('Description')
    fireEvent.click(elementToClick)
    expect(setStateMock).toHaveBeenCalledWith('panel2')
  })
})
