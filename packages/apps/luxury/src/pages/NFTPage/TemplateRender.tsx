import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { Container, Flex, Grid, Icons } from '@origyn-sa/origyn-art-ui'
import Certificate from '../../components/Certificate';

const ContentContainer = styled.div`
  background: transparent;
  background-image: url(${({ imageURL }) => imageURL});
  padding: 0 8px;
  min-height: 100%;
  min-width: 100%;
  box-sizing: border-box;
`;
const FieldBlock = styled.div`
  display: grid;
  grid-template-columns: 1fr 2fr;
`;
const Accordion = styled.div`
  width: 100%;
  height: 70px;
  font-weight: 600;
  font-size: 16px;
  line-height: 18px;
  box-sizing: border-box;

  padding: 20px;
  background: #F2F3F5;
  border-radius: 5px;
  color: #8C7967;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;
const AccordionSection = styled.div`
  width: 100%;
  box-sizing: border-box;
  padding: 13px 20px;
  color: #afafaf;

  & > div {
    margin: 5px 0;
  }

  p {
    margin: 0;
  }

  h3 {
    color: #363636;
    font-weight: 600;
    font-size: 16px;
    line-height: 18px;
    margin: 12px 0;
  }
`;
const History = styled.div`
  margin-left: 20px;
  padding-left: 22px;
  border-left: 1px solid #afafaf;

  h3 {
    position: relative;

    &:before {
      content: '';
      display: block;
      position: absolute;

      width: 24px;
      height: 24px;
      background: #f7f7f7;
      border-radius: 50%;
      left: -35px;
      top: -3px;
    }

    &:after {
      content: '';
      display: block;
      position: absolute;

      width: 13px;
      height: 13px;
      background: #363636;
      border-radius: 50%;
      left: -29.5px;
      top: 2.5px;
    }
  }
`;
const Title = styled.h6`
  font-weight: 600;
  font-size: 16px;
  line-height: 18px;

  color: #7EA2AF;
`;
const HR = styled.h6`
  border: 1px solid #F2F3F5;
  margin: 16px 0 21px 0;
`;

const MainImage = styled.img`
  min-height: 335px;
`
const BrandImage = styled.img`
  width: 140px;
  object-fit: contain;
  margin-top: 80px;
