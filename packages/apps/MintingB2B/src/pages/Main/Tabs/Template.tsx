import React, { useEffect, useState } from 'react'
import { Button, Container, Flex, Grid, Icons, Modal, Select, TextArea, TextInput, TabContent, Card } from '@origyn-sa/origyn-art-ui'
import { LoadingContainer } from '@dapp/features-components'
import styled from 'styled-components';
import { genRanHex } from '../../../../../../utils'
import TemplateRender from '../../../../../luxury/src/pages/NFTPage/TemplateRender'
import { dataStructures, formTemplate } from './Minter';

const addIds = (tObj) => {
  return tObj?.map((item) => {
    const tmpTObj = item;
    tmpTObj.id = genRanHex(32);
    if (tmpTObj.content) {
      tmpTObj.content = addIds(tmpTObj.content)
    }
    return tmpTObj;
  });
};

const removeById = (tObj, id) => {
  return tObj.filter((item) => {
    if (item.content) {
      item.content = removeById(item.content, id)
    }
    return item.id !== id;
  });
};

const updateById = (tObj, id, newObj) => {
  console.log(tObj, tObj.id, id);
  return tObj?.map((item) => {
    if (item.id === id) {
      console.log("FOUND ID");
      return newObj;
    }
    if (item.content) {
      item.content = updateById(item.content, id, newObj)
    }
    return item;
  });
};

