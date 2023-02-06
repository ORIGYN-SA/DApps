import React, { useState, useEffect } from 'react';
import { Flex, TextInput, CheckboxInput, Button, HR, Select } from '@origyn-sa/origyn-art-ui';
import type { CandyClassEditor, CandyBool } from '../../../types';
import { VALIDATION_ERRORS } from '../../../constants';
import { convertToCandyBool } from './converters';

export const BoolForm = (editor: CandyClassEditor) => {
    const [name, setName] = useState<string>('');
    const [value, setValue] = useState<CandyBool>();
    const [formValue, setFormValue] = useState<string>('');
    const [immutable, setImmutable] = useState<boolean>(false);
    const [isInvalid, setIsInvalid] = useState<boolean>(false);
    const [validationError, setValidationError] = useState<string>(null);
    const [isRemoved, setIsRemoved] = useState<boolean>(false);

    const onNameChanged = (typedName: React.ChangeEvent<HTMLInputElement>) => {
        setName(typedName.target.value);
    };

    const onImmutableChanged = () => {
        setImmutable(!immutable);
    };

    const onValueChanged = (selectedValue: string) => {
        const boolValue = convertToCandyBool(selectedValue);
        if (boolValue) {
            setValue(boolValue);
            setFormValue(selectedValue);
            setIsInvalid(false);
        } else {
            setIsInvalid(true);
            setFormValue(selectedValue);
            setValidationError(VALIDATION_ERRORS.boolean);
        }
    };

    const onRemove = (): void => {
        setIsRemoved(true);
    };

    const saveProperty = () => {
        editor.addPropertyToCandyClass({
            name: name,
            value: value,
            immutable: immutable,
        });
    };

    useEffect(() => {
        if (editor.editorMode === 'edit') {
            const candyValue = editor.property.value as CandyBool;
            setName(editor.property.name);
            setValue(candyValue);
            setImmutable(editor.property.immutable);
            setFormValue(candyValue.Bool.valueOf().toString());
        }
    }, [editor.editorMode]);

    useEffect(() => {
        if (editor.editorMode === 'edit') {
            editor.editExistingProperty({
                name: name,
                value: value,
                immutable: immutable,
            });
        }
    }, [name, value, immutable]);

    useEffect(() => {
        if (editor.editorMode === 'edit') editor.removePropertyFromCandyClass(editor.property);
    }, [isRemoved]);

    return (
        <>
            <HR marginTop={8} marginBottom={16} />
            {editor.editorMode === 'create' ? (
                <>
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
            ) : (
                <>
                    {editor.property.immutable ? (
                        <>
                            <Flex>
                                <TextInput label="Name" onChange={onNameChanged} value={name} />
                            </Flex>
                            <Flex>
                                <Select
                                    inputSize="medium"
                                    label="Value"
                                    selectedOption={{
                                        value: formValue,
                                        label: formValue,
                                    }}
                                />
                            </Flex>
                        </>
                    ) : (
                        <>
                            <Flex>
                                <TextInput label="Name" onChange={onNameChanged} value={name} />
                            </Flex>
                            <Flex>
                                {isInvalid ? (
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
                                        error={true}
                                    />
                                ) : (
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
                                        selectedOption={{
                                            value: formValue,
                                            label: formValue,
                                        }}
                                    />
                                )}
                            </Flex>
                            <Flex>
                                <Flex>
                                    <CheckboxInput label="Immutable" name="immutable" onChange={onImmutableChanged} />
                                </Flex>
                            </Flex>
                            <Flex>
                                <Button size="small" btnType="filled" onClick={onRemove}>
                                    Remove CandyValue
                                </Button>
                            </Flex>
                        </>
                    )}
                </>
            )}
        </>
    );
};
