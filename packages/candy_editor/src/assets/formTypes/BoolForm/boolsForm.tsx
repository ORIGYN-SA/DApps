import React, { useState } from 'react';
import {
    Flex,
    Container,
    TextInput,
    CheckboxInput,
    Button,
    HR,
    Select,
} from '@origyn-sa/origyn-art-ui';
import type { CandyClassEditor, CandyBool } from '../../../types';
import { VALIDATION_ERRORS } from '../../../constants';
import { convertToBool } from './converters';

export const BoolsForm = (editor: CandyClassEditor) => {
    const [name, setName] = useState<string>('');
    const [value, setValue] = useState<CandyBool>();
    const [immutable, setImmutable] = useState<boolean>(false);
    const [isInvalid, setIsInvalid] = useState<boolean>(false);
    const [validationError, setValidationError] = useState<string>(null);

    const onNameChanged = (typedName: React.ChangeEvent<HTMLInputElement>) => {
        setName(typedName.target.value);
    };

    const onImmutableChanged = () => {
        setImmutable(!immutable);
    };

    const onValueChanged = (selectedValue: string) => {
        const boolValue = convertToBool(selectedValue);
        if (boolValue) {
            setValue(boolValue);
            setIsInvalid(false);
        } else {
            setIsInvalid(true);
            setValidationError(VALIDATION_ERRORS.BOOL);
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
                    <Select
                        inputSize="medium"
                        label="Value"
                        handleChange={(opt) => {
                            onValueChanged(opt.value);
                        }}
                        options={[
                            { value: 'true', label: 'true' },
                            { value: 'false', label: 'false' },
                        ]}
                    />
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