export const initTemplate = [
  {
    id: 1,
    type: 'columns',
    columns: {
      smColumns: '1',
      columns: '2',
    },
    content: [
      {
        type: 'elements',
        id: 2,
        content: [
          {
            type: 'mainPhoto',
            id: 3,
            pointer: 'files-mainImage',
          },
          {
            type: "section",
            id: 4,
            title: {
              'en': 'Description',
            },
            content: [
              {
                'type': 'field',
                title: {
                  'en': '',
                },
                'fields': [
                  ['description'],
                ],
              },
            ],
          },
          {
            type: "section",
            id: 5,
            'title': {
              'en': 'Diamond Report',
            },
            'content': [
              {
                'type': 'field',
                'title': {
                  'en': 'Report Date',
                },
                'fields': [
                  ['report_date'],
                ],
              },
              {
                'type': 'field',
                'title': {
                  'en': 'IGI Report Number',
                },
                'fields': [
                  ['report_number'],
                ],
              },
              {
                'type': 'field',
                'title': {
                  'en': 'Shape and Cutting Style',
                },
                'fields': [
                  ['grade_cut'],
                ],
              },
              {
                'type': 'separator',
              },
              {
                'type': 'title',
                'title': {
                  'en': 'Grading Results',
                },
              },
              {
                'type': 'field',
                'title': {
                  'en': 'Carat Weight',
                },
                'fields': [
                  ['grading_carat_weight'],
                ],
              },
              {
                'type': 'field',
                'title': {
                  'en': 'Color Grade',
                },
                'fields': ['origyn-mints-diamonds-color'],
              },
              {
                'type': 'field',
                'title': {
                  'en': 'Clarity Grade',
                },
                'fields': ['origyn-mints-diamonds-clarity'],
              },
              {
                'type': 'field',
                'title': {
                  'en': 'Cut Grade',
                },
                'fields': [
                  ['field_code'],
                ],
              },
              {
                'type': 'separator',
              },
              {
                'type': 'title',
                'title': {
                  'en': 'Additional Grading Information',
                },
              },
              {
                'type': 'field',
                'title': {
                  'en': 'Polish',
                },
                'fields': [
                  ['grade_polish'],
                ],
              },
              {
                'type': 'field',
                'title': {
                  'en': 'Symmetry',
                },
                'fields': [
                  ['grade_symmetry'],
                ],
              },
              {
                'type': 'field',
                'title': {
                  'en': 'Fluorescence',
                },
                'fields': [
                  ['grade_fluorescence'],
                ],
              },
              {
                'type': 'field',
                'title': {
                  'en': 'Inscription(s)',
                },
                'fields': [
                  [''],
                ],
              },
              {
                'type': 'field',
                'title': {
                  'en': 'Comments',
                },
                'fields': [
                  ['grade_comments'],
                ],
              },
              {
                'type': 'records',
                'title': {
                  'en': 'Table',
                },
                'fields': [
                  ['origyn-mints-diamonds-table'],
                ],
              },
              {
                'type': 'records',
                'title': {
                  'en': 'Depth',
                },
                'fields': [
                  ['origyn-mints-diamonds-depth'],
                ],
              },
              {
                'type': 'records',
                'title': {
                  'en': 'Culet',
                },
                'field': [
                  ['origyn-mints-diamonds-culet'],
                ],
              },
              {
                'type': 'records',
                'title': {
                  'en': 'Girdle',
                },
                'field': [
                  ['origyn-mints-diamonds-ugirdle',
                  ' origyn-mints-diamonds-lgirdle'],
                ],
              },
              {
                'type': 'records',
                'title': {
                  'en': 'Shape',
                },
                'field': [
                  ['origyn-mints-diamonds-angle'],
                ],
              },
            ],
          },
          // {
          //   type: "section",
          //   id: 6,
          //   'title': {
          //     'en': 'Characteristics',
          //   },
          //   'content': [
          //     {
          //       'type': 'title',
          //       'title': {
          //         'en': 'Proportions',
          //       },
          //     },
          //     {
          //       'type': 'image',
          //       'title': {
          //         'en': null,
          //       },
          //       'field': 'files-media',
          //       pointer: 'files-media',
          //     },
          //     {
          //       'type': 'separator',
          //     },
          //     {
          //       'type': 'title',
          //       'title': {
          //         'en': 'Clarity',
          //       },
          //     },
          //     {
          //       'type': 'image',
          //       'title': {
          //         'en': null,
          //       },
          //       'field': 'origyn-mints-images',
          //     },
          //   ],
          // },
          {
            type: "section",
            id: 7,
            'title': {
              'en': 'LASERSCRIBE',
            },
            'content': [
              {
                'type': 'images',
                'title': {
                  'en': null,
                },
                'field': 'files-media',
                pointer: 'files-media',
              },
            ],
          },
          // {
          //   type: "section",
          //   id: 8,
          //   title: {
          //     'en': 'Grading Scales',
          //   },
          //   content: [{
          //     'type': 'title',
          //     'title': {
          //       'en': 'Color Scale',
          //     },
          //   },
          //     {
          //       'type': 'records',
          //       'title': {
          //         'en': null,
          //       },
          //       'field': 'origyn-mints-diamonds',
          //     },
          //     {
          //       'type': 'separator',
          //     },
          //     {
          //       'type': 'title',
          //       'title': {
          //         'en': 'Clarity Scale',
          //       },
          //     },
          //     {
          //       'type': 'records',
          //       'title': {
          //         'en': null,
          //       },
          //       'field': 'origyn-mints-diamonds',
          //     },
          //   ],
          // },
          {
            type: "section",
            id: 9,
            title: {
              'en': 'Gallery',
            },
            content: [
              {
                type: 'gallery',
                pointer: 'files-media',
              },
            ],
          },
        ],
      },
      {
        type: 'elements',
        id: 10,
        content: [
          {
            type: "section",
            title: {
              'en': 'History',
            },
            content: [
              {
                'type': 'history',
                'title': {
                  'en': null,
                },
                'field': 'origyn-mints-history',
              },
            ],
          },
          {
            type: "section",
            'title': {
              'en': 'Documents',
            },
            content: [
              {
                'type': 'attachments',
                'title': {
                  'en': null,
                },
                pointer: 'files-attachments',
              },
            ],
          },
          {
            type: "section",
            'title': {
              'en': 'CERTIFICATE OF AUTHENTICITY',
            },
            content: [
              {
                'type': 'certificate',
                'title': {
                  'en': null,
                },
              },
            ],
          },
        ],
      },
    ],
  },
]

export const defaultTemplate = {
  "Natural Diamond": [...initTemplate],
  'Laboratory Grown Diamond': [...initTemplate],
};

const TemplateBlockContainer = styled(Container)`
  background-color: ${({theme}) => theme.colors.TEXT}55;
  position: relative;
  :hover {
    &>.editButton {
      display: flex;
      gap: 4px;
    }
  }
`;
const ActionsWrapper = styled.div`
  display: none;
  position: absolute;
  top: 8px;
  right: 8px;
`;

