import React, { useState } from 'react';
import { Flex, Container, TextInput, CheckboxInput, Button, HR } from '@origyn-sa/origyn-art-ui';
import type { CandyClassEditor, CandyIntegers } from '../../../types';
import { VALIDATION_ERRORS } from '../../../constants';
import {
    convertToCandyInt,
    convertToCandyInt8,
    convertToCandyInt16,
    convertToCandyInt32,
    convertToCandyInt64,
} from './converters';

export const IntegersForm = (editor: CandyClassEditor) => {
    const [name, setName] = useState<string>('');
    const [value, setValue] = useState<CandyIntegers>();
    const [immutable, setImmutable] = useState<boolean>(false);
    const [isInvalid, setIsInvalid] = useState<boolean>(false);
    const [validationError, setValidationError] = useState<string>(null);

    const onNameChanged = (typedName: React.ChangeEvent<HTMLInputElement>) => {
        setName(typedName.target.value);
    };

    const onImmutableChanged = () => {
        setImmutable(!immutable);
    };

    const onValueChanged = (typedValue: React.ChangeEvent<HTMLInputElement>): void => {
        let integerValue: CandyIntegers;
        switch (editor.candyType) {
            case 'Int':
                integerValue = convertToCandyInt(typedValue.target.value);
                if (integerValue) {
                    setValue(integerValue);
                    setIsInvalid(false);
                } else {
                    setIsInvalid(true);
                    setValidationError(VALIDATION_ERRORS.int);
                }
                break;
            case 'Int8':
                integerValue = convertToCandyInt8(typedValue.target.value);
                if (integerValue) {
                    setValue(integerValue);
                    setIsInvalid(false);
                } else {
                    setIsInvalid(true);
                    setValidationError(VALIDATION_ERRORS.int8);
                }
                break;
            case 'Int16':
                integerValue = convertToCandyInt16(typedValue.target.value);
                if (integerValue) {
                    setValue(integerValue);
                    setIsInvalid(false);
                } else {
                    setIsInvalid(true);
                    setValidationError(VALIDATION_ERRORS.int16);
                }
                break;
            case 'Int32':
                integerValue = convertToCandyInt32(typedValue.target.value);
                if (integerValue) {
                    setValue(integerValue);
                    setIsInvalid(false);
                } else {
                    setIsInvalid(true);
                    setValidationError(VALIDATION_ERRORS.int32);
                }
                break;
            case 'Int64':
                integerValue = convertToCandyInt64(typedValue.target.value);
                if (integerValue) {
                    setValue(integerValue);
                    setIsInvalid(false);
                } else {
                    setIsInvalid(true);
                    setValidationError(VALIDATION_ERRORS.int64);
                }
                break;
        }
    };

    const saveProperty = () => {
        switch (editor.editorMode) {
            case "create":
                editor.addPropertyToCandyClass({
                    name: name,
                    value: value,
                    immutable: immutable,
                });
                break;
            case "edit":
                alert('edit');
        }
    };

    return (
        <>
            <Flex>
                <TextInput label="Name" onChange={onNameChanged} />
            </Flex>
            <Flex>
                <TextInput label="Value" onChange={onValueChanged} />
            </Flex>
            <Flex>
                <Flex>
                    <CheckboxInput label="Immutable" name="immutable" onChange={onImmutableChanged} />
                </Flex>
            </Flex>
            <HR marginTop={8} marginBottom={16} />
            {isInvalid && (
                <>
                    <Flex>{validationError}</Flex>
                    <HR marginTop={8} marginBottom={16} />
                </>
            )}
            <Flex>
                <Button size="small" btnType="filled" onClick={saveProperty} disabled={isInvalid}>
                    Save Property
                </Button>
            </Flex>
        </>
    );
};
