import React, { useContext, useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { sendTransaction, useTokensContext } from '@dapp/features-tokens-provider';
import { DateTimePicker } from '@mui/x-date-pickers';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { TokenIcon } from '@dapp/features-components';
import { AuthContext } from '@dapp/features-authentication';
import { Container, Flex, HR, Modal, TextInput, Select } from '@origyn-sa/origyn-art-ui';

const TransferTokensModal = ({ currentToken, open, handleClose }: any) => {
  const { actor, ogyActor, principal } = React.useContext(AuthContext);
  const [isLoading, setIsLoading] = React.useState(false);
  const [token, setToken] = React.useState('OGY');
  const { tokens, refreshAllBalances } = useTokensContext();
  const [selectedToken, setSelectedToken] = useState();

  // const amount = 1 * 1e8;
  // const walletType = localStorage.getItem('loggedIn');
  // const saleInfo = await actor.sale_info_nft_origyn({ deposit_info: [] });

  // const { account_id } = saleInfo?.ok?.deposit_info ?? {};

  // const transactionHeight = await sendTransaction(
  //   walletType,
  //   tokens[token],
  //   new Uint8Array(account_id),
  //   amount,
  // );

  return (
    <div>
      <Modal isOpened={open} closeModal={() => handleClose(false)} size="md">
        <Container size="full" padding="48px">
          <h2>Transfer Tokens</h2>
          <br />
          <h3> You can only send OGY from your available balance.</h3>
          <Flex flexFlow="column" gap={8}>
            <br />
            <Select
              label="Select token"
              handleChange={(option) => {
                setSelectedToken(option.value);
              }}
              options={Object.keys(tokens).map((standard) => ({
                value: standard,
                label: standard,
              }))}
            />
          </Flex>
        </Container>
      </Modal>
    </div>
  );
};

// (<div>
//     <Modal
//      isOpened={open}
//       closeModal={() => handleClose(false)}
//       size="md"
//     >
//       <Container size='full' padding='48px'>
//         <h2>Transfer Tokens</h2>
//         <br/>
//         <Flex flexFlow="column" gap={8}>
//           <TextInput
//             required
//             label="Start Price"
//             id="startPrice"
//             value={startPrice}
//             onChange={(e) => setStartPrice(e.target.value)}
//             error={errors?.startPrice?.message as string || ""}
//           />
//           <TextInput
//             required
//             label="Min Increase"
//             id="minIncrease"
//             value={priceStep}
//             onChange={(e) => setPriceStep(e.target.value)}
//             error={errors?.minIncrease?.message as string || ""}
//           />
//           <TextInput
//             required
//             label="Buy Now Price"
//             id="outlined-basic"
//             value={buyNowPrice}
//             onChange={(e) => setBuyNowPrice(e.target.value)}
//             error={errors?.buyNowPrice?.message as string || ""}
//           />
//           <LocalizationProvider fullWidth dateAdapter={AdapterMoment}>
//             <DateTimePicker
//               label="End Date"
//               value={endDate}
//               onChange={(newValue) => {
//                 setEndDate(newValue);
//               }}
//               renderInput={(params) => (
//                 <TextField {...params} {...register('endDate')} error={!!errors.endDate} />
//               )}
//             />
//           </LocalizationProvider>
//           <FormControl fullWidth>
//             <InputLabel id="demo-simple-select-label">Token</InputLabel>
//             <Select
//               labelId="demo-simple-select-label"
//               id="demo-simple-select"
//               value={token}
//               label="Token"
//               onChange={handleChange}
//             >
//               {Object.keys(tokens).map((t, index) => (
//                 <MenuItem key={`${token}+${index}`} value={t}>
//                   <TokenIcon symbol={tokens[t].icon} />
//                   {tokens[t].symbol}
//                 </MenuItem>
//               ))}
//             </Select>
//           </FormControl>
//           <HR color='MID_GREY'/>
//           <Flex>
//             <Button onClick={() => handleClose(false)}>Cancel</Button>
//             <Button onClick={handleSubmit(customSubmit)} autoFocus>
//               Start
//             </Button>
//           </Flex>
//         </Flex>
//       </Container>
//     </Modal>
//   </div>)

export default TransferTokensModal;
