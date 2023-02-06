import React, { useState, useEffect } from 'react';
import { Flex, TextInput, CheckboxInput, Button, Grid, Select, HR } from '@origyn-sa/origyn-art-ui';
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
                            <Grid column={1}>
                                <TextInput value={name} />
                            </Grid>
                            <Grid column={2}>
                                <Select
                                    inputSize="medium"
                                    selectedOption={{
                                        value: formValue,
                                        label: formValue,
                                    }}
                                />
                            </Grid>
                            <Grid column={3}>
                                <span>Property is immutable</span>
                            </Grid>
                            <Grid column={4}>
                                <span>Property is immutable</span>
                            </Grid>
                        </>
                    ) : (
                        <>
                            <Grid column={1}>
                                <TextInput onChange={onNameChanged} value={name} />
                            </Grid>
                            <Grid column={2}>
                                {isInvalid ? (
                                    <Select
                                        inputSize="medium"
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
                            </Grid>
                            <Grid column={3}>
                                <CheckboxInput label="Immutable" name="immutable" onChange={onImmutableChanged} />
                            </Grid>
                            <Grid column={4}>
                                <Flex>
                                    <span style={{ marginTop: 'auto', marginBottom: 'auto' }}>
                                        <Button size="small" btnType="filled" onClick={onRemove}>
                                            Remove CandyValue
                                        </Button>
                                    </span>
                                </Flex>
                            </Grid>
                        </>
                    )}
                </>
            )}
        </>
    );
};
