import React, { useEffect, useState } from 'react'
import { Button, Container, Flex, Grid, Icons, Modal, Select, TextArea, TextInput, TabContent } from '@origyn-sa/origyn-art-ui'
import { LoadingContainer } from '@dapp/features-components'
import styled from 'styled-components';
import { genRanHex } from '../../../../../../utils'
import TemplateRender from '../../../../../luxury/src/pages/NFTPage/TemplateRender'
import { dataStructures } from './Minter';

const addIds = (tObj) => {
  return tObj.map((item) => {
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
  return tObj.map((item) => {
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

export const defaultTemplate = [
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

const ColumnsBlock = ({templateColumnObj, removeBlock, editBlock}) => {
  return <TemplateBlockContainer padding="16px">
    <Flex fullWidth flexFlow="column">
      <h6>Columns Block</h6>
      <Grid {...templateColumnObj.columns} gap={8}>
        <RenderTemplateBlock
          templateObject={templateColumnObj.content}
          removeBlock={removeBlock}
          editBlock={editBlock}
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
const SectionBlock = ({templateSectionObj, removeBlock, editBlock}) => {
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
const TextBlock = ({templateTextObj, removeBlock, editBlock}) => {
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
const TitleBlock = ({templateTextObj, removeBlock, editBlock}) => {
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

const FieldBlock = ({templateFieldObj, removeBlock, editBlock}) => {
  const [isOpened, setIsOpened] = useState(false);
  const [title, setTitle] = useState(templateFieldObj.title.en);
  const [selectedField, setSelectedField] = useState({value: templateFieldObj?.fields[0], label: templateFieldObj?.fields[0]});
  const [dataStructure, setDataStructure] = useState<any>();
  const [fields, setFields] = useState<any>([]);

  useEffect(() => {
    const ds = JSON.parse(localStorage.getItem("dataStructure")) || dataStructures;
    setDataStructure(ds);
    const f = ds[Object.keys(ds)[0]].map(({name}) => name);
    setFields(f)
  }, [])

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

const ImageBlock = ({templateFieldObj, removeBlock, editBlock}) => {
  const [isOpened, setIsOpened] = useState(false);
  const [selectedField, setSelectedField] = useState({value: templateFieldObj?.field, label: templateFieldObj?.field});
  const [dataStructure, setDataStructure] = useState<any>();
  const [fields, setFields] = useState<any>([]);

  useEffect(() => {
    const ds = JSON.parse(localStorage.getItem("dataStructure")) || dataStructures;
    setDataStructure(ds);
    const f = ds[Object.keys(ds)[0]].map(({name}) => name);
    setFields(f)
  }, [])

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
const GalleryBlock = ({templateFieldObj, removeBlock, editBlock}) => {
  const [isOpened, setIsOpened] = useState(false);
  const [selectedField, setSelectedField] = useState({value: templateFieldObj?.field, label: templateFieldObj?.field});
  const [dataStructure, setDataStructure] = useState<any>();
  const [fields, setFields] = useState<any>([]);

  useEffect(() => {
    const ds = JSON.parse(localStorage.getItem("dataStructure")) || dataStructures
    setDataStructure(ds);
    const f = ds[Object.keys(ds)[0]].map(({name}) => name);
    setFields(f)
  }, [])

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
const AttachmentsBlock = ({templateFieldObj, removeBlock, editBlock}) => {
  const [isOpened, setIsOpened] = useState(false);
  const [selectedField, setSelectedField] = useState({value: templateFieldObj?.field, label: templateFieldObj?.field});
  const [dataStructure, setDataStructure] = useState<any>();
  const [fields, setFields] = useState<any>([]);

  useEffect(() => {
    const ds = JSON.parse(localStorage.getItem("dataStructure")) || dataStructures
    setDataStructure(ds);
    const f = ds[Object.keys(ds)[0]].map(({name}) => name);
    setFields(f)
  }, [])

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
const HistoryBlock = ({templateFieldObj, removeBlock, editBlock}) => {
  const [isOpened, setIsOpened] = useState(false);
  const [selectedField, setSelectedField] = useState({value: templateFieldObj?.field, label: templateFieldObj?.field});
  const [dataStructure, setDataStructure] = useState<any>();
  const [fields, setFields] = useState<any>([]);

  useEffect(() => {
    const ds = JSON.parse(localStorage.getItem("dataStructure")) || dataStructures
    setDataStructure(ds);
    const f = ds[Object.keys(ds)[0]].map(({name}) => name);
    setFields(f)
  }, [])

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

const RenderTemplateBlock = ({templateObject, removeBlock, editBlock}) => {
  return templateObject.map((tempObj) => {
    switch (tempObj.type) {
      case 'columns':
        return <ColumnsBlock
          templateColumnObj={tempObj}
          removeBlock={removeBlock}
          editBlock={editBlock}
        />
      case 'elements':
        return <Flex flexFlow='column' gap={8}>
          <RenderTemplateBlock
            templateObject={tempObj.content}
            removeBlock={removeBlock}
            editBlock={editBlock}
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
          />
        </>
      case 'text':
        return <>
          <TextBlock
            templateTextObj={tempObj}
            removeBlock={removeBlock}
            editBlock={editBlock}
          />
        </>
      case 'title':
        return <>
          <TitleBlock
            templateTextObj={tempObj}
            removeBlock={removeBlock}
            editBlock={editBlock}
          />
        </>
      case 'field':
        return <>
          <FieldBlock
            templateFieldObj={tempObj}
            removeBlock={removeBlock}
            editBlock={editBlock}
          />
        </>
      case 'image':
        return <>
          <ImageBlock
            templateFieldObj={tempObj}
            removeBlock={removeBlock}
            editBlock={editBlock}
          />
        </>
      case 'gallery':
        return <>
          <GalleryBlock
            templateFieldObj={tempObj}
            removeBlock={removeBlock}
            editBlock={editBlock}
          />
        </>
      case 'attachments':
        return <>
          <AttachmentsBlock
            templateFieldObj={tempObj}
            removeBlock={removeBlock}
            editBlock={editBlock}
          />
        </>
      case 'history':
        return <>
          <HistoryBlock
            templateFieldObj={tempObj}
            removeBlock={removeBlock}
            editBlock={editBlock}
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

export const Template = () => {
  const [template, setTemplate] = useState(JSON.parse(localStorage.getItem('template')) || defaultTemplate);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setTemplate(addIds(defaultTemplate))
  }, [])

  const removeBlock = (id) => {
    const t = removeById(template, id);
    setTemplate(t);
    localStorage.setItem('template', JSON.stringify(t))
  }

  const editBlock = (id, newObj) => {
    const t = updateById(template, id, newObj);
    setTemplate(t);
    localStorage.setItem('template', JSON.stringify(t))
  }
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
                <RenderTemplateBlock
                  templateObject={template}
                  removeBlock={removeBlock}
                  editBlock={editBlock}
                />,
                <TemplateRender
                  templateObject={template}
                  data={JSON.parse(localStorage.getItem('dataStructure')) || dataStructures}
                />
              ]}
            />
          </div>
        </>
      )}
    </Container>
  )
}