const Actions = ({handleEdit, handleDelete}) => {
  return (
    <ActionsWrapper className="editButton">
      <Button onClick={handleEdit} size="small" iconButton textButton><Icons.SearchIcon width={12} height={12} /></Button>
      <Button onClick={handleDelete} size="small" iconButton textButton><Icons.CloseIcon width={12} height={12} /></Button>
    </ActionsWrapper>
  )
}

const ColumnsBlock = ({templateColumnObj, removeBlock, editBlock, selectedDataStructure}) => {
  return <TemplateBlockContainer padding="16px">
    <Flex fullWidth flexFlow="column">
      <h6>Columns Block</h6>
      <Grid {...templateColumnObj.columns} gap={8}>
        <RenderTemplateBlock
          templateObject={templateColumnObj.content}
          removeBlock={removeBlock}
          editBlock={editBlock}
          selectedDataStructure={selectedDataStructure}
        />
      </Grid>
    </Flex>
    <Actions
      handleEdit={() => {}}
      handleDelete={() => removeBlock(templateColumnObj.id)}
    />
  </TemplateBlockContainer>
}
const MainPhotoBlock = (templateImageObj, removeBlock) => {
  return <TemplateBlockContainer padding="16px">
    <h6>Main Image Block</h6>
    <Actions
      handleEdit={() => {}}
      handleDelete={() => removeBlock(templateImageObj.id)}
    />
  </TemplateBlockContainer>
}
const SectionBlock = ({templateSectionObj, removeBlock, editBlock, selectedDataStructure}) => {
  const [isOpened, setIsOpened] = useState(false);
  const [title, setTitle] = useState(templateSectionObj.title.en);

  const handleEdit = () => {
    const newBlock = {
      ...templateSectionObj,
      title: {
        en: title
      },
    }
    editBlock(templateSectionObj.id, newBlock);
    setIsOpened(false);
  }

  return <TemplateBlockContainer padding="16px">
    <Flex flexFlow="column" gap={4}>
      <h6>Section Block</h6>
      <RenderTemplateBlock
        templateObject={templateSectionObj.content}
        removeBlock={removeBlock}
        editBlock={editBlock}
        selectedDataStructure={selectedDataStructure}
      />
    </Flex>
    <Actions
      handleEdit={() => setIsOpened(true)}
      handleDelete={() => removeBlock(templateSectionObj.id)}
    />
    <Modal
      size="md"
      isOpened={isOpened}
      closeModal={() => setIsOpened(false)}
    >
      <Container padding="16px">
        <br/>
        <h6>Edit Section Block</h6>
        <br/>
        <TextInput
          label="Field Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <br/>
        <Button onClick={handleEdit}>Save Changes</Button>
      </Container>
    </Modal>
  </TemplateBlockContainer>
}
const TextBlock = ({templateTextObj, removeBlock, editBlock, selectedDataStructure}) => {
  const [isOpened, setIsOpened] = useState(false);
  const [title, setTitle] = useState(templateTextObj.text.en);

  const handleEdit = () => {
    const newBlock = {
      ...templateTextObj,
      text: {
        en: title
      },
    }
    editBlock(templateTextObj.id, newBlock);
    setIsOpened(false);
  }
  return <TemplateBlockContainer padding="16px">
    Text Block
    <Actions
      handleEdit={() => setIsOpened(true)}
      handleDelete={() => removeBlock(templateTextObj.id)}
    />
    <Modal
      size="md"
      isOpened={isOpened}
      closeModal={() => setIsOpened(false)}
    >
      <Container padding="16px">
        <br/>
        <h6>Edit Text Block</h6>
        <br/>
        <TextArea
          name="text"
          label="Text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <br/>
        <Button onClick={handleEdit}>Save Changes</Button>
      </Container>
    </Modal>
  </TemplateBlockContainer>
}
const TitleBlock = ({templateTextObj, removeBlock, editBlock, selectedDataStructure}) => {
  const [isOpened, setIsOpened] = useState(false);
  const [title, setTitle] = useState(templateTextObj.title.en);

  const handleEdit = () => {
    const newBlock = {
      ...templateTextObj,
      title: {
        en: title
      },
    }
    editBlock(templateTextObj.id, newBlock);
    setIsOpened(false);
  }

  return <TemplateBlockContainer padding="16px">
    Title Block
    <Actions
      handleEdit={() => setIsOpened(true)}
      handleDelete={() => removeBlock(templateTextObj.id)}
    />
    <Modal
      size="md"
      isOpened={isOpened}
      closeModal={() => setIsOpened(false)}
    >
      <Container padding="16px">
        <br/>
        <h6>Edit Title Block</h6>
        <br/>
        <TextInput
          label="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <br/>
        <Button onClick={handleEdit}>Save Changes</Button>
      </Container>
    </Modal>
  </TemplateBlockContainer>
}

const FieldBlock = ({templateFieldObj, removeBlock, editBlock, selectedDataStructure}) => {
  const [isOpened, setIsOpened] = useState(false);
  const [title, setTitle] = useState(templateFieldObj.title.en);
  const [selectedField, setSelectedField] = useState({value: templateFieldObj?.fields[0], label: templateFieldObj?.fields[0]});
  const [dataStructure, setDataStructure] = useState<any>();
  const [fields, setFields] = useState<any>([]);

  useEffect(() => {
    const ds = JSON.parse(localStorage.getItem("dataStructure")) || dataStructures;
    setDataStructure(ds);
    const f = ds[selectedDataStructure || [Object.keys(ds)[0]]]?.map(({name}) => name);
    setFields(f)
  }, [selectedDataStructure])

  const handleEdit = () => {
    const newBlock = {
      ...templateFieldObj,
      title: {
        en: title
      },
      fields: [
        selectedField.value
      ]
    }
    console.log(templateFieldObj, newBlock);

    editBlock(templateFieldObj.id, newBlock);

    setIsOpened(false);
  }

  return <TemplateBlockContainer padding="16px">
    Field Block
    <Actions
      handleEdit={() => setIsOpened(true)}
      handleDelete={() => removeBlock(templateFieldObj.id)}
    />
    <Modal
      size="md"
      isOpened={isOpened}
      closeModal={() => setIsOpened(false)}
    >
      <Container padding="16px">
        <br/>
        <h6>Edit field block</h6>
        <br/>
        <TextInput
          label="Field Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <br/>
        <Select
          label="Display field"
          options={fields?.map((f) => ({value: f, label: f}))}
          selectedOption={selectedField}
          handleChange={setSelectedField}
        />
        <br/>
        <Button onClick={handleEdit}>Save Changes</Button>
      </Container>
    </Modal>
  </TemplateBlockContainer>
}

const ImageBlock = ({templateFieldObj, removeBlock, editBlock, selectedDataStructure}) => {
  const [isOpened, setIsOpened] = useState(false);
  const [selectedField, setSelectedField] = useState({value: templateFieldObj?.field, label: templateFieldObj?.field});
  const [dataStructure, setDataStructure] = useState<any>();
  const [fields, setFields] = useState<any>([]);

  useEffect(() => {
    const ds = JSON.parse(localStorage.getItem("dataStructure")) || dataStructures;
    setDataStructure(ds);
    const f = ds[selectedDataStructure || [Object.keys(ds)[0]]]?.map(({name}) => name);
    setFields(f)
  }, [selectedDataStructure])

  const handleEdit = () => {
    const newBlock = {
      ...templateFieldObj,
      field: selectedField.value
    }

    editBlock(templateFieldObj.id, newBlock);

    setIsOpened(false);
  }

  return <TemplateBlockContainer padding="16px">
    Image Block
    <Actions
      handleEdit={() => setIsOpened(true)}
      handleDelete={() => removeBlock(templateFieldObj.id)}
    />
    <Modal
      size="md"
      isOpened={isOpened}
      closeModal={() => setIsOpened(false)}
    >
      <Container padding="16px">
        <br/>
        <h6>Edit image block</h6>
        <br/>
        <Select
          label="Display field"
          options={fields?.map((f) => ({value: f, label: f}))}
          selectedOption={selectedField}
          handleChange={setSelectedField}
        />
        <br/>
        <Button onClick={handleEdit}>Save Changes</Button>
      </Container>
    </Modal>
  </TemplateBlockContainer>
}
const GalleryBlock = ({templateFieldObj, removeBlock, editBlock, selectedDataStructure}) => {
  const [isOpened, setIsOpened] = useState(false);
  const [selectedField, setSelectedField] = useState({value: templateFieldObj?.field, label: templateFieldObj?.field});
  const [dataStructure, setDataStructure] = useState<any>();
  const [fields, setFields] = useState<any>([]);

  useEffect(() => {
    const ds = JSON.parse(localStorage.getItem("dataStructure")) || dataStructures
    setDataStructure(ds);
    const f = ds[selectedDataStructure || [Object.keys(ds)[0]]]?.map(({name}) => name);
    setFields(f)
  }, [selectedDataStructure])

  const handleEdit = () => {
    const newBlock = {
      ...templateFieldObj,
      field: selectedField.value
    }

    editBlock(templateFieldObj.id, newBlock);

    setIsOpened(false);
  }

  return <TemplateBlockContainer padding="16px">
    Gallery Block
    <Actions
      handleEdit={() => setIsOpened(true)}
      handleDelete={() => removeBlock(templateFieldObj.id)}
    />
    <Modal
      size="md"
      isOpened={isOpened}
      closeModal={() => setIsOpened(false)}
    >
      <Container padding="16px">
        <br/>
        <h6>Edit Gallery Block</h6>
        <br/>
        <Select
          label="Gallery Data pointer"
          // TODO: filter files and return pointers for gallery
          options={fields?.map((f) => ({value: f, label: f}))}
          selectedOption={selectedField}
          handleChange={setSelectedField}
        />
        <br/>
        <Button onClick={handleEdit}>Save Changes</Button>
      </Container>
    </Modal>
  </TemplateBlockContainer>
}
const AttachmentsBlock = ({templateFieldObj, removeBlock, editBlock, selectedDataStructure}) => {
  const [isOpened, setIsOpened] = useState(false);
  const [selectedField, setSelectedField] = useState({value: templateFieldObj?.field, label: templateFieldObj?.field});
  const [dataStructure, setDataStructure] = useState<any>();
  const [fields, setFields] = useState<any>([]);

  useEffect(() => {
    const ds = JSON.parse(localStorage.getItem("dataStructure")) || dataStructures
    setDataStructure(ds);
    const f = ds[selectedDataStructure || Object.keys(ds)[0]]?.map(({name}) => name);
    setFields(f)
  }, [selectedDataStructure])

  const handleEdit = () => {
    const newBlock = {
      ...templateFieldObj,
      field: selectedField.value
    }

    editBlock(templateFieldObj.id, newBlock);

    setIsOpened(false);
  }

  return <TemplateBlockContainer padding="16px">
    Attachments Block
    <Actions
      handleEdit={() => setIsOpened(true)}
      handleDelete={() => removeBlock(templateFieldObj.id)}
    />
    <Modal
      size="md"
      isOpened={isOpened}
      closeModal={() => setIsOpened(false)}
    >
      <Container padding="16px">
        <br/>
        <h6>Edit Attachments Block</h6>
        <br/>
        <Select
          label="Attachments Data pointer"
          // TODO: filter files and return pointers for gallery
          options={fields?.map((f) => ({value: f, label: f}))}
          selectedOption={selectedField}
          handleChange={setSelectedField}
        />
        <br/>
        <Button onClick={handleEdit}>Save Changes</Button>
      </Container>
    </Modal>
  </TemplateBlockContainer>
}
const HistoryBlock = ({templateFieldObj, removeBlock, editBlock, selectedDataStructure}) => {
  const [isOpened, setIsOpened] = useState(false);
  const [selectedField, setSelectedField] = useState({value: templateFieldObj?.field, label: templateFieldObj?.field});
  const [dataStructure, setDataStructure] = useState<any>();
  const [fields, setFields] = useState<any>([]);

  useEffect(() => {
    const ds = JSON.parse(localStorage.getItem("dataStructure")) || dataStructures
    setDataStructure(ds);
    const f = ds[selectedDataStructure || Object.keys(ds)[0]]?.map(({name}) => name);
    setFields(f)
  }, [selectedDataStructure])

  const handleEdit = () => {
    const newBlock = {
      ...templateFieldObj,
      field: selectedField.value
    }

    editBlock(templateFieldObj.id, newBlock);

    setIsOpened(false);
  }

  return <TemplateBlockContainer padding="16px">
    History Block
    <Actions
      handleEdit={() => setIsOpened(true)}
      handleDelete={() => removeBlock(templateFieldObj.id)}
    />
    <Modal
      size="md"
      isOpened={isOpened}
      closeModal={() => setIsOpened(false)}
    >
      <Container padding="16px">
        <br/>
        <h6>Edit History Block</h6>
        <br/>
        <Select
          label="Select Records for History"
          // TODO: filter files and return pointers for gallery
          options={fields?.map((f) => ({value: f, label: f}))}
          selectedOption={selectedField}
          handleChange={setSelectedField}
        />
        <br/>
        <Button onClick={handleEdit}>Save Changes</Button>
      </Container>
    </Modal>
  </TemplateBlockContainer>
}

