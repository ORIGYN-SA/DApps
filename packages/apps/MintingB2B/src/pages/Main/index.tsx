import { Box, Tooltip, Typography } from '@mui/material'
import React, { useContext, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  LoadingContainer,
} from '@dapp/features-components'
import {
  Button,
  Card,
  Flex,
  HR,
  SecondaryNav,
  Select,
  TextInput,
  Container,
  Pagination, DatePicker, TextArea, Stepper, useStepper, Icons, Grid,
} from '@origyn-sa/origyn-art-ui'
import { Link } from 'react-router-dom'
import { genRanHex } from '../../../../../utils/src/random'


const GuestContainer = ({ onLogin }) => {
  const [token, setToken] = useState('')

  return (
    <Box
      component='main'
      sx={{
        alignItems: 'center',
        display: 'flex',
        flexGrow: 1,
        minHeight: '100%',
      }}
    >
      <Container size='sm' align='center'>
        <TextInput
          label='Login'
        />
        <TextInput
          label='Password'
          type='password'
          value={token}
          onChange={(e) => setToken(e.target.value)}
        />
        <br />
        <Flex fullWidth justify='center'>
          <Button
            variant='contained'
            onClick={() => onLogin(token)}
          >
            Connect wallet
          </Button>
        </Flex>
      </Container>
    </Box>
  )
}

const RenderBlock = (obj) => {
  switch (obj.inputType || obj.type) {
    case 'text':
    case 'number':
      return <TextInput name={obj.name} type={obj.inputType || obj.type} label={obj.label} />
    case 'date':
      return <DatePicker name={obj.name} label={obj.label} selected={new Date()} onChange={() => {
      }} />
    case 'select':
      return (
        <Select
          name={obj.name}
          label={obj.label}
          options={obj.options.map((v) => ({ value: v, label: v }))}
        />
      )
    case 'largeText':
      return (
        <TextArea name={obj.name} label={obj.label} />
      )
    default:
      return <div></div>
  }
}

const RenderForm = ({ data }) => {
  return <>
    <br />
    {
      data.map((obj) => {
        return (
          <>
            {
              obj?.sectionHeader && (
                <>
                  <br />
                  <h6>{obj?.sectionHeader}</h6>
                  <br />
                  <HR></HR>
                  <br />
                </>
              )
            }
            <RenderBlock {...obj} />
          </>
        )
      })
    }
  </>
}

const defaultDataStructures = {
  IGI: [
    {
      name: 'name',
      label: 'Name',
      type: 'text',
    },
    {
      name: 'report_date',
      type: 'text',
      label: 'Report Date',
      inputType: 'date',
    },
    {
      name: 'report_number',
      type: 'text',
      label: 'Report Number',
      inputType: 'number',
    },
    {
      name: 'grading_carat_weight',
      label: 'Carat Weight',
      inputType: 'number',
      type: 'text',
      sectionHeader: 'Grading Results',
    },
    {
      name: 'grade_cut',
      label: 'Shape & Cut Description',
      type: 'text',
    },
    {
      name: 'grade_polish',
      label: 'Polish',
      type: 'text',
      inputType: 'select',
      options: ['Excellent', 'Very good', 'Good', 'Fair', 'Poor'],
      sectionHeader: 'Additional Grading Information',
    },
    {
      name: 'grade_symmetry',
      label: 'Symmetry',
      type: 'text',
      inputType: 'select',
      options: ['Excellent', 'Very good', 'Good', 'Fair', 'Poor'],
    },
    {
      name: 'grade_fluorescence',
      label: 'Fluorescence',
      type: 'text',
      inputType: 'select',
      options: ['None', 'Faint', 'Medium', 'Strong', 'Very Strong'],
    },
    {
      name: 'grade_comments',
      label: 'Comments',
      type: 'text',
      inputType: 'largeText',
    },
    {
      name: 'origyn-mints-diamonds-shape',
      label: 'Shape',
      type: 'text',
      inputType: 'select',
      options: ['Asher', 'Cushion', 'Emerald', 'Heart', 'Marquise', 'Oval', 'Pear', 'Princess', 'Radiant', 'Round'],
      sectionHeader: 'Custom',
    },
    {
      name: 'origyn-mints-diamonds-color',
      label: 'Color',
      type: 'text',
      inputType: 'select',
      options: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'],
    },
    {
      name: 'origyn-mints-diamonds-clarity',
      label: 'Clarity',
      type: 'text',
      inputType: 'select',
      options: ['IF', 'VVS 1', 'VVS 2', 'VS 1', 'SI 1', 'SI 2', 'I 1', 'I 2', 'I 3'],
    },
    {
      name: 'origyn-mints-diamonds-table',
      label: 'Table',
      type: 'text',
      inputType: 'number',
      sectionHeader: 'Proportions',
    },
    {
      name: 'origyn-mints-diamonds-depth',
      label: 'Depth',
      type: 'text',
      inputType: 'number',
    },
    {
      name: 'origyn-mints-diamonds-culet',
      label: 'Culet',
      type: 'text',
      inputType: 'select',
      options: ['Very Small', 'Small', 'Medium', 'Large', 'Very Large', 'Pointed'],
    },
    {
      name: 'origyn-mints-diamonds-ugirdle',
      label: 'Crown',
      type: 'text',
      inputType: 'number',
    },
    {
      name: 'origyn-mints-diamonds-lgirdle',
      label: 'Pavilion',
      type: 'text',
      inputType: 'number',
    },
    {
      name: 'origyn-mints-diamonds-angle',
      label: 'Angle',
      type: 'text',
      inputType: 'select',
      options: ['Extremely Thin', 'Very Thin', 'Thin', 'Slightly Thin', 'Medium', 'Slightly Thick', 'Thick', 'Very Thick', 'Extremely Thick'],
    },
    {
      name: 'origyn-mints-diamonds-length',
      label: 'Length',
      type: 'text',
      inputType: 'number',
    },
    {
      name: 'origyn-mints-diamonds-width',
      label: 'Width',
      type: 'text',
      inputType: 'number',
    },
    {
      name: 'description',
      label: 'Description',
      type: 'text',
      inputType: 'largeText',
      sectionHeader: 'Description',
    },
    {
      type: 'records',
      name: 'origyn-mints-history',
    },
    // {
    //   type: 'records',
    //   name: 'origyn-mints-files',
    // },

    // {
    //   type: 'media',
    //   name: 'origyn-mints-images',
    // },
  ],
  Luxury: {},
}

const AddFile = ({ handleAdd, pointer }) => {
  const [fileType, setFileType] = useState<any>({ value: 'image/*', label: 'Image' })
  const [file, setFile] = useState<any>()
  const fileInputRef = useRef(null)

  const handleFileChange = (e) => {
    const [fileData] = e.target.files
    console.log(fileData.set)
    setFile(fileData)
  }
  const handlePointerChange = (e) => {

  }

  const addFile = () => {
    const id = genRanHex(32);
    const {name} = file;
    const newFile = new File([file], id);
    const data = {
      fileName: name,
      pointer,
      type: file.type,
      preview: URL.createObjectURL(file),
      file: newFile,
      id,
    }
    handleAdd(data)
    setFile(undefined)
    fileInputRef.current.value = ''
  }

  return (
    <Card padding='8px' align='center' gap={16} justify='space-between'>
      <div>
        <p>Media Type</p>
        <p>
          <Select
            options={[
              { value: 'image/*', label: 'Image' },
              { value: 'video/*', label: 'Video' },
              // { value: 'video/youtube', label: 'YouTube' },
              // { value: 'video/vimeo', label: 'Vimeo' },
            ]}
            selectedOption={fileType}
            handleChange={setFileType}
          />
        </p>
      </div>
      <div>
        <p>Select File</p>
        <p><input type='file' ref={fileInputRef} onChange={handleFileChange} /></p>
      </div>
      {/*<div>*/}
      {/*  <p>Specify Pointer</p>*/}
      {/*  <p><TextInput type='text' onChange={handlePointerChange} /></p>*/}
      {/*</div>*/}
      <div>
        <p></p>
        <Flex>
          <Button type='button' onClick={addFile} iconButton><Icons.CloseIcon /></Button>
        </Flex>
      </div>
    </Card>
  )
}

const AddHistory = ({ handleAdd }) => {
  const [historyType, setHistoryType] = useState<any>({ value: 'appraisal', label: 'Appraisal' })
  const [date, setDate] = useState<any>("")
  const [comment, setComment] = useState("")

  const addHistoryItem = () => {
    const id = genRanHex(32);
    const data = {
      id,
      date: {
        type: "date",
        value: {
          data: date
        }
      },
      category: {
        type: "text",
        value: {
          language: true,
          data: {
            en: historyType.value
          }
        }
      },
      description: {
        type: "text",
        value: {
          language: true,
          data: {
            en: comment
          }
        }
      },
    }
    handleAdd(data)
  }

  return (
    <Container padding='8px'>
      <Flex align='center' gap={16} justify='space-between'>
        <div>
          <p>Date</p>
          <p>
            <DatePicker
              selected={date}
              onChange={setDate}
            />
          </p>
        </div>
        <div>
          <p>Category</p>
          <p>
            <Select
              options={[
                { value: 'appraisal', label: 'Appraisal' },
                { value: 'service', label: 'Service' },
                { value: 'theft', label: 'Theft' },
              ]}
              selectedOption={historyType}
              handleChange={setHistoryType}
            />
          </p>
        </div>
        <div>
          <p>Comment</p>
          <p>
            <TextArea
              name="comment"
              value={comment}
              onChange={(e) => {setComment(e.target.value)}}
            />
          </p>
        </div>
        <div>
          <p></p>
          <Flex>
            <Button type='button' onClick={addHistoryItem} iconButton><Icons.CloseIcon /></Button>
          </Flex>
        </div>
      </Flex>
    </Container>
  )
}

