import React, { useContext, useEffect, useState } from "react";
import BigNumber from "bignumber.js";
import { useDebug } from "@dapp/features-debug-provider";
import { Principal } from "@dfinity/principal";
import {
  sendTransaction,
  Token,
  useTokensContext,
} from "@dapp/features-tokens-provider";
import {
  Container,
  Flex,
  HR,
  Modal,
  TextInput,
  Select,
  Button,
  LoadingBar,
} from "@origyn/origyn-art-ui";
import * as Yup from "yup";
import { AuthContext } from "@dapp/features-authentication";
import {
  validateTokenAmount,
  toSmallerUnit,
  toLargerUnit,
  toBigNumber,
  getAccountId,
} from "@dapp/utils";
import { useUserMessages } from "@dapp/features-user-messages";
import { VALIDATION } from "../constants";

const DownArrow = () => {
  return (
    <svg
      width="12"
      height="7"
      viewBox="0 0 12 7"
      fill="242424"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M6.00018 6.95022C5.86685 6.95022 5.74185 6.92922 5.62518 6.88722C5.50852 6.84589 5.40018 6.77522 5.30018 6.67522L0.675185 2.05022C0.491851 1.86689 0.404518 1.63755 0.413184 1.36222C0.421184 1.08755 0.516851 0.858554 0.700184 0.675221C0.883518 0.491887 1.11685 0.40022 1.40018 0.40022C1.68352 0.40022 1.91685 0.491887 2.10018 0.675221L6.00018 4.57522L9.92518 0.65022C10.1085 0.466887 10.3379 0.37922 10.6132 0.38722C10.8879 0.395887 11.1168 0.491887 11.3002 0.675221C11.4835 0.858554 11.5752 1.09189 11.5752 1.37522C11.5752 1.65855 11.4835 1.89189 11.3002 2.07522L6.70018 6.67522C6.60018 6.77522 6.49185 6.84589 6.37518 6.88722C6.25852 6.92922 6.13352 6.95022 6.00018 6.95022Z"
        fill="#242424"
      />
    </svg>
  );
};

const UpArrow = () => {
  return (
    <svg
      width="12"
      height="7"
      viewBox="0 0 12 7"
      fill="242424"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M0.699316 6.6749C0.515983 6.49157 0.424316 6.25824 0.424316 5.9749C0.424316 5.69157 0.515983 5.45824 0.699316 5.2749L5.29932 0.674903C5.39932 0.574903 5.50765 0.503903 5.62432 0.461903C5.74098 0.420569 5.86598 0.399902 5.99932 0.399902C6.13265 0.399902 6.25765 0.420569 6.37432 0.461903C6.49098 0.503903 6.59932 0.574903 6.69932 0.674903L11.3243 5.2999C11.5077 5.48324 11.5993 5.70824 11.5993 5.9749C11.5993 6.24157 11.4993 6.4749 11.2993 6.6749C11.116 6.85824 10.8827 6.9499 10.5993 6.9499C10.316 6.9499 10.0826 6.85824 9.89932 6.6749L5.99932 2.7749L2.07432 6.6999C1.89098 6.88324 1.66598 6.9749 1.39932 6.9749C1.13265 6.9749 0.899316 6.8749 0.699316 6.6749Z"
        fill="#242424"
      />
    </svg>
  );
};
const validationSchema = Yup.object().shape({
  amount: Yup.number()
    .typeError(VALIDATION.notANumber)
    .nullable()
    .required(VALIDATION.amountRequired)
    .default(0),
  recipientAddress: Yup.string()
    .typeError(VALIDATION.invalidRecipientAddress)
    .required(VALIDATION.recipientAddressRequired)
    .default(""),
  memo: Yup.number()
    .nullable()
    .transform((value, originalValue) => {
      return originalValue.trim() === "" ? null : value;
    })
    .notRequired()
    .typeError(VALIDATION.notANumber),
  token: Yup.string().default("OGY"),
});