`

const defaultData = {
  'info': {
    'mint': {
      'code': '580bbaf06c18a0188037757ea30b6f6f',
      'date': 1669291408,
    },
    'product': {
      'id': '8',
      'name': 'IGI 2',
    },
    'vertical': {
      'id': '1',
      'name': 'Luxury',
    },
    'organisation': {
      'id': '4',
      'name': 'Watchbox',
    },
  },
  'files': [
    {
      'id': '0f778afd074bd9c4a6896abf1025c7cb',
      pointer: 'mainImage',
      'source': 'http://placehold.jp/500x500.png',
      'private': true,
      'encrypted': false,
      'path': '2568_112.jpeg',
    },
    {
      'id': '647ba54d0eaea603927119322b4171bd',
      pointer: 'attachments',
      'source': 'https://dev.origyn.ch/api/origyn/mints/structure/download?mint=580bbaf06c18a0188037757ea30b6f6f&file=647ba54d0eaea603927119322b4171bd',
      'private': true,
      'encrypted': false,
      'path': '2551_942.jpeg',
    },
    {
      'id': 'cd4a8da4e272f2ae4519533a70ad9a30',
      pointer: 'attachments',
      'source': 'https://dev.origyn.ch/api/origyn/mints/structure/download?mint=580bbaf06c18a0188037757ea30b6f6f&file=cd4a8da4e272f2ae4519533a70ad9a30',
      'private': true,
      'encrypted': false,
      'path': '2552_942.jpeg',
    },
    {
      'id': 'c530fb9800c87c83aa97c382fcc6623e',
      pointer: 'gallery',
      'source': 'http://placehold.jp/500x500.png',
      'private': true,
      'encrypted': false,
      'path': '2553_943.jpeg',
    },
    {
      'id': '53c8e5b1a37bb49a97a07c025f43ff16',
      pointer: 'gallery',
      'source': 'http://placehold.jp/400x500.png',
      'private': true,
      'encrypted': false,
      'path': '2554_943.jpeg',
    },
    {
      'id': 'c9685b5bc76e3ea5c7f400d13786f3bb',
      pointer: 'gallery',
      'source': 'http://placehold.jp/500x400.png',
      'private': true,
      'encrypted': false,
      'path': '2555_944.jpeg',
    },
    {
      'id': 'e2a9586630f4b1213da58a59b0c39646',
      'source': 'https://dev.origyn.ch/api/origyn/mints/structure/download?mint=580bbaf06c18a0188037757ea30b6f6f&file=e2a9586630f4b1213da58a59b0c39646',
      'private': true,
      'encrypted': false,
      'path': '2556_945.jpeg',
    },
    {
      'id': 'c286d954caa13062e4ab0b90b2ffbe09',
      'source': 'https://dev.origyn.ch/api/origyn/mints/structure/download?mint=580bbaf06c18a0188037757ea30b6f6f&file=c286d954caa13062e4ab0b90b2ffbe09',
      'private': true,
      'encrypted': false,
      'path': '2557_942.jpeg',
    },
    {
      'id': '4990a886a75b9a6c8b1e5393b976e36b',
      'source': 'https://dev.origyn.ch/api/origyn/mints/structure/download?mint=580bbaf06c18a0188037757ea30b6f6f&file=4990a886a75b9a6c8b1e5393b976e36b',
      'private': true,
      'encrypted': false,
      'path': '2558_945.jpeg',
    },
  ],
  'data': [{
    'name': 'brand_style_id',
    'type': 'text',
    'value': {
      'encrypted': false,
      'language': true,
      'data': {
        'en': '999000',
      },
    },
  }, {
    'name': 'description',
    'type': 'text',
    'value': {
      'encrypted': false,
      'language': true,
      'data': {
        'en': null,
      },
    },
  }, {
    'name': 'name',
    'type': 'text',
    'value': {
      'encrypted': false,
      'language': true,
      'data': {
        'en': 'Natural diamond',
      },
      'id': '92111',
    },
  }, {
    'name': 'feature',
    'type': 'text',
    'value': {
      'encrypted': false,
      'language': true,
      'data': {
        'en': null,
      },
    },
  }, {
    'name': 'carat',
    'type': 'text',
    'value': {
      'encrypted': false,
      'language': true,
      'data': {
        'en': null,
      },
    },
  }, {
    'name': 'perimeter',
    'type': 'text',
    'value': {
      'encrypted': false,
      'language': true,
      'data': {
        'en': null,
      },
    },
  }, {
    'name': 'diameter',
    'type': 'text',
    'value': {
      'encrypted': false,
      'language': true,
      'data': {
        'en': null,
      },
    },
  }, {
    'name': 'usasize',
    'type': 'text',
    'value': {
      'encrypted': false,
      'language': true,
      'data': {
        'en': null,
      },
    },
  }, {
    'name': 'report_number',
    'type': 'text',
    'value': {
      'encrypted': false,
      'language': true,
      'data': {
        'en': '121212',
      },
    },
  }, {
    'name': 'report_description',
    'type': 'text',
    'value': {
      'encrypted': false,
      'language': true,
      'data': {
        'en': 'new test description',
      },
    },
  }, {
    'name': 'report_shape_and_cutting_style',
    'type': 'text',
    'value': {
      'encrypted': false,
      'language': true,
      'data': {
        'en': 'hjkfyuisrtesysrhrth',
      },
    },
  }, {
    'name': 'report_measurement_a',
    'type': 'text',
    'value': {
      'encrypted': false,
      'language': true,
      'data': {
        'en': null,
      },
    },
  }, {
    'name': 'report_measurement_b',
    'type': 'text',
    'value': {
      'encrypted': false,
      'language': true,
      'data': {
        'en': null,
      },
    },
  }, {
    'name': 'report_measurement_c',
    'type': 'text',
    'value': {
      'encrypted': false,
      'language': true,
      'data': {
        'en': null,
      },
    },
  }, {
    'name': 'grading_carat_weight',
    'type': 'text',
    'value': {
      'encrypted': false,
      'language': true,
      'data': {
        'en': '67',
      },
    },
  }, {
    'name': 'grade_cut',
    'type': 'text',
    'value': {
      'encrypted': false,
      'language': true,
      'data': {
        'en': 'Good',
      },
      'id': '92114',
    },
  }, {
    'name': 'grade_polish',
    'type': 'text',
    'value': {
      'encrypted': false,
      'language': true,
      'data': {
        'en': 'Excellent',
      },
      'id': '92108',
    },
  }, {
    'name': 'grade_symetry',
    'type': 'text',
    'value': {
      'encrypted': false,
      'language': true,
      'data': {
        'en': 'Very Good',
      },
      'id': '92121',
    },
  }, {
    'name': 'grade_flourescence',
    'type': 'text',
    'value': {
      'encrypted': false,
      'language': true,
      'data': {
        'en': 'Faint',
      },
      'id': '92125',
    },
  }, {
    'name': 'inscription',
    'type': 'text',
    'value': {
      'encrypted': false,
      'language': true,
      'data': {
        'en': 'ghmncbcxdfgsfwerfergf',
      },
    },
  }, {
    'name': 'grade_comments',
    'type': 'text',
    'value': {
      'encrypted': false,
      'language': true,
      'data': {
        'en': 'flbjkdlkjgldjkfglkdjlkdjglkdjfgkljdljkg',
      },
    },
  }, {
    'name': 'report_date',
    'type': 'text',
    'value': {
      'encrypted': false,
      'language': true,
      'data': {
        'en': '2022-11-30',
      },
    },
  }, {
    'name': 'origyn-mints-diamonds-origyn-mints-diamonds-color',
    'type': 'text',
    'value': {
      'encrypted': false,
      'langauge': false,
      'data': null,
    },
  }, {
    'name': 'origyn-mints-diamonds-origyn-mints-diamonds-clarity',
    'type': 'text',
    'value': {
      'encrypted': false,
      'langauge': false,
      'data': null,
    },
  }, {
    'name': 'origyn-mints-diamonds-origyn-mints-diamonds-depth',
    'type': 'text',
    'value': {
      'encrypted': false,
      'langauge': false,
      'data': '34.00',
    },
  }, {
    'name': 'origyn-mints-diamonds-origyn-mints-diamonds-ugirdle',
    'type': 'text',
    'value': {
      'encrypted': false,
      'langauge': false,
      'data': '34',
    },
  }, {
    'name': 'origyn-mints-diamonds-origyn-mints-diamonds-lgirdle',
    'type': 'text',
    'value': {
      'encrypted': false,
      'langauge': false,
      'data': '34',
    },
  }, {
    'name': 'origyn-mints-diamonds-origyn-mints-diamonds-length',
    'type': 'text',
    'value': {
      'encrypted': false,
      'langauge': false,
      'data': '34.00',
    },
  }, {
    'name': 'origyn-mints-diamonds-origyn-mints-diamonds-table',
    'type': 'text',
    'value': {
      'encrypted': false,
      'langauge': false,
      'data': '34.00',
    },
  }, {
    'name': 'origyn-mints-diamonds-origyn-mints-diamonds-width',
    'type': 'text',
    'value': {
      'encrypted': false,
      'langauge': false,
      'data': '34.00',
    },
  }, {
    'name': 'origyn-mints-diamonds-origyn-mints-diamonds-shape',
    'type': 'text',
    'value': {
      'encrypted': false,
      'langauge': true,
      'data': {
        'en': 'Hearth',
      },
    },
  }, {
    'name': 'origyn-mints-diamonds-origyn-mints-diamonds-culet',
    'type': 'text',
    'value': {
      'encrypted': false,
      'langauge': true,
      'data': {
        'en': 'Pointed',
      },
    },
  }, {
    'name': 'origyn-mints-diamonds-origyn-mints-diamonds-angle',
    'type': 'text',
    'value': {
      'encrypted': false,
      'langauge': true,
      'data': {
        'en': 'Slighty Thin',
      },
    },
  }, {
    'type': 'records',
    'name': 'origyn-mints-files',
    'records': [
      [{
        'name': 'title',
        'type': 'text',
        'value': {
          'encrypted': false,
          'language': true,
          'data': {
            'en': 'test',
          },
        },
      }, {
        'name': 'subtitle',
        'type': 'text',
        'value': {
          'encrypted': false,
          'language': true,
          'data': {
            'en': 'Diamond Report',
          },
        },
      }, {
        'name': 'description',
        'type': 'text',
        'value': {
          'encrypted': false,
          'language': true,
          'data': {
            'en': 'dfhxfgnfxfhjfxn',
          },
        },
      }, {
        'type': 'file',
        'name': 'file',
        'value': {
          'private': true,
          'download': true,
          'encrypted': false,
          'language': false,
          'id': '0f778afd074bd9c4a6896abf1025c7cb',
        },
      }],
    ],
  }, {
    'type': 'records',
    'name': 'origyn-mints-history',
    'records': [{
      'date': {
        'type': 'date',
        'value': {
          'language': false,
          'encrypted': false,
          'data': 1669759200,
        },
      },
      'category': {
        'type': 'text',
        'value': {
          'language': true,
          'encrypted': false,
          'data': {
            'en': 'Service',
          },
        },
      },
      'description': {
        'type': 'text',
        'value': {
          'language': true,
          'encrypted': false,
          'data': {
            'en': 'rtsrthxfnfxnfn',
          },
        },
      },
      'file': {
        'private': true,
        'download': true,
        'encrypted': false,
        'src': 'https://dev.origyn.ch/api/origyn/mints/events/download?fid=61&mid=1090',
        'filename': '119.jpeg',
      },
    }],
  }, {
    'type': 'media',
    'name': 'origyn-mints-images',
    'media': [{
      'private': true,
      'encrypted': false,
      'download': true,
      'type': 'image',
      'slot': '7',
      'src': '647ba54d0eaea603927119322b4171bd',
      'tn': 'cd4a8da4e272f2ae4519533a70ad9a30',
    }, {
      'private': true,
      'encrypted': false,
      'download': true,
      'type': 'image',
      'slot': '10',
      'src': 'c530fb9800c87c83aa97c382fcc6623e',
      'tn': '53c8e5b1a37bb49a97a07c025f43ff16',
    }, {
      'private': true,
      'encrypted': false,
      'download': true,
      'type': 'image',
      'slot': '8',
      'src': 'c9685b5bc76e3ea5c7f400d13786f3bb',
      'tn': 'c9685b5bc76e3ea5c7f400d13786f3bb',
    }, {
      'private': true,
      'encrypted': false,
      'download': true,
      'type': 'image',
      'slot': '9',
      'src': 'e2a9586630f4b1213da58a59b0c39646',
      'tn': 'e2a9586630f4b1213da58a59b0c39646',
    }],
  }, {
    'type': 'text',
    'name': 'origyn-users',
    'value': {
      'encrypted': false,
      'language': false,
      'data': 'Watchbox',
    },
  }],
}

const RenderTemplateBlock = ({ templateObject, data }) => {

  let field;
  return templateObject?.map((tempObj) => {
    switch (tempObj.type) {
      case 'columns':
        return <Grid
          {...tempObj.columns}
          gap={8}
        >
          <RenderTemplateBlock
            templateObject={tempObj.content}
            data={data}
          />
        </Grid>
      case 'elements':
        return <Flex flexFlow='column' gap={8}>
          <RenderTemplateBlock
            templateObject={tempObj.content}
            data={data}
          />
        </Flex>
      case 'mainPhoto':
        return <Flex align="center" justify="center" flexFlow="column">
          <MainImage src={data?.b2bCanisterId ? `https://canister-storage-development.s3.amazonaws.com/${data.canisterId}/tokens/${data.tokenId}/library/${data[tempObj.pointer] && data[tempObj.pointer][0]?.path}` : `https://${data.canisterId}.raw.ic0.app/-/${data.tokenId}/-/${data[tempObj.pointer] && data[tempObj.pointer][0]?.path}`} alt='' />
        </Flex>
      case 'section':
        console.log('section', templateObject)
        return <>
          <Accordion>
            <span>{tempObj?.title?.en}</span>
            <Icons.ArrowRightIcon />
          </Accordion>
          <AccordionSection>
            <RenderTemplateBlock
              templateObject={tempObj.content}
              data={data}
            />
          </AccordionSection>
        </>
      case 'text':
        return <>
          <Container>
            {tempObj?.text?.en}
          </Container>
        </>
      case 'title':
        return <>
          <Title>
            {tempObj?.title?.en}
          </Title>
        </>
      case 'field':
        field = tempObj?.fields?.map((name) => data[name]?.data?.en || data[name]?.data).join(", ");
        console.log(tempObj?.fields, field);
        return <>
          {tempObj?.title?.en ? (
            <FieldBlock>
              <p>{tempObj?.title?.en}</p>
              <p><b>{field}</b></p>
            </FieldBlock>
          ) : (
            <p>{field}</p>
          )}
        </>
      case 'image':
        field = data.data?.find((d) => tempObj?.fields?.includes(d.name))
        return <>
          <img src={data?.b2bCanisterId ? `https://canister-storage-development.s3.amazonaws.com/${data.canisterId}/tokens/${data.tokenId}/library/${data[tempObj.pointer][0].path}` : `https://${data.canisterId}.raw.ic0.app/-/${data.tokenId}/-/${data[tempObj.pointer][0].path}`} alt='' />
        </>
      case 'gallery':
        console.log(tempObj, data[tempObj.pointer]);
        return <>
          <Grid columns={2} smColumns={2} gap={8}>
            {data[tempObj.pointer]?.map((img) => {
              return (
                <img
                  style={{ height: '200px', width: '100%', objectFit: "cover" }}
                  src={data?.b2bCanisterId ? `https://canister-storage-development.s3.amazonaws.com/${data.canisterId}/tokens/${data.tokenId}/library/${img.path}` : `https://${data.canisterId}.raw.ic0.app/-/${data.tokenId}/-/${img.path}`}
                  alt=""
                />
              );
            })}
          </Grid>
        </>
      case 'attachments':
        return <>
          {data[tempObj.pointer]?.map((doc) => (
            <>
              <Flex align="center" justify="space-between">
                <Flex style={{ gap: 14 }} align="center">
                  <Icons.PDFIcon />
                  <div>
                    <p>
                      <b>
                        <span style={{ color: '#363636' }}>
                          { doc?.path }
                        </span>
                      </b>
                    </p>
                    <p style={{ fontSize: 14 }}>
                      {new Date()?.toUTCString()}
                    </p>
                  </div>
                </Flex>
                <a href={data?.b2bCanisterId
                ? `https://canister-storage-development.s3.amazonaws.com/${data.canisterId}/tokens/${data.tokenId}/library/${doc.path}`
                : `https://${data.canisterId}.raw.ic0.app/-/${data.tokenId}/-/${doc.path}`}>
                  <Icons.CopyIcon fill="#000" />
                </a>
              </Flex>
            </>
          ))}
        </>
      case 'history':
        field = data.data?.find((d) => tempObj?.field?.includes(d.name))
        console.log('HISTORY', field)
        return <>
          <History>
            {/* {
              field?.records?.map((r) => {
                console.log(r)
                return (
                  <>
                    <h3>{(new Date(r?.date?.value?.data).toDateString())}</h3>
                    <p>
                      <b>{(r?.category?.value?.data?.en)}</b>
                    </p>
                    <p>{(r?.description?.value?.data?.en)}</p>
                  </>
                )
              })
            } */}
                  <>
                    <h3>{(new Date().toDateString())}</h3>
                    <p>
                      <b>Minted</b>
                    </p>
                    <p>NFT Minting date</p>
                  </>
          </History>
        </>
      case 'separator':
        return <>
          <HR />
        </>
      case 'certificate':
        return <>
          <Certificate
            data={{
              Name: '',
              'NFT Type': 'Digital Twin',
              'Date Minted': '08/25/2022',
              'Owner Principal ID': 'zevfd-yumga-hdmnw-uk7fw-qdetm-l7jk7-rbalg-mvgk4-wqh1u',
              'Canister ID': 'q7abh-kaaaa-aaaaj-qazva-cai',
            }}
          />
        </>
    }
  })
}

const TemplateRender = ({ templateObject, data }) => {

  return (
    <ContentContainer>
      <RenderTemplateBlock
        templateObject={templateObject}
        data={data}
      />
    </ContentContainer>
  )
}

export default TemplateRender
