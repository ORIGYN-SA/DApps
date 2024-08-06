import React, { useEffect, useState } from "react";
import {
  Card,
  Flex,
  Grid,
  Button,
  HR,
  Select,
  Container,
  Modal,
  Toggle,
} from "@origyn/origyn-art-ui";
import { FormTypes } from "./formTypes";
import type {
  CandyClassEditor,
  EditorMode,
  EditableCandyClass,
  CandyDataEditorProps,
} from "../types";
import {
  CandyProperty,
  CandyClass,
  CandyType,
  PropertyWithId,
} from "@dapp/common-types";
import { getValueType } from "../utils/functions";
import {
  NOT_SELECTED,
  SELECT_OPTIONS,
  CREATE_MODE,
  EDIT_MODE,
  MESSAGES,
} from "../constants";

export const CandyDataEditor = (candyDataEditor: CandyDataEditorProps) => {
  const [candyType, setCandyType] = useState<CandyType>(NOT_SELECTED);
  const [candyClass, setCandyClass] = useState<CandyClass>({ Class: [] });
  const [editableCandyClass, setEditableCandyClass] =
    useState<EditableCandyClass>({ Class: [] });
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [editorMode, setEditorMode] = useState<EditorMode>(EDIT_MODE);
  const [readOnly, setReadOnly] = useState<boolean>(false);

  const addCandyClassEditor: CandyClassEditor = {
    addPropertyToCandyClass: (property: PropertyWithId) => {
      setEditableCandyClass((previous) => {
        const newClass = [...previous.Class, property];
        return {
          ...{
            Class: newClass,
          },
        };
      });
    },
    candyType: candyType,
    editorMode: editorMode,
  };

  const removeProperty = (propertyIndex: number): void => {
    setEditableCandyClass((previous) => {
      const firstPart = previous.Class.slice(0, propertyIndex);
      const secondPart = previous.Class.slice(propertyIndex + 1);
      return {
        ...{
          Class: [...firstPart, ...secondPart],
        },
      };
    });
  };

  const editExistingProperty = (
    updatedProperty: CandyProperty,
    propertyIndex: number
  ) => {
    // console.log('🚀 UPDATED PROPERTY #' + propertyIndex, updatedProperty);
    const updated = editableCandyClass.Class.map((property, index) => {
      if (index === propertyIndex) {
        return { ...property, ...updatedProperty };
      }
      return property;
    });
    setEditableCandyClass({ Class: updated });
  };

  const createEditCandyClassEditor = (
    candyType: string,
    property: CandyProperty,
    propertyIndex: number
  ): CandyClassEditor => {
    return {
      candyType,
      editorMode,
      editExistingProperty: (updatedProperty: CandyProperty) =>
        editExistingProperty(updatedProperty, propertyIndex),
      property,
    };
  };

  const handleToggleReadOnly = (): void => {
    setReadOnly(!readOnly);
  };

  const displayModal = (): void => {
    setOpenModal(true);
    setEditorMode(CREATE_MODE);
  };

  const closeModal = (): void => {
    setOpenModal(false);
    setCandyType(NOT_SELECTED);
    setEditorMode(EDIT_MODE);
  };

  const handleSelectChange = (candySelectedType: CandyClass): void => {
    setCandyType(candySelectedType);
  };

  const saveCandyClass = (): void => {
    let properties: CandyProperty[] = editableCandyClass.Class.map(
      (property) => {
        return {
          name: property.name,
          immutable: property.immutable,
          value: property.value,
        };
      }
    );
    setCandyClass({ Class: properties });
  };

  useEffect(() => {
    setCandyType(NOT_SELECTED);
    closeModal();
  }, [editableCandyClass]);

  // useEffect(() => {
  //   console.log('🍬 CANDYCLASS', candyClass);
  // }, [candyClass]);

  useEffect(() => {
    if (!candyDataEditor.existingCandyClass) {
      throw new Error("CandyData is undefined");
    }

    setCandyClass(candyDataEditor.existingCandyClass);

    let propertiesWithId: PropertyWithId[] =
      candyDataEditor.existingCandyClass.Class.map((property) => {
        return {
          name: property.name,
          immutable: property.immutable,
          value: property.value,
          id: Math.random().toString(),
        };
      });
    setEditableCandyClass({ Class: propertiesWithId });

    if (candyDataEditor.readOnly) {
      setReadOnly(true);
    }
  }, []);

  return (
    <Card type="outlined">
      <Container>
        <Flex flexFlow="column" gap={16}>
          <Flex>
            <Toggle
              checked={readOnly}
              disabled={candyDataEditor?.readOnly}
              handleToggle={() => handleToggleReadOnly()}
              style={{ marginBottom: "auto", marginTop: "auto" }}
            />
            <span style={{ marginLeft: "16px" }}>
              {candyDataEditor.readOnly
                ? MESSAGES.readOnlyMode
                : "Read Only Mode"}
            </span>
          </Flex>
          <HR marginTop={8} marginBottom={8} />
          {readOnly ? (
            <>
              {candyClass?.Class?.length > 0 ? (
                <>
                  <pre>
                    {JSON.stringify(
                      candyClass,
                      (key, value) =>
                        typeof value === "bigint" ? value.toString() : value,
                      4
                    )}
                  </pre>
                </>
              ) : (
                <>
                  <span>{MESSAGES.emptyCandyClass}</span>
                </>
              )}
            </>
          ) : (
            <>
              <Flex>
                <Button size="small" btnType="filled" onClick={displayModal}>
                  + Add Candy Value
                </Button>
              </Flex>
              <HR marginTop={8} marginBottom={8} />
              {editableCandyClass?.Class?.length > 0 && (
                <>
                  <Grid columns={5} gap={16}>
                    <Grid columns={1}>Property Type</Grid>
                    <Grid columns={2}>Property Name</Grid>
                    <Grid columns={3}>Property Value</Grid>
                    <Grid columns={4}>Immutable</Grid>
                    <Grid columns={5}>Actions</Grid>
                  </Grid>
                  {editableCandyClass.Class.map((property, index) => {
                    const item = getValueType(property);
                    return (
                      <>
                        <Grid columns={5} gap={16} key={property.id}>
                          {FormTypes[item.type](
                            createEditCandyClassEditor(
                              item.type,
                              property,
                              index
                            )
                          )}
                          {!property.immutable && (
                            <Grid columns={5}>
                              <Flex>
                                <span
                                  style={{
                                    marginBottom: "auto",
                                    marginTop: "auto",
                                  }}
                                >
                                  <Button
                                    size="small"
                                    btnType="filled"
                                    onClick={() => removeProperty(index)}
                                  >
                                    Remove
                                  </Button>
                                </span>
                              </Flex>
                            </Grid>
                          )}
                        </Grid>
                        <HR marginTop={8} marginBottom={8} />
                      </>
                    );
                  })}
                </>
              )}
              <Flex flexFlow="column" gap={24}>
                <Flex align="flex-end" justify="flex-end">
                  <Button
                    size="medium"
                    btnType="filled"
                    onClick={() => saveCandyClass()}
                  >
                    Save Candy Class
                  </Button>
                </Flex>
              </Flex>
            </>
          )}
        </Flex>
      </Container>
      <Modal
        closeModal={closeModal}
        isOpened={openModal}
        mode="light"
        size="lg"
      >
        <Container size="full" padding="48px">
          <Flex flexFlow="column" gap={16}>
            <Flex>
              <Select
                inputSize="medium"
                label="Select Candy Type"
                handleChange={(type) => {
                  handleSelectChange(type.value);
                }}
                options={SELECT_OPTIONS.map((option) => ({
                  label: option.label,
                  value: option.value,
                }))}
              />
            </Flex>
            <Flex flexFlow="column" gap={16}>
              {candyType !== null ? (
                FormTypes[candyType.toString()](addCandyClassEditor)
              ) : (
                <>
                  <Flex>Select a Candy Type</Flex>
                </>
              )}
            </Flex>
          </Flex>
        </Container>
      </Modal>
    </Card>
  );
};
