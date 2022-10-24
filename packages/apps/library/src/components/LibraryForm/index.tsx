import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import { getCanisterId } from '@dapp/features-authentication';
import { useSnackbar } from 'notistack';
// mint.js
import { OrigynClient, stageLibraryAsset } from '@origyn-sa/mintjs';
import { Layouts } from '../LayoutsType';
import LibraryDefault from '../LayoutsType/LibraryDefault';

const TEST_IDENTITY = {
  principalId: '6i6da-t3dfv-vteyg-v5agl-tpgrm-63p4y-t5nmm-gi7nl-o72zu-jd3sc-7qe',
  seed: 'inherit disease hill can squirrel zone science dentist sadness exist wear aim',
};

const currentCanisterId = async () => {
  const canisterId = await getCanisterId();
  return canisterId;
};

export const LibraryForm = (props: any) => {
  const { enqueueSnackbar } = useSnackbar();
  const [canisterId, setCanisterId] = useState(currentCanisterId());
  const [isProd, setIsProd] = useState(true);
  const [libraryAssets, setLibraryAssets] = useState<any>([]);
  const [file, setFile] = useState<any>();
  const [type, setType] = useState<any>();
  function handleInputChange(e) {
    console.log(e.target.files);
    setLibraryAssets(e.target.files);
    setFile(URL.createObjectURL(e.target.files[0]));
    console.log(e.target.files[0].type);
    setType(e.target.files[0].type);
  }

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
    await OrigynClient.getInstance().init(isProd, await canisterId, {
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
    console.log('🚀 ~ file: App.tsx ~ line 179 ~ handleStageLibraryAssetClick ~ payload', payload);
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
            <b>Stage a default library</b>
          ) : (
            <b>Stage a library for: {props.currentTokenId} </b>
          )}
        </Typography>
      </Grid>
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
          }}
        >
          <Button variant="outlined" onClick={stageLibrary}>
            Stage Library
          </Button>
        </Box>
      </Grid>
    </Grid>
  );
};
