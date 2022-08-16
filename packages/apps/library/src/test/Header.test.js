import HeaderPart from "../components/Header";

// import { render, screen, cleanup } from "@testing-library/react";
// // Importing the jest testing library
// import '@testing-library/jest-dom'
// import Button from "./Button";
  
// // afterEach function runs after each test suite is executed
// afterEach(() => {
//     cleanup(); // Resets the DOM after each test suite
// })
  
// describe("Button Component" ,() => {
//     const setToggle= jest.fn(); 
//     render(<Button setToggle={setToggle} btnTxt="Click Me!"/>); 
//     const button = screen.getByTestId("button"); 
      
//     // Test 1
//     test("Button Rendering", () => {
//         expect(button).toBeInTheDocument(); 
//     })
  
//     // Test 2 
//     test("Button Text", () => {
//         expect(button).toHaveTextContent("Click Me!"); 
//     })
// })

// import { TypeTokenSpec } from '../typeToken';
// import testData from './data';

// const Canister = testData.typeToken.canister;
// const tokenObject = TypeTokenSpec(Canister, 'FeeHere', 'Ogy', 'DecimalHere', 'Standard');
// const canisterString = '6i6da-t3dfv-vteyg-v5agl-tpgrm-63p4y-t5nmm-gi7nl-o72zu-jd3sc-7qe';
// const expectedObj =  {
//     canister_string: '6i6da-t3dfv-vteyg-v5agl-tpgrm-63p4y-t5nmm-gi7nl-o72zu-jd3sc-7qe',
//     fee: 'FeeHere',
//     symbol: 'Ogy',
//     decimal: 'DecimalHere',
//     standard: 'Standard'
//   }
// describe('Utils > TypeTokenSpec', () => {
//   it('should return the correct Canister String', () => {
//     expect(tokenObject.canister_string).toBe(canisterString);
//   });

//   it('should return the correct Object', () => {
//     expect(tokenObject).toMatchObject(expectedObj);
//   });

// });