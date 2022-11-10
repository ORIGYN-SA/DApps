import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import { getCanisterId } from '@dapp/features-authentication';
import { useSnackbar } from 'notistack';
// mint.js
import { OrigynClient, stageLibraryAsset, getNftCollectionMeta } from '@origyn-sa/mintjs';
import { Layouts } from '../LayoutsType';
import LibraryDefault from '../LayoutsType/LibraryDefault';
import Collapse from '@mui/material/Collapse';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';

const TEST_IDENTITY = {
  principalId: '6i6da-t3dfv-vteyg-v5agl-tpgrm-63p4y-t5nmm-gi7nl-o72zu-jd3sc-7qe',
  seed: 'inherit disease hill can squirrel zone science dentist sadness exist wear aim',
};

const currentCanisterId = async () => {
  const canisterId = await getCanisterId();
  return canisterId;
};

export const LibraryForm = async (props: any) => {
  const { enqueueSnackbar } = useSnackbar();
  const isProd = true;
  const [libraryAssets, setLibraryAssets] = useState<any>([]);
  const [file, setFile] = useState<any>();
  const [type, setType] = useState<any>();
  const [selectedLibrary, setSelectedLibrary] = React.useState('');
  const [radioValue, setRadioValue] = React.useState('Canister');
  const [openFileInput, setOpenFileInput] = React.useState(false);
  const [openSelectInput, setOpenSelectInput] = React.useState(false);
  const [libraries, setLibraries] = React.useState<any>([]);
  const canisterId = async () => {
    return await currentCanisterId();
  };
  function handleInputChange(e) {
    console.log(e.target.files);
    setLibraryAssets(e.target.files);
    setFile(URL.createObjectURL(e.target.files[0]));
    console.log(e.target.files[0].type);
    setType(e.target.files[0].type);
  }
  const handleSelectChange = (event: SelectChangeEvent) => {
    setSelectedLibrary(event.target.value as string);
  };
  const handleRadioChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRadioValue((event.target as HTMLInputElement).value);
  };

  const getLibraries = async () => {
    await OrigynClient.getInstance().init(true, await getCanisterId());
    const response = await getNftCollectionMeta();
    const library = await response.ok.metadata[0].Class.filter((res) => {
      return res.name === 'library';
    })[0].value.Array.thawed;
    console.log('responseCollection', library);
    let libraries = [];
    let i: any;
    for (i in library) {
      libraries.push(
        library[i].Class.filter((res) => {
          return res.name === 'library_id';
        })[0].value.Text,
      );
    }
    setLibraries(libraries);
    setSelectedLibrary(libraries[0]);
  };

  useEffect(() => {
    if (radioValue === 'Canister') {
      setOpenFileInput(true);
      setOpenSelectInput(false);
    } else {
      setOpenFileInput(false);
      setOpenSelectInput(true);
      getLibraries();
    }
  }, [radioValue]);

  const { register, handleSubmit } = useForm({
    defaultValues: {
      canisterId: canisterId,
      isProduction: isProd,
      isSoulbound: true,
      collectionName: '',
      collectionId: '',
      creatorPrincipal: TEST_IDENTITY.principalId,
    },
  });

  const stageLibrary = async () => {
    console.log('token id is ', props.currentTokenId);
    await OrigynClient.getInstance().init(isProd, await canisterId(), {
      key: {
        seed: TEST_IDENTITY.seed,
      },
    });
    let i = 0;
    const payload = {
      token_id: props.currentTokenId,
      files: [
        ...(await Promise.all(
          [...libraryAssets].map(async (file) => {
            return {
              filename: file.name,
              index: i++,
              path: file.path ?? `${file.size}+${file.name}`,
              size: file.size,
              type: file.type,
              rawFile: await readFileAsync(file),
            };
          }),
        )),
      ],
    };
    try {
      console.log(
        '🚀 ~ file: App.tsx ~ line 179 ~ handleStageLibraryAssetClick ~ payload',
        payload,
      );
      const stage = await stageLibraryAsset(payload.files, false, payload.token_id);
      console.log('🚀 ~ file: App.tsx ~ line 175 ~ handleStageLibraryAssetClick ~ stage', stage);
      // Display a success message - SNACKBAR
      enqueueSnackbar('Library staged!', {
        variant: 'success',
        anchorOrigin: {
          vertical: 'top',
          horizontal: 'right',
        },
      });
    } catch (error) {
      // Display a error message - SNACKBAR
      enqueueSnackbar('Something went wrong', {
        variant: 'error',
        anchorOrigin: {
          vertical: 'top',
          horizontal: 'right',
        },
      });
    }
  };

  // Functions needed for file to Buffer
  const arrayToBuffer = (arrayBuffer) => {
    const buffer = Buffer.alloc(arrayBuffer.byteLength);
    const view = new Uint8Array(arrayBuffer);
    for (let i = 0; i < buffer.length; ++i) {
      buffer[i] = view[i];
    }
    return buffer;
  };
  const readFileAsync = (file: File): Promise<Buffer> => {
    return new Promise((resolve, reject) => {
      let reader = new FileReader();
      reader.onload = () => {
        resolve(arrayToBuffer(reader.result));
      };
      reader.onerror = reject;
      reader.readAsArrayBuffer(file);
    });
  };

  useEffect(() => {
    console.log('TOKEN ID FROM FORM', props.currentTokenId);
  }, [props.currentTokenId]);

  return (
    <Grid container maxHeight={300} width={'max-content'}>
      <Grid item xs={12}>
        <Typography
          sx={{
            m: 2,
            fontSize: 14,
            borderBottom: '1px solid',
          }}
          color="text.secondary"
          gutterBottom
        >
          {props.currentTokenId === '' ? (
            <>
              <b>Stage a library for the collection</b>
              <Grid item xs={12}>
                <Box
                  sx={{
                    m: 2,
                  }}
                >
                  <input type="file" id="library" name="library" onChange={handleInputChange} />
                </Box>
                {file === undefined ? (
                  <></>
                ) : (
                  <Box
                    sx={{
                      m: 2,
                    }}
                  >
                    {type in Layouts ? Layouts[type](file) : <LibraryDefault source={file} />}
                  </Box>
                )}
                <Box
                  sx={{
                    m: 2,
                    textAlign: 'right',
                  }}
                >
                  <Button variant="outlined" onClick={stageLibrary}>
                    Stage Library
                  </Button>
                </Box>
              </Grid>
            </>
          ) : (
            <>
              <b>Stage a library for: {props.currentTokenId} </b>
              <Grid>
                <Box
                  sx={{
                    m: 2,
                  }}
                >
                  <Grid item xs={12}>
                    <FormControl>
                      <FormLabel id="radio-location-type">Location Type</FormLabel>
                      <RadioGroup
                        aria-labelledby="radio-location-type"
                        defaultValue="Canister"
                        name="radio-location-type"
                        onChange={handleRadioChange}
                        value={radioValue}
                      >
                        <FormControlLabel value="Canister" control={<Radio />} label="Canister" />
                        <FormControlLabel
                          value="Collection"
                          control={<Radio />}
                          label="Collection"
                        />{' '}
                      </RadioGroup>
                    </FormControl>
                  </Grid>
                  <Collapse in={openSelectInput} timeout="auto" unmountOnExit>
                    <Grid item xs={12} m={2}>
                      <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label">Select</InputLabel>
                        <Select
                          labelId="demo-simple-select-label"
                          id="demo-simple-select"
                          value={selectedLibrary}
                          label="Select"
                          onChange={handleSelectChange}
                        >
                          {libraries.map((library, index) => {
                            return (
                              <MenuItem key={library + index} value={library}>
                                {library}
                              </MenuItem>
                            );
                          })}
                        </Select>
                      </FormControl>
                    </Grid>
                  </Collapse>
                  <Collapse in={openFileInput} timeout="auto" unmountOnExit>
                    <Grid item xs={12} m={2}>
                      <input type="file" id="library" name="library" onChange={handleInputChange} />
                    </Grid>
                  </Collapse>
                </Box>
                {file === undefined ? (
                  <></>
                ) : (
                  <Box
                    sx={{
                      m: 2,
                    }}
                  >
                    {type in Layouts ? Layouts[type](file) : <LibraryDefault source={file} />}
                  </Box>
                )}
                <Box
                  sx={{
                    m: 2,
                    textAlign: 'right',
                  }}
                >
                  {radioValue === 'Canister' ? (
                    <Button variant="outlined" onClick={stageLibrary}>
                      Stage Library
                    </Button>
                  ) : (
                    <Button variant="outlined" onClick={stageLibrary} disabled={true}>
                      IN PROGRESS...
                    </Button>
                  )}
                </Box>
              </Grid>
            </>
          )}
        </Typography>
      </Grid>
    </Grid>
  );
};
