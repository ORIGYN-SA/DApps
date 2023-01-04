import React, { useState } from 'react'
import { Button, Container, Flex, Grid, Icons, Modal } from '@origyn-sa/origyn-art-ui'
import { LoadingContainer } from '@dapp/features-components'
import styled from 'styled-components'

const defaultTemplate = [
  {
    type: 'columns',
    columns: {
      smColumns: '1',
      columns: '2',
    },
    content: [
      {
        type: 'elements',
        content: [
          {
            type: 'mainPhoto',
            'title': {
              'en': 'Main Photo',
            },
            'data': {
              'type': 'images',
              'field': 'origyn-mints-images',
            },
          },
          {
            type: "section",
            title: {
              'en': 'Description',
            },
            content: [
              {
                'type': 'text',
                'text': {
                  'en': 'Diamond forms under high temperature and pressure conditions that exist only about 100 miles beneath the earth\u2019s surface. Diamond\u2019s carbon atoms are bonded in essentially the same way in all directions. Another mineral, graphite, also contains only ca',
                },
              },
            ],
          },
          {
            'title': {
              'en': 'Diamond Report',
            },
            'data': [
              {
                'type': 'field',
                'title': {
                  'en': 'Report Date',
                },
                'fields': [
                  ['field_code'],
                ],
              },
              {
                'type': 'field',
                'title': {
                  'en': 'IGI Report Number',
                },
                'fields': [
                  ['field_code'],
                ],
              },
              {
                'type': 'field',
                'title': {
                  'en': 'Description',
                },
                'fields': [
                  ['field_code'],
                ],
              },
              {
                'type': 'field',
                'title': {
                  'en': 'Shape and Cutting Style',
                },
                'fields': [
                  ['field_code'],
                ],
              },
              {
                'type': 'field',
                'title': {
                  'en': 'Measurements',
                },
                'fields': [
                  ['field_code'],
                  ['field_code'],
                  ['field_code'],
                ],
              },
              {
                'type': ['separator'],
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
                  ['field_code'],
                ],
              },
              {
                'type': 'field',
                'title': {
                  'en': 'Color Grade',
                },
                'fields': [],
              },
              {
                'type': 'field',
                'title': {
                  'en': 'Clarity Grade',
                },
                'fields': [],
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
                'type': ['separator'],
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
                  ['field_code'],
                ],
              },
              {
                'type': 'field',
                'title': {
                  'en': 'Symmetry',
                },
                'fields': [
                  ['field_code'],
                ],
              },
              {
                'type': 'field',
                'title': {
                  'en': 'Fluorescence',
                },
                'fields': [
                  ['field_code'],
                ],
              },
              {
                'type': 'field',
                'title': {
                  'en': 'Inscription(s)',
                },
                'fields': [
                  ['field_code'],
                ],
              },
              {
                'type': 'field',
                'title': {
                  'en': 'Comments',
                },
                'fields': [
                  ['field_code'],
                ],
              },
              {
                'type': 'records',
                'title': {
                  'en': 'Table',
                },
                'field': 'origyn-mints-diamonds',
              },
              {
                'type': 'records',
                'title': {
                  'en': 'Depth',
                },
                'field': 'origyn-mints-diamonds',
              },
              {
                'type': 'records',
                'title': {
                  'en': 'Culet',
                },
                'field': 'origyn-mints-diamonds',
              },
              {
                'type': 'records',
                'title': {
                  'en': 'Girdle',
                },
                'field': 'origyn-mints-diamonds',
              },
              {
                'type': 'records',
                'title': {
                  'en': 'Shape',
                },
                'field': 'origyn-mints-diamonds',
              },
            ],
          },
          {
            'title': {
              'en': 'Characteristics',
            },
            'data': [
              {
                'type': 'title',
                'title': {
                  'en': 'Proportions',
                },
              },
              {
                'type': 'records',
                'title': {
                  'en': null,
                },
                'field': 'origyn-mints-diamonds',
              },
              {
                'type': ['separator'],
              },
              {
                'type': 'title',
                'title': {
                  'en': 'Clarity',
                },
              },
              {
                'type': 'images',
                'title': {
                  'en': null,
                },
                'field': 'origyn-mints-images',
              },
            ],
          },
          {
            'title': {
              'en': 'LASERSCRIBE\u00ae',
            },
            'data': [
              {
                'type': 'images',
                'title': {
                  'en': null,
                },
                'field': 'origyn-mints-images',
              },
              {
                'type': 'field',
                'title': {
                  'en': 'Inscription',
                },
                'fields': [
                  ['field_code'],
                ],
              }],
          },
          {
            'title': {
              'en': 'Grading Scales',
            },
            'data': [{
              'type': 'title',
              'title': {
                'en': 'Color Scale',
              },
            },
              {
                'type': 'records',
                'title': {
                  'en': null,
                },
                'field': 'origyn-mints-diamonds',
              },
              {
                'type': ['separator'],
              },
              {
                'type': 'title',
                'title': {
                  'en': 'Clarity Scale',
                },
              },
              {
                'type': 'records',
                'title': {
                  'en': null,
                },
                'field': 'origyn-mints-diamonds',
              },
            ],
          },
          {
            'title': {
              'en': 'Gallery',
            },
            'data': [
              {
                'type': 'images',
                'title': {
                  'en': null,
                },
                'field': 'origyn-mints-images',
              },
            ],
          },
        ],
      },
      {
        type: 'elements',
        content: [
          {
            'title': {
              'en': 'External Links',
            },
            'data': [],
          },
          {
            'title': {
              'en': 'History',
            },
            'data': [
              {
                'type': 'records',
                'title': {
                  'en': null,
                },
                'field': 'origyn-mints-history',
              },
            ],
          },
          {
            'title': {
              'en': 'Documents',
            },
            'data': [
              {
                'type': 'records',
                'title': {
                  'en': null,
                },
                'field': 'origyn-mints-files',
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
      display: block;
    }
  }
`;
const EditIconWrapper = styled.div`
  display: none;
  position: absolute;
  top: 8px;
  right: 8px;
`;

const EditIcon = () => {
  return (
    <EditIconWrapper className="editButton">
      <Button size="small" iconButton textButton><Icons.SearchIcon width={12} height={12} /></Button>
    </EditIconWrapper>
  )
}

const ColumnsBlock = ({templateColumnObj}) => {
  return <TemplateBlockContainer padding="16px">
    <Flex fullWidth flexFlow="column">
      <h6>Columns Block</h6>
      <Grid {...templateColumnObj.columns}>
        <RenderTemplateBlock
          templateObject={templateColumnObj.content}
        />
      </Grid>
    </Flex>
    <EditIcon />
  </TemplateBlockContainer>
}
const MainPhotoBlock = (templateImageObj) => {
  return <TemplateBlockContainer padding="16px">
    Main Image Block
    <EditIcon />
  </TemplateBlockContainer>
}
const SectionBlock = ({templateSectionObj}) => {
  return <TemplateBlockContainer padding="16px">
    <Flex flexFlow="column">
      <h6>Section Block</h6>
      <RenderTemplateBlock
        templateObject={templateSectionObj.content}
      />
    </Flex>
    <EditIcon />
  </TemplateBlockContainer>
}
const TextBlock = ({templateTextObj}) => {
  return <TemplateBlockContainer padding="16px">
    Text Block
    <EditIcon />
  </TemplateBlockContainer>
}

const RenderTemplateBlock = ({templateObject}) => {
  return templateObject.map((tempObj) => {
    console.log(tempObj);
    switch (tempObj.type) {
      case 'columns':
        return <ColumnsBlock
          templateColumnObj={tempObj}
        />
      case 'elements':
        return <Flex flexFlow='column' gap={8}>
          <RenderTemplateBlock
            templateObject={tempObj.content}
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
          />
        </>
      case 'text':
        return <>
          <TextBlock
            templateTextObj={tempObj}
          />
        </>
    }
  })
}

export const Template = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [template, setTemplate] = useState(defaultTemplate);
  const [isLoading, setIsLoading] = useState(false);


  return (
    <Container padding='16px'>
      <br />
      <h2>UI Template</h2>
      <br />
      {isLoading ? (
        <LoadingContainer />
      ) : (
        <>
          {
            isEditing ? (
              <div>

              </div>
            ) : (
              <div>
                <RenderTemplateBlock
                  templateObject={defaultTemplate}
                />
              </div>
            )
          }
        </>
      )}
    </Container>
  )
}