const SeparatorBlock = ({templateSeparatorObj, removeBlock}) => {
  return <TemplateBlockContainer padding="8px 16px">
    Separator Block
    <Actions
      handleEdit={() => {}}
      handleDelete={() => removeBlock(templateSeparatorObj.id)}
    />
  </TemplateBlockContainer>
}

const RenderTemplateBlock = ({templateObject, removeBlock, editBlock, selectedDataStructure}) => {
  return templateObject?.map((tempObj) => {
    switch (tempObj.type) {
      case 'columns':
        return <ColumnsBlock
          templateColumnObj={tempObj}
          removeBlock={removeBlock}
          editBlock={editBlock}
          selectedDataStructure={selectedDataStructure}
        />
      case 'elements':
        return <Flex flexFlow='column' gap={8}>
          <RenderTemplateBlock
            templateObject={tempObj.content}
            removeBlock={removeBlock}
            editBlock={editBlock}
            selectedDataStructure={selectedDataStructure}
          />
        </Flex>
      case 'mainPhoto':
        return <>
          <MainPhotoBlock />
        </>
      case 'section':
        return <>
          <SectionBlock
            templateSectionObj={tempObj}
            removeBlock={removeBlock}
            editBlock={editBlock}
            selectedDataStructure={selectedDataStructure}
          />
        </>
      case 'text':
        return <>
          <TextBlock
            templateTextObj={tempObj}
            removeBlock={removeBlock}
            editBlock={editBlock}
            selectedDataStructure={selectedDataStructure}
          />
        </>
      case 'title':
        return <>
          <TitleBlock
            templateTextObj={tempObj}
            removeBlock={removeBlock}
            editBlock={editBlock}
            selectedDataStructure={selectedDataStructure}
          />
        </>
      case 'field':
        return <>
          <FieldBlock
            templateFieldObj={tempObj}
            removeBlock={removeBlock}
            editBlock={editBlock}
            selectedDataStructure={selectedDataStructure}
          />
        </>
      case 'image':
        return <>
          <ImageBlock
            templateFieldObj={tempObj}
            removeBlock={removeBlock}
            editBlock={editBlock}
            selectedDataStructure={selectedDataStructure}
          />
        </>
      case 'gallery':
        return <>
          <GalleryBlock
            templateFieldObj={tempObj}
            removeBlock={removeBlock}
            editBlock={editBlock}
            selectedDataStructure={selectedDataStructure}
          />
        </>
      case 'attachments':
        return <>
          <AttachmentsBlock
            templateFieldObj={tempObj}
            removeBlock={removeBlock}
            editBlock={editBlock}
            selectedDataStructure={selectedDataStructure}
          />
        </>
      case 'history':
        return <>
          <HistoryBlock
            templateFieldObj={tempObj}
            removeBlock={removeBlock}
            editBlock={editBlock}
            selectedDataStructure={selectedDataStructure}
          />
        </>
      case 'separator':
        return <>
          <SeparatorBlock
            templateSeparatorObj={tempObj}
            removeBlock={removeBlock}
          />
        </>
    }
  })
}

const CustomGrid = styled(Grid)`
  grid-template-columns: 4fr 8fr;
  gap: 16px;
`

