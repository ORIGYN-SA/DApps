import React, { useState, useEffect } from 'react';
import { Buffer } from 'buffer';
import {
  Flex,
  TextInput,
  CheckboxInput,
  Grid,
  Select,
  TabContent,
  theme,
} from '@origyn-sa/origyn-art-ui';
import type { CandyClassEditor, CandyBytes, ArrayType } from '../../../types';
import { convertUint8ArrayToHex, convertUint8ArrayToBase64 } from './binaryConverters';
import { CREATE_MODE, EDIT_MODE, WARNING_MESSAGES } from '../../../constants';
import { FileInput } from './inputs/fileInput';
import { HexadecimalInput } from './inputs/hexInput';
import { Base64Input } from './inputs/base64Input';
import { InformationIcon } from '../../icons';
import { MenuList } from '../../components/menuList';
import { CopyIcon, DownloadIcon } from '../../icons';
import { lookup } from 'mrmime';

export const BytesForm = (editor: CandyClassEditor) => {
  const [name, setName] = useState<string>('');
  const [value, setValue] = useState<CandyBytes>();
  const [arrayType, setArrayType] = useState<ArrayType>('thawed');
  const [immutable, setImmutable] = useState<boolean>(false);

  const onNameChanged = (typedName: React.ChangeEvent<HTMLInputElement>) => {
    setName(typedName.target.value);
    if (editor.editorMode === EDIT_MODE) {
      editor.editExistingProperty(
        { name: typedName.target.value, value, immutable },
        editor.propertyIndex,
      );
    }
  };

  const onTypeChanged = (selectedType: ArrayType) => {
    if (editor.editorMode === CREATE_MODE) {
      setArrayType(selectedType);
    }
    if (editor.editorMode === EDIT_MODE) {
      editor.editExistingProperty(
        { name, value: { Bytes: { [selectedType]: value.Bytes[arrayType] } }, immutable },
        editor.propertyIndex,
      );
      setArrayType(selectedType);
    }
  };

  const onImmutableChanged = () => {
    setImmutable(!immutable);
    if (editor.editorMode === EDIT_MODE) {
      editor.editExistingProperty({ name, value, immutable: !immutable }, editor.propertyIndex);
    }
  };

  useEffect(() => {
    if (editor.editorMode === EDIT_MODE) {
      const candyBytes = editor.property.value as CandyBytes;
      setName(editor.property.name);
      setValue(candyBytes);
      setImmutable(editor.property.immutable);
    }
  }, [editor.editorMode]);

  const copyString = (stringToCopy: string): void => {
    navigator.clipboard.writeText(stringToCopy);
  };

  const downloadBinaryArray = (uint8Array: Uint8Array) => {
    const blob = new Blob([uint8Array], { type: 'application/octet-stream' });
    const url = URL.createObjectURL(blob);
    const filename = name;
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const downloadFile = (uint8Array: Uint8Array) => {
    const buffer = Buffer.from(uint8Array);
    const blob = new Blob([buffer]);
    const fileType = lookup(name) || 'application/octet-stream';
    const file = new File([blob], name, { type: fileType });
    console.log(file);
    const url = URL.createObjectURL(file);
    const filename = name;
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <>
      {editor.editorMode === CREATE_MODE ? (
        <>
          <Flex flexFlow="row" gap={16}>
            <Flex>
              <InformationIcon
                style={{ marginBottom: 'auto', marginTop: 'auto', fill: theme.colors.ACCENT_COLOR }}
              />
            </Flex>
            <Flex>
              <p>{WARNING_MESSAGES.helpTextBytes}</p>
            </Flex>
          </Flex>
          <TabContent
            tabs={[
              {
                title: 'Base64',
                id: 'Base64',
              },
              {
                title: 'Hexadecimal',
                id: 'Hexadecimal',
              },
              {
                title: 'File upload',
                id: 'File upload',
              },
            ]}
            fullWidth={true}
            justify="flex-start"
            content={[
              <Base64Input key="base64" addPropertyToCandyClass={editor.addPropertyToCandyClass} />,
              <HexadecimalInput
                key="hex"
                addPropertyToCandyClass={editor.addPropertyToCandyClass}
              />,
              <FileInput key="file" addPropertyToCandyClass={editor.addPropertyToCandyClass} />,
            ]}
          />
        </>
      ) : (
        <>
          <Grid column={1}>
            <span style={{ marginTop: 'auto', marginBottom: 'auto' }}>
              <b>{editor.candyType}</b>
            </span>
          </Grid>
          <Grid column={2}>
            <TextInput onChange={onNameChanged} value={name} />
          </Grid>
          <Grid column={3}>
            <Flex flexFlow="column" gap={16}>
              <Flex>
                <Select
                  handleChange={(opt) => {
                    onTypeChanged(opt.value);
                  }}
                  selectedOption={{ value: arrayType, label: arrayType }}
                  options={[
                    { value: 'thawed', label: 'thawed' },
                    { value: 'frozen', label: 'frozen' },
                  ]}
                />
              </Flex>
              <Flex flexFlow="row" gap={16}>
                <Flex>Size: {value?.Bytes[arrayType].length} Bytes</Flex>
                <Flex>
                  <MenuList
                    content={[
                      {
                        listItemText: 'Copy as Base64',
                        listItemIcon: <CopyIcon width={12} height={12} fill="#fff" />,
                        listItemFunction: () =>
                          copyString(convertUint8ArrayToBase64(value?.Bytes[arrayType])),
                      },
                      {
                        listItemText: 'Copy as Hexadecimal',
                        listItemIcon: <CopyIcon width={12} height={12} fill="#fff" />,
                        listItemFunction: () =>
                          copyString(convertUint8ArrayToHex(value?.Bytes[arrayType])),
                      },
                      {
                        listItemText: 'Download as Binary Array',
                        listItemIcon: <DownloadIcon width={12} height={12} fill="#fff" />,
                        listItemFunction: () => downloadBinaryArray(value?.Bytes[arrayType]),
                      },
                      {
                        listItemText: 'Download as File',
                        listItemIcon: <DownloadIcon width={12} height={12} fill="#fff" />,
                        listItemFunction: () => downloadFile(value?.Bytes[arrayType]),
                      },
                    ]}
                  >
                    <p
                      style={{
                        textDecoration: 'underline',
                        textDecorationStyle: 'dotted',
                        cursor: 'pointer',
                        marginBottom: '4px',
                      }}
                    >
                      Data
                    </p>
                  </MenuList>
                </Flex>
              </Flex>
            </Flex>
          </Grid>
          <Grid column={4}>
            {editor.property.immutable ? (
              <span style={{ marginTop: 'auto', marginBottom: 'auto' }}>Property is immutable</span>
            ) : (
              <CheckboxInput label="Immutable" name="immutable" onChange={onImmutableChanged} />
            )}
          </Grid>
          {editor.property.immutable && (
            <>
              <Grid column={5}>
                <span style={{ marginTop: 'auto', marginBottom: 'auto' }}>
                  Property is immutable
                </span>
              </Grid>
            </>
          )}
        </>
      )}
    </>
  );
};
