import React, { useState } from "react";
import {
  Flex,
  TextInput,
  CheckboxInput,
  Button,
  HR,
  Container,
} from "@origyn/origyn-art-ui";
import { convertHexadecimalToCandyBytes } from "@dapp/utils";
import { VALIDATION_ERRORS } from "../../../../constants";
import { BytesFormInput, CandyBytes } from "@dapp/common-types";

export const HexadecimalInput = (input: BytesFormInput) => {
  const [name, setName] = useState<string>("");
  const [value, setValue] = useState<CandyBytes>();
  const [immutable, setImmutable] = useState<boolean>(false);
  const [isInvalid, setIsInvalid] = useState<boolean>(false);

  const onNameChanged = (typedName: React.ChangeEvent<HTMLInputElement>) => {
    setName(typedName.target.value);
  };

  const onValueChanged = (typedValue: React.ChangeEvent<HTMLInputElement>) => {
    let hexadecimalValue = convertHexadecimalToCandyBytes(
      typedValue.target.value
    );
    if (hexadecimalValue) {
      setIsInvalid(false);
      setValue(hexadecimalValue);
    } else {
      setIsInvalid(true);
    }
  };

  const onImmutableChanged = () => {
    setImmutable(!immutable);
  };

  const saveProperty = () => {
    if (value && input.addPropertyToCandyClass) {
      input.addPropertyToCandyClass({
        name: name,
        value: value,
        immutable: immutable,
        id: Math.random().toString(),
      });
    }
  };

  return (
    <>
      <HR marginTop={16} marginBottom={16} />
      <Container>
        <Flex flexFlow="column" gap={16}>
          <Flex>
            <TextInput label="Name" onChange={onNameChanged} />
          </Flex>

          <Flex>
            {isInvalid ? (
              <TextInput
                label="Base64 String"
                onChange={onValueChanged}
                error={VALIDATION_ERRORS.hexadecimal}
              />
            ) : (
              <TextInput label="Hexadecimal String" onChange={onValueChanged} />
            )}
          </Flex>
          <Flex>
            <Flex>
              <CheckboxInput
                label="Immutable"
                name="immutable"
                onChange={onImmutableChanged}
              />
            </Flex>
          </Flex>
          <Flex>
            <Button size="small" btnType="filled" onClick={saveProperty}>
              Save Property
            </Button>
          </Flex>
        </Flex>
      </Container>
    </>
  );
};