export const Template = () => {
  const [template, setTemplate] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [selectedDataStructure, setSelectedDataStructure] = useState(Object.keys(defaultTemplate)[0]);
  const [templateFormData, setTemplateFormData] = useState<any>(
    JSON.parse(localStorage.getItem('formTemplate')) || formTemplate,
  );

  const removeBlock = (id) => {
    const tpmTemplate = template[selectedDataStructure];
    const t = removeById(tpmTemplate, id);
    const updatedTemplate = {...template, [selectedDataStructure]: t};
    setTemplate(updatedTemplate);
    localStorage.setItem('template', JSON.stringify(updatedTemplate))
  }

  const editBlock = (id, newObj) => {
    console.log(template);
    const tpmTemplate = template[selectedDataStructure];
    const t = updateById(tpmTemplate, id, newObj);
    const updatedTemplate = {...template, [selectedDataStructure]: t};
    console.log(updatedTemplate);
    setTemplate(updatedTemplate);
    localStorage.setItem('template', JSON.stringify(updatedTemplate))
  }

  useEffect(() => {
    let t = JSON.parse(localStorage.getItem('template'));
    if (!t) {
      localStorage.setItem('template', JSON.stringify(defaultTemplate));
    }
    t = JSON.parse(localStorage.getItem('template'));
    const templatesWithIds = {}; 
    Object.keys(t).forEach(
      (k) => {
        const withIds = addIds(t[k]);
        console.log(withIds);
        templatesWithIds[k] = addIds(t[k]);
      });
    console.log(templatesWithIds);
    setTemplate(templatesWithIds);
  }, [])

  return (
    <Container padding='16px'>
      <br />
      <h2>UI Template</h2>
      <br />
      {isLoading ? (
        <LoadingContainer />
      ) : (
        <>
          <div>
            <TabContent
              tabs={[{title: "Template Editor", id: "editor"},{title: "Template Preview", id: "editor"}]}
              content={[
                <>
                  <br />
                  <CustomGrid>
                    <h6>Select Data Structure</h6>
                    <Grid columns={2} gap={20}>
                      {
                        Object.keys(templateFormData)?.map((key) => {
                          return (
                            <Card type={key === selectedDataStructure  ? "filled" : "outlined"} padding="32px" onClick={() => setSelectedDataStructure(key)}>
                              <Flex fullWidth flexFlow="column" justify="center" align="center" gap={10}>
                                <div>
                                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                    <path d="M20.6947 6.995C20.5247 6.685 20.2847 6.435 19.9747 6.255L13.0347 2.145C12.4147 1.785 11.5847 1.785 10.9647 2.145L4.02469 6.255C3.71469 6.435 3.46469 6.685 3.30469 6.995C3.13469 7.305 3.05469 7.645 3.05469 7.995V16.065C3.05469 16.415 3.13469 16.755 3.30469 17.065C3.47469 17.375 3.71469 17.625 4.02469 17.805L10.9347 21.855C11.2447 22.035 11.5847 22.125 11.9347 22.125C12.2847 22.125 12.6247 22.035 12.9347 21.855L19.9347 17.805C20.2447 17.625 20.4947 17.375 20.6747 17.065C20.8547 16.755 20.9447 16.415 20.9447 16.065V7.995C20.9447 7.645 20.8647 7.305 20.6947 6.995ZM10.9347 12.625V19.365L5.21469 15.935V9.345L10.9347 12.625ZM17.7147 7.405L12.0047 10.715L6.29469 7.405L12.0047 4.125L17.7147 7.405ZM18.8147 9.345V15.935L13.0647 19.365V12.625L18.8147 9.345Z" fill="#151515" />
                                  </svg>
                                </div>
                                <div>
                                  <h6>{key}</h6>
                                </div>
                              </Flex>
                            </Card>
                          )
                        })
                      }
                    </Grid>
                  </CustomGrid>
                  <br />
                  {console.log(template[selectedDataStructure], selectedDataStructure, template)}
                  <RenderTemplateBlock
                    templateObject={template[selectedDataStructure]}
                    selectedDataStructure={selectedDataStructure}
                    removeBlock={removeBlock}
                    editBlock={editBlock}
                  />
                </>,
                <TemplateRender
                  templateObject={template[selectedDataStructure]}
                  data={{}}
                />
              ]}
            />
          </div>
        </>
      )}
    </Container>
  )
}
