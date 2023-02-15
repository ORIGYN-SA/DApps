import React, { useEffect, useState } from 'react';
import {
  Container,
  HR,
  Grid,
  Flex,
  Button,
  CustomTable,
  Card,
  Select,
  TextInput,
} from '@origyn-sa/origyn-art-ui';
import { LoadingContainer } from '@dapp/features-components';
import styled from 'styled-components';
import AddDataModal from '../../../components/lists/AddData';
import { dataStructures, formTemplate } from './Minter';
import AddDataSection from '../../../modals/AddDataSection';
import { initTemplate } from './Template';

const StyledSectionTitle = styled.div`
  margin: 48px 24px;
  width: 70%;
`;

const CustomGrid = styled(Grid)`
  grid-template-columns: 4fr 8fr;
  gap: 12px;
  padding: 24px;
`;

declare type CellType = {
  id: string;
  label: string;
  canSort?: boolean;
};

export const DataStructure = ({ isLoading }: Props) => {
  const [editData, setEditData] = useState({});
  const [name, setName] = useState("");
  const [currentDataStrucure, setCurrentDataStrucure] = useState({ value: '', label: '' });
  const [formTemplateData, setFormTemplateData] = useState<any>(
    JSON.parse(localStorage.getItem('formTemplate')) || formTemplate,
  );
  const [dataStructure, setDataStructure] = useState<any>(
    JSON.parse(localStorage.getItem('dataStructure')) || dataStructures,
  );
  const tableCells: CellType[] = [
    {
      id: 'name',
      label: 'Name',
      canSort: true,
    },
    {
      id: 'label',
      label: 'Label',
    },
    {
      id: 'type',
      label: 'Type',
    },
    {
      id: 'inputType',
      label: 'Input Type',
    },
    {
      id: 'actions',
      label: 'Actions',
    },
  ];

  const [openData, setOpenData] = useState(false);
  const [openAddSection, setOpenAddSection] = useState(false);
  const handleClose = () => {
    setOpenData(!openData);
    setEditData({});
  };
  const editField = (data) => {
    setEditData(data);
    setOpenData(true);
  };

  const handleEdit = (data, section) => {
    removeData(data.name);
    addData(data, section);
  }
  const addData = (dataObject, section) => {
    const ds = JSON.parse(localStorage.getItem('dataStructure'));
    const ft = JSON.parse(localStorage.getItem('formTemplate'));
    const newData = {
      ...ds || dataStructure,
      [currentDataStrucure.value]: [...(ds || dataStructure)[currentDataStrucure.value], dataObject],
    };
    console.log(newData);
    const newFormTemplate = {
      ...(ft || formTemplateData)
    };
    const ind = (ft || formTemplateData)[currentDataStrucure.value].findIndex(({ title }) => title === section);
    (ft || formTemplateData)[currentDataStrucure.value][ind]?.fields.push(dataObject)
    localStorage.setItem('dataStructure', JSON.stringify(newData));
    localStorage.setItem('formTemplate', JSON.stringify(newFormTemplate));
    setDataStructure(newData);
    setFormTemplateData(newFormTemplate);
  };
  const removeData = (fileId) => {
    const ds = JSON.parse(localStorage.getItem('dataStructure'));
    const ft = JSON.parse(localStorage.getItem('formTemplate'));
    const newData = {
      ...ds || dataStructure,
      [currentDataStrucure.value]: (ds || dataStructure)[currentDataStrucure.value].filter(({ name }) => name !== fileId),
    };
    const newFormTemplate = {
      ...(ft || formTemplateData),
      [currentDataStrucure.value]: (ft || formTemplateData)[currentDataStrucure.value].map((t) => ({ ...t, fields: t?.fields?.filter(({ name }) => name !== fileId) })),
    };
    localStorage.setItem('dataStructure', JSON.stringify(newData));
    localStorage.setItem('formTemplate', JSON.stringify(newFormTemplate));
    setDataStructure(newData);
    setFormTemplateData(newFormTemplate);
  };

  const addSection = (title, subTitle) => {
    const ft = JSON.parse(localStorage.getItem('formTemplate'));
    const newFormTemplate = {
      ...(ft || formTemplateData)
    };
    (ft || formTemplateData)[currentDataStrucure.value].push({
      fields: [],
      subTitle,
      title,
      type: "category",
    })
    localStorage.setItem('formTemplate', JSON.stringify(newFormTemplate));
    setFormTemplateData(newFormTemplate);
  };

  const handleCreateDataStructure = () => {
    const ds = JSON.parse(localStorage.getItem('dataStructure'));
    const ft = JSON.parse(localStorage.getItem('formTemplate'));
    const t = JSON.parse(localStorage.getItem('template'));
    
    const newData = {
      ...ds || dataStructure,
      [name]: [],
    };
    const newFormTemplate = {
      ...(ft || formTemplateData),
      [name]: [],
    };
    const newTemplate = {
      ...(t),
      [name]: initTemplate,
    };
    localStorage.setItem('dataStructure', JSON.stringify(newData));
    localStorage.setItem('formTemplate', JSON.stringify(newFormTemplate));
    localStorage.setItem('template', JSON.stringify(newTemplate));
    setDataStructure(newData);
    setFormTemplateData(newFormTemplate);
    setCurrentDataStrucure({value: name, label: name});
    setName('');
  }

  return (
    <>
      <Grid columns={2}>
        <Grid column={1}>
          <StyledSectionTitle>
            <h2>Create/Edit Data Structure</h2>
            <p className="secondary_color">
              Below you can add or subtract custom fields that are displayed in the Minter's
              Certificate form.
            </p>
          </StyledSectionTitle>
        </Grid>
      </Grid>

      <HR marginTop={24} marginBottom={48} />
        <CustomGrid>
          <div>
            <h6>Select Data Structure</h6>
            <br />
            <p>Select from our pre defined templates or build your own based on the object you are creating certificates for.</p>
          </div>
          <div>
            <Select
              name="dataStructure"
              label="Data Structure"
              options={[
                { value: 'new', label: 'New Data Structure' },
                ...Object.keys(dataStructure).map((k) => ({ value: k, label: k }))
              ]}
              selectedOption={currentDataStrucure}
              handleChange={setCurrentDataStrucure}
            />
          </div>
        </CustomGrid>
        <HR marginTop={48} marginBottom={48} />
        {
          currentDataStrucure.value && (
            <>
              {currentDataStrucure.value === "new" ? (
                <CustomGrid>
                  <h4>Create New Data Structure</h4>
                  <div>
                    <TextInput
                      name="name"
                      type="text"
                      label="Name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                    <Flex>
                      <Button onClick={handleCreateDataStructure}>Create</Button>
                    </Flex>
                  </div>
                </CustomGrid>
              ) : (
                <>

                  <Container padding="24px">
                    <Flex flexFlow="row" justify="space-between">
                      <div>
                        <h6>Add New Section</h6>
                        <p className="secondary_color">Add a new section to group data fields</p>
                      </div>
                      <Button btnType="filled" onClick={() => setOpenAddSection(!openAddSection)}>
                        Add New Section
                      </Button>
                    </Flex>
                  </Container>
                  <HR marginTop={48} marginBottom={48} />
                  <Container padding="24px">
                    <Flex flexFlow="row" justify="space-between">
                      <div>
                        <h6>Add New Field</h6>
                        <p className="secondary_color">Add a new field to this Data Structure</p>
                      </div>
                      <Button btnType="filled" onClick={() => setOpenData(!openData)}>
                        Add New Field
                      </Button>
                    </Flex>
                  </Container>
                  <HR marginTop={48} marginBottom={48} />
                  <Container padding="0px 24px 24px 24px">
                    {isLoading ? (
                      <LoadingContainer />
                    ) : (
                      <>
                        <CustomTable
                          cells={tableCells}
                          rows={dataStructure[currentDataStrucure.value].map((row) => {
                            return {
                              name: row.name,
                              label: row.label,
                              type: row.type,
                              inputType: row.inputType,
                              actions: (
                                <Flex gap={8}>
                                  <Button size="small" btnType="filled" onClick={() => editField(row)}>
                                    Edit
                                  </Button>
                                  <Button size="small" btnType="filled" onClick={() => removeData(row.name)}>
                                    Delete
                                  </Button>
                                </Flex>
                              ),
                            };
                          })}
                        />
                      </>
                    )}
                  </Container>
                </>
              )}
            </>
          )
        }
      {/* <Container padding="24px">
        <Flex flexFlow="row" justify="space-between">
          <div>
            <h6>Save Template</h6>
            <p className="secondary_color">Save your progress</p>
          </div>
          <Button btnType="filled">
            Save Template
          </Button>
        </Flex>
      </Container>
      <HR marginTop={24} /> */}
      <AddDataModal
        openConfirmation={openData}
        editData={editData}
        handleClose={handleClose}
        handleAdd={addData}
        handleEdit={handleEdit}
        sections={formTemplateData[currentDataStrucure.value]?.map((f) => f.title)}
      />
      <AddDataSection
        isOpened={openAddSection}
        editData={""}
        handleClose={() => setOpenAddSection(false)}
        handleAdd={addSection}
        handleEdit={handleEdit}
      />
    </>
  );
};

type Props = {
  isLoading: boolean;
};
