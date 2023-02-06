import React, { useState, useEffect } from 'react';
import { Flex, TextInput, CheckboxInput, Button, HR } from '@origyn-sa/origyn-art-ui';
import type { CandyClassEditor, CandyFloat } from '../../../types';
import { VALIDATION_ERRORS } from '../../../constants';
import { convertToCandyFloat } from './converters';

export const FloatForm = (editor: CandyClassEditor) => {
    const [name, setName] = useState<string>('');
    const [value, setValue] = useState<CandyFloat>();
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

    const onValueChanged = (typedValue: React.ChangeEvent<HTMLInputElement>) => {
        const floatValue = convertToCandyFloat(typedValue.target.value);
        if (floatValue) {
            setValue(floatValue);
            setFormValue(typedValue.target.value);
            setIsInvalid(false);
        } else {
            setIsInvalid(true);
            setFormValue(typedValue.target.value);
            setValidationError(VALIDATION_ERRORS.float);
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
            const candyValue = editor.property.value as CandyFloat;
            setName(editor.property.name);
            setValue(candyValue);
            setImmutable(editor.property.immutable);
            setFormValue(candyValue.Float.valueOf().toString());
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
                        {isInvalid ? (
                            <TextInput label="Value" onChange={onValueChanged} error={validationError} />
                        ) : (
                            <TextInput label="Value" onChange={onValueChanged} />
                        )}
                    </Flex>
                    <Flex>
                        <Flex>
                            <CheckboxInput label="Immutable" name="immutable" onChange={onImmutableChanged} />
                        </Flex>
                    </Flex>
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
                                <TextInput label="Name" value={name} disabled={immutable} />
                            </Flex>
                            <Flex>
                                <TextInput label="Value" value={formValue} disabled={immutable} />
                            </Flex>
                        </>
                    ) : (
                        <>
                            <Flex>
                                <TextInput label="Name" onChange={onNameChanged} value={name} />
                            </Flex>
                            <Flex>
                                {isInvalid ? (
                                    <TextInput
                                        label="Value"
                                        onChange={onValueChanged}
                                        error={validationError}
                                        value={formValue}
                                    />
                                ) : (
                                    <TextInput label="Value" onChange={onValueChanged} value={formValue} />
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