const TransferTokensModal = ({ open, handleClose }: any) => {
  const debug = useDebug();
  const { walletTokens, activeTokens } = useTokensContext();
  const { showErrorMessage, showUnexpectedErrorMessage } = useUserMessages();
  const { activeWalletProvider } = useContext(AuthContext);
  const [inProcess, setInProcess] = useState(false);
  // @ts-ignore
  const [values, setValues] = React.useState<any>(validationSchema.default());
  const [errors, setErrors] = React.useState<any>({});
  const [amountDisplay, setAmountDisplay] = useState("0");
  const [totalDisplay, setTotalDisplay] = useState("0");
  const [feeDisplay, setFeeDisplay] = useState("");
  const [success, setSuccess] = useState(false);
  const [advancedTab, setAdvancedTab] = useState(false);

  const onChange = (name: string, value: any) => {
    setErrors({ ...errors, [name]: undefined });
    setValues({ ...values, [name]: value });

    if (name === "amount") {
      onAmountChanged(value);
    } else if (name === "token") {
      onTokenChanged(value);
    }
  };

  const onAmountChanged = (value: string) => {
    const token = walletTokens[values.token];

    if (token.decimals !== undefined) {
      let validationMsg = validateTokenAmount(value, token.decimals);
      if (validationMsg) {
        setErrors({ ...errors, amount: validationMsg });
      } else {
        const amount = toBigNumber(value || 0);
        updateTotals(token, amount);
      }
    }
  };

  const onTokenChanged = (value: string) => {
    const token = walletTokens[value];
    const amount = toBigNumber(values.amount || 0);
    updateTotals(token, amount);
  };

  const updateTotals = (token: Token, amount: BigNumber) => {
    if (!token || !token.decimals || !token.fee) {
      throw new Error("Token is undefined");
    }
    const fee = toLargerUnit(token.fee, token.decimals);
    const total = amount.plus(fee);
    setAmountDisplay(amount.toFixed());
    setTotalDisplay(total.toFixed());
    setFeeDisplay(toLargerUnit(token.fee, token.decimals).toFixed());
  };

  const sendTrx = async (data) => {
    
    try {
      setInProcess(true);

      const token = walletTokens[data.token];

      if (!token || !token.decimals) {
        throw new Error("Token is undefined");
      }
      const total = toSmallerUnit(data.amount, token.decimals);
      let address: string = data.recipientAddress;

      // if this is a principal id, convert to an account number
      if (address.includes("-")) {
        address = getAccountId(Principal.fromText(address));
      }

      debug.log(`Sending: ${total.toFixed()} ${token.symbol} to ${address}`);

      const result = await sendTransaction(
        activeWalletProvider,
        token,
        address,
        total,
        Number(data.memo)
      );

      setInProcess(false);

      if (result.err) {
        showErrorMessage("Token transfer failed", result.err);
      } else {
        setSuccess(true);
      }
    } catch (e) {
      showUnexpectedErrorMessage(e);
    } finally {
      setInProcess(false);
    }
  };

  const getValidationErrors = (err) => {
    const validationErrors = {};

    err.inner.forEach((error) => {
      if (error.path) {
        validationErrors[error.path] = error.message;
      }
    });

    return validationErrors;
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();

    // TODO: validate address

    const amount = toBigNumber(values.amount || 0);
    if (amount.isLessThanOrEqualTo(0)) {
      setErrors({ ...errors, amount: "Amount can not be 0" });
      return;
    }

    validationSchema
      .validate(values, { abortEarly: false })
      .then(() => {
        sendTrx(values);
      })
      .catch(function (e) {
        const errs = getValidationErrors(e);
        setErrors(errs);
        setSuccess(false);
      });
  };

  const handleSuccess = () => {
    handleClose(false);
    setSuccess(false);
  };

  useEffect(() => {
    setValues({ token: "OGY", amount: "", memo: "", recipientAddress: "" });
  }, [open]);

  const tokenOptions = Object.keys(activeTokens).map((standard) => ({
    value: standard,
    label: standard,
  }));

  return (
    <Modal isOpened={open} closeModal={() => handleClose(false)} size="md">
      {success ? (
        <Container size="full" padding="48px">
          <h2>Success!</h2>
          <br />
          <span>
            Your transfer of {amountDisplay} {values.token} is complete. Click
            done to return to the dashboard.
          </span>
          <br />
          <br />
          <Button btnType="filled" onClick={handleSuccess}>
            Done
          </Button>
        </Container>
      ) : inProcess ? (
        <Container size="full" padding="48px">
          <h2>Transfer in Progress</h2>
          <br />
          <Flex justify="center" align="center">
            <LoadingBar />
          </Flex>
        </Container>
      ) : (
        <Container as="form" onSubmit={handleSubmit} size="full" padding="48px">
          <h2>Transfer Tokens</h2>
          <br />
          <Flex flexFlow="column" gap={8}>
            <br />
            <span>Select token</span>
            <Select
              placeholder="OGY"
              handleChange={(option) => onChange("token", option.value)}
              options={tokenOptions}
              selectedOption={tokenOptions.find(
                (opt) => opt.label === values.token
              )}
            />
            <br />
            <Flex flexFlow="row" justify="space-between">
              <span>Amount</span>
              <span id="balance" className="secondary_color">
                Balance: {walletTokens[values.token]?.balance} {values.token}
              </span>
            </Flex>
            <TextInput
              name="amount"
              onChange={(e) => onChange("amount", e.target.value)}
              value={values?.amount}
              error={errors?.amount}
            />
            <br />
            <span>Recipient Address</span>
            <TextInput
              name="recipientAddress"
              onChange={(e) => onChange("recipientAddress", e.target.value)}
              value={values.recipientAddress}
              error={errors.recipientAddress}
            />
            <br />
            <span>Transaction Fee</span>
            <span style={{ color: "grey" }}>{`${feeDisplay}${" "}${
              values.token
            }`}</span>
            <br />
          </Flex>
          <br />
          <HR />
          <br />
          <Flex flexFlow="row" align="center" justify="space-between">
            <h6>Total Amount</h6>
            <span>{totalDisplay}</span>
          </Flex>
          <br />
          <HR />

          <br />
          <Flex
            onClick={() => setAdvancedTab(!advancedTab)}
            fullWidth
            justify="space-between"
          >
            <span>Advanced Options</span>
            {advancedTab ? <DownArrow /> : <UpArrow />}
          </Flex>
          {advancedTab && (
            <>
              <br />
              <span style={{ marginBottom: "8px" }}>
                Memo{" "}
                <span className="secondary_color">{`${"(Optional)"}`}</span>
              </span>
              <br />
              <span className="secondary_color" style={{ marginBottom: "8px" }}>
                This is a 64-bit number chosen by the sender; it can be used in
                various ways, e.g. to identify specific transfers.{" "}
              </span>
              <br />
              <br />
              <TextInput
                name="memo"
                value={values.memo}
                onChange={(e) => onChange("memo", e.target.value)}
                error={errors.memo}
                placeholder="Add Memo"
              />
            </>
          )}
          <br />
          <Flex justify="flex-end">
            <Button btnType="filled" type="submit">
              Transfer {values.token}
            </Button>
          </Flex>
        </Container>
      )}
    </Modal>
  );
};

export default TransferTokensModal;
