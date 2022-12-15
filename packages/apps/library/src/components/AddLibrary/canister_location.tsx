import React, { useState,useContext } from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import { AuthContext, useRoute } from '@dapp/features-authentication'
import { OrigynClient, stageLibraryAsset } from '@origyn-sa/mintjs';
import { Layouts } from '../LayoutsType';
import LibraryDefault from '../LayoutsType/LibraryDefault';
import TextField from '@mui/material/TextField';
import { useSnackbar } from 'notistack';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';

export const CanisterLocation = (props: any) => {
  const { actor } = useContext(AuthContext);
  const { enqueueSnackbar } = useSnackbar();
  const [libraryAssets, setLibraryAssets] = useState<any>([]);
  const [file, setFile] = useState<any>();
  const [type, setType] = useState<any>();
  const [typedTitle, setTypedTitle] = useState<string>();
  const [typedId, setTypedId] = useState<string>();
  const [immutable, setImmutable] = React.useState(false);

  const handleChange = (event) => {
    setImmutable(event.target.value);
    console.log(event.target.value)
  };
  const getTypedTitle = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTypedTitle(event.target.value);
  };
  const getTypedId = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTypedId(event.target.value);
  };
  const handleInputChange = (e) => {
    console.log(e.target.files);
    setLibraryAssets(e.target.files);
    setFile(URL.createObjectURL(e.target.files[0]));
    console.log(e.target.files[0].type);
    setType(e.target.files[0].type);
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

  const stageLibrary = async () => {
    const {canisterId} = await useRoute();

    await OrigynClient.getInstance().init(true, canisterId, {actor});
    try {
      let i = 0;
      const payload = {
        files: [
          ...(await Promise.all(
            [...libraryAssets].map(async (file) => {
              return {
                assetType: undefined,
                filename: file.name,
                index: i++,
                path: file.path ?? `${file.size}+${file.name}`,
                size: file.size,
                type: file.type,
                rawFile: await readFileAsync(file),
                title:typedTitle,
                immutable: immutable,
                libraryId:typedId
              };
            }),
          )),
        ],
      };
      console.log('payload is ', payload);
      try {
        const response = await stageLibraryAsset([payload.files[0]], props.tokenId);
        console.log('response',response);
        if (response.ok) {
          // Display a success message - SNACKBAR
          enqueueSnackbar('Library staged!', {
            variant: 'success',
            anchorOrigin: {
              vertical: 'top',
              horizontal: 'right',
            },
          });
        } else {
          enqueueSnackbar('Library not staged!', {
            variant: 'error',
            anchorOrigin: {
              vertical: 'top',
              horizontal: 'right',
            },
          });
        }
        console.log(response);
      } catch (e) {
        console.log(e);
      }
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <Grid item xs={12}>
      <>
        <Box
          sx={{
            mt: 2,
          }}
        >
          <TextField
            id="title"
            label="Library Title"
            variant="outlined"
            fullWidth
            placeholder="Enter Title"
            onChange={getTypedTitle}
          />
        </Box>
        <Box
          sx={{
            mt: 2,
          }}
        >
          <TextField
            id="title"
            label="Library Id"
            variant="outlined"
            fullWidth
            placeholder="Enter Id"
            onChange={getTypedId}
          />
        </Box>
        <Box
          sx={{
            mt: 2,
          }}
        >
          <Grid item xs={12} m={2}>
            <input
              type="file"
              id="library"
              name="library"
              onChange={handleInputChange}
              multiple={false}
            />
          </Grid>
        </Box>
        
        <Box
          sx={{
            mt: 2,
          }}
        >
          <Grid item xs={12} m={2}>
            <FormControl>
              <FormLabel id="demo-radio-buttons-group-label">Make library mutable or not</FormLabel>
              <RadioGroup
                aria-labelledby="demo-radio-buttons-group-label"
                defaultValue="Mutable"
                name="radio-buttons-group"
                value={immutable}
                onChange={handleChange}
              >
                <FormControlLabel value={false}control={<Radio />} label="Mutable" />
                <FormControlLabel value={true} control={<Radio />} label="Immutable" />
              </RadioGroup>
            </FormControl>
          </Grid>
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
      </>
      <Box
        sx={{
          m: 2,
        }}
      ></Box>
      <Button variant="outlined" onClick={stageLibrary}>
        Stage Library
      </Button>
      <Box />
    </Grid>
  );
};
