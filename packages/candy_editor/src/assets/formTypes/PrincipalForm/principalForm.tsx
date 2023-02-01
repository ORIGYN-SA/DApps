import React, { useState } from 'react';
import { Flex, Container, TextInput, CheckboxInput, Button, HR } from '@origyn-sa/origyn-art-ui';
import type { CandyClassEditor, CandyPrincipal } from '../../../types';
import { VALIDATION_ERRORS } from '../../../constants';
import { convertToCandyPrincipal } from './converters';

export const PrincipalForm = (editor: CandyClassEditor) => {
    const [name, setName] = useState<string>('');
    const [value, setValue] = useState<CandyPrincipal>();
    const [immutable, setImmutable] = useState<boolean>(false);
    const [isInvalid, setIsInvalid] = useState<boolean>(false);
    const [validationError, setValidationError] = useState<string>(null);

    const onNameChanged = (typedName: React.ChangeEvent<HTMLInputElement>) => {
        setName(typedName.target.value);
    };

    const onImmutableChanged = () => {
        setImmutable(!immutable);
    };

    const onValueChanged = (typedValue: React.ChangeEvent<HTMLInputElement>) => {
        const principalValue = convertToCandyPrincipal(typedValue.target.value);
        if (principalValue) {
            setValue(principalValue);
            setIsInvalid(false);
        } else {
            setIsInvalid(true);
            setValidationError(VALIDATION_ERRORS.principal);
        }
    };

    const saveProperty = () => {
        editor.addPropertyToCandyClass({
            name: name,
            value: value,
            immutable: immutable,
        });
    };

    return (
        <Container>
            <Flex flexFlow="row" gap={16}>
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
        </Container>
    );
};
