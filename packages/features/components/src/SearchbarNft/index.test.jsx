import React, { useContext, useEffect, useState } from "react";
import { render, fireEvent, waitFor, screen } from '../../../../../testUtils'
import '@testing-library/jest-dom'
import { SearchbarNft } from './index'


describe('Select-Autocomplete', () => {
    render(<SearchbarNft/>)

    //test1
    const Select = screen.getByTestId("autocomplete");
    test("CHECK THE RENDERING OF THE COMPONENT", () => {
        expect(Select).toBeInTheDocument(); 
    })

    //test2
    const Ids = screen.getByTestId("numberIds").textContent;
    test("CHECK IF IDS NUMBER IS UPDATED", () => {
        expect(Ids).not.toBeNull; 
    })

})