const WalletPage = () => {
  const [loggedIn, setLoggedIn] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isMinting, setIsMinting] = useState(false)
  const [dataStructure, setDataStructure] = useState(JSON.parse(localStorage.getItem('dataStructure')) || defaultDataStructures)
  const navigate = useNavigate()
  const [nftList, setNftList] = useState([])
  const [pagination, setPagination] = useState<any>()
  const [currentPage, setCurrentPage] = useState<any>(1)
  const [metadata, setMetadata] = useState<any>()
  const [files, setFiles] = useState<any>([])
  const [offChainHistory, setOffChainHistory] = useState<any>([])
  const handleLogOut = () => {
    setLoggedIn('')
    localStorage.removeItem('apiKey')
    setNftList([])
  }

  const fetchData = async (page: number) => {
    const response = await fetch(
      `https://development.origyn.network/canister/v0/nft-token?sortKey=createdAt&sortDirection=-1&skip=${30 * (page - 1)}`,
      {
        method: 'GET', // *GET, POST, PUT, DELETE, etc.
        mode: 'cors', // no-cors, *cors, same-origin
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        credentials: 'same-origin', // include, *same-origin, omit
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
          'x-api-key': loggedIn,
        },
      })
    const data = await response.json()
    console.log(data)
    setNftList(data.data)
    setPagination(data.cursor)
    setIsLoading(false)
    return data
  }

  const addMedia = (fileObject) => {
    setFiles([...files, fileObject])
  }
  const addHistory = (historyObject) => {
    setOffChainHistory([...offChainHistory, historyObject])
  }
  const removeFile = (fileId) => {
    setFiles(files.filter(({ id }) => id !== fileId))
  }
  const removeHistory = (fileId) => {
    setOffChainHistory(offChainHistory.filter(({ id }) => id !== fileId))
  }

  const mintNft = async (e) => {
    e.preventDefault()
    const formMeta = new FormData(e.target)
    const formDataObj = {}
    formMeta.forEach((value, key) => (formDataObj[key] = value))
    setMetadata(formDataObj)
    setCurrentTab(currentTab + 1)
  }
  const mintFiles = async (e) => {
    e.preventDefault()
    setIsMinting(true)
    try {
      const formFullData = {
        files: files.map(({fileName, id, type }) => ({fileName, id, type})),
        data: dataStructure.IGI.map(({ name, type }) => ({
          name,
          type,
          value: type === "record" ? metadata[name] : {
            language: true,
            data: {
              en: metadata[name],
            },
          },
        })),
        display: {},
      }
      console.log(formFullData);
      const jsonFile = new Blob([JSON.stringify(formFullData, null, 2)], {
        type: 'application/json',
      })


      const requestFormData = new FormData()
      requestFormData.set('appType', 'ORIGYN')
      requestFormData.set('plan', 'FREEMIUM')
      requestFormData.set('identityType', 'AZURE')
      requestFormData.set('canisterType', 'NFT_CANISTER')

      const file = new File([jsonFile], 'metadata.json', {
        type: 'application/json',
        lastModified: Date.now(),
      })

      requestFormData.set('metadata', file)
      files.forEach(({ pointer, file }) => {
        requestFormData.append(pointer, file)
      })
      console.log(metadata)

      const response = await fetch(
        `https://development.origyn.network/canister/v0/nft-token`,
        {
          method: 'POST', // *GET, POST, PUT, DELETE, etc.
          headers: {
            'x-api-key': loggedIn,
          },
          body: requestFormData,
        })
      const data = await response.json()
      setIsMinting(false)
      navigate(`/${data?.token?.id}`)
      console.log(data?.token?.id)
    } catch (e) {
      setIsMinting(false)
    }
  }
  const saveHistory = async (e) => {
    e.preventDefault();
    setMetadata({
      ...metadata,
      "origyn-mints-history": offChainHistory
    });
    console.log(metadata);

    setCurrentTab(currentTab + 1);
  }
  const handleMainImg = (e) => {
    const [file] = e.target.files
    console.log(file)
    setFiles([...files, {
      fileName: file.name,
      pointer: 'mainImg',
      preview: URL.createObjectURL(file),
      file,
    }])
  }

  const [tabs, content, currentTab, setCurrentTab] = useStepper([
    {
      label: 'Metadata',
      content: <>
        <form onSubmit={mintNft}>
          <RenderForm
            data={dataStructure.IGI}
          />
          <br/>
          <Flex fullWodth justify="center">
            <Button type='submit'>Continue</Button>
          </Flex>
        </form>
      </>,
      id: 'metadata',
    },
    {
      label: 'History',
      content: <>
        <form onSubmit={saveHistory}>
          <br />
          <h6>Off-chain History</h6>
          <br />
          <HR />
          <br />
          <Card padding='8px'>
            <Flex fullWidth flexFlow='column' gap={8}>
              <h6>Add off-chain history</h6>
              {
                offChainHistory.map((item) => {
                  return (
                    <Container padding='8px'>
                      <Flex justify='space-between' gap={16}>
                        <div>
                          <p>Date</p>
                          <p>{item.date?.value?.data.toString()}</p>
                        </div>
                        <div>
                          <p>Category</p>
                          <p>{item?.category?.value?.data?.en}</p>
                        </div>
                        <div>
                          <p>Description</p>
                          <p>{item?.description?.value?.data?.en}</p>
                        </div>
                        <div>
                          <p>Actions</p>
                          <p>
                            <Button type='button' onClick={() => removeHistory(item.id)} iconButton><Icons.CloseIcon /></Button>
                          </p>
                        </div>
                      </Flex>
                    </Container>
                  )
                })
              }
              <AddHistory
                handleAdd={addHistory}
              />
            </Flex>
          </Card>
          <br />
          <Flex fullWodth justify="center">
            <Button type='submit'>Continue</Button>
          </Flex>
        </form>
      </>,
      id: 'history',
    },
    {
      label: 'Files',
      content: <>
        <form onSubmit={mintFiles}>
          <br />
          <h6>Files</h6>
          <br />
          <HR />
          <br />
          <label htmlFor='main_image'>
            <Card padding='8px'>
              <Flex fullWidth justify='space-between' align='center'>
                <h6>Main image</h6>
                <img height={50} src={files.find(({ pointer }) => pointer === 'mainImg')?.preview} alt='' />
                <input
                  id='main_image'
                  type='file'
                  accept='image/*'
                  name='main_image'
                  onChange={handleMainImg}
                />
              </Flex>
            </Card>
          </label>
          <br />
          <Card padding='8px'>
            <Flex fullWidth flexFlow='column' gap={8}>
              <h6>Media</h6>
              {
                files.filter(({ pointer }) => pointer === 'media').map((item) => {
                  return (
                    <Card key={item.id} padding='8px' justify='space-between' gap={16}>
                      <div>
                        <p>Media Type</p>
                        <p>{item.type}</p>
                      </div>
                      <div>
                        <p>Name</p>
                        <p>{item.fileName}</p>
                      </div>
                      <div>
                        <p>Pointer</p>
                        <p>{item.pointer}</p>
                      </div>
                      <div>
                        <p>Preview</p>
                        <p><img height={50} src={item.preview} alt='' /></p>
                      </div>
                      <div>
                        <p>Actions</p>
                        <p>
                          <Button type='button' onClick={() => removeFile(item.id)} iconButton><Icons.CloseIcon /></Button>
                        </p>
                      </div>
                    </Card>
                  )
                })
              }
              <AddFile
                handleAdd={addMedia}
                pointer='media'
              />
            </Flex>
          </Card>
          <br />
          <Card padding='8px'>
            <Flex fullWidth flexFlow='column' gap={8}>
              <h6>Attachments</h6>
              {
                files.filter(({ pointer }) => pointer === 'attachments').map((item) => {
                  return (
                    <Card key={item.id} padding='8px' justify='space-between' gap={16}>
                      <div>
                        <p>Media Type</p>
                        <p>{item.type}</p>
                      </div>
                      <div>
                        <p>Name</p>
                        <p>{item.fileName}</p>
                      </div>
                      <div>
                        <p>Pointer</p>
                        <p>{item.pointer}</p>
                      </div>
                      <div>
                        <p>Preview</p>
                        <p><img height={50} src={item.preview} alt='' /></p>
                      </div>
                      <div>
                        <p>Actions</p>
                        <p>
                          <Button type='button' onClick={() => removeFile(item.id)} iconButton><Icons.CloseIcon /></Button>
                        </p>
                      </div>
                    </Card>
                  )
                })
              }
              <AddFile
                handleAdd={addMedia}
                pointer='attachments'
              />
            </Flex>
          </Card>
          <br />
          <Flex fullWodth justify="center">
            <Button type='submit'>Mint</Button>
          </Flex>
        </form>
      </>,
      id: 'files',
    },
  ])

  useEffect(() => {
    if (loggedIn) {
      console.log(loggedIn)
      localStorage.setItem('apiKey', loggedIn)
      fetchData(1)
    }
  }, [loggedIn])

  useEffect(() => {
    if (loggedIn) {
      fetchData(currentPage)
    }
  }, [currentPage])

  useEffect(() => {
    setLoggedIn(localStorage.getItem('apiKey'))
    if (localStorage.getItem('dataStructure')) {
      setDataStructure(defaultDataStructures);
    }
  }, [])

  return (
    <>
      {loggedIn ? (
        <Flex fullWidth padding='0' flexFlow='column'>
          <SecondaryNav
            title='Vault'
            tabs={[
              { title: 'NFTs', id: 'NFTs' },
              { title: 'Minter', id: 'Minter' },
              { title: 'Data Structure', id: 'dataStructure' },
            ]}
            content={[
              <Container padding='16px'>
                <br />
                <h2>NFTs</h2>
                <br />
                {
                  isLoading ? (
                    <LoadingContainer />
                  ) : (
                    <Flex flexFlow='column' gap={8}>
                      <Pagination
                        pageCount={Math.ceil(pagination?.total / pagination?.limit)}
                        onPageChange={setCurrentPage}
                      />
                      {
                        nftList.map((item) => {
                          return (
                            <Card as={Link} to={`/${item.tokenId}`} padding='8px' justify='space-between'>
                              <Flex flexFlow='column' gap={4}>
                                <p className='secondary_color'>Token ID</p>
                                <p>{item.tokenId}</p>
                              </Flex>
                              <Flex flexFlow='column' gap={4}>
                                <p className='secondary_color'>App Type</p>
                                <p>{item.appType}</p>
                              </Flex>
                              <Flex flexFlow='column' gap={4}>
                                <p className='secondary_color'>Status</p>
                                <p>{item.status}</p>
                              </Flex>
                            </Card>
                          )
                        })
                      }
                    </Flex>
                  )
                }
              </Container>,
              <Container padding='16px'>
                <br />
                <h2>Minter</h2>
                <br />
                {tabs}
                {isMinting ? (
                  <LoadingContainer />
                ) : (
                  content
                )}
              </Container>,
              <Container padding='16px'>
                <br />
                <h2>Change Certificate Data structure</h2>
                <br />
                <Flex fullWidth flexFlow="column" gap={8}>
                  {
                    dataStructure.IGI?.map((dataItem) => {
                      return (
                        <>
                          <Grid columns={4} smColumns={4}>
                            <div>
                              <p className='secondary_color'>Label</p>
                              <p>{dataItem.label}</p>
                            </div>
                            <div>
                              <p className='secondary_color'>Type</p>
                              <p>{dataItem.type}</p>
                            </div>
                            <div>
                              <p className='secondary_color'>Input Type</p>
                              <p>{dataItem.inputType}</p>
                            </div>
                            <div>
                              <p className='secondary_color'>Actions</p>
                              <p><Button size="small">Remove Field</Button></p>
                            </div>
                          </Grid>
                          <HR />
                        </>
                      )
                    })
                  }
                </Flex>
              </Container>,
            ]}
            onLogOut={handleLogOut}
            principal={loggedIn}
          />
        </Flex>
      ) : (
        <GuestContainer
          onLogin={setLoggedIn}
        />
      )}
    </>
  )
}

export default WalletPage
