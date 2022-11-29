import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import { getCanisterId } from '@dapp/features-authentication';
import { OrigynClient, stageLibraryAsset } from '@origyn-sa/mintjs';
import { Layouts } from '../LayoutsType';
import LibraryDefault from '../LayoutsType/LibraryDefault';
import TextField from '@mui/material/TextField';

const TEST_IDENTITY = {
  principalId: '6i6da-t3dfv-vteyg-v5agl-tpgrm-63p4y-t5nmm-gi7nl-o72zu-jd3sc-7qe',
  seed: 'inherit disease hill can squirrel zone science dentist sadness exist wear aim',
};

const currentCanisterId = async () => {
  const canisterId = await getCanisterId();
  return canisterId;
};

export const CanisterLocation = (props: any) => {
  const [libraryAssets, setLibraryAssets] = useState<any>([]);
  const [file, setFile] = useState<any>();
  const [type, setType] = useState<any>();
  const [typedTitle, setTypedTitle] = useState<any>();

  const getTypedTitle = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTypedTitle(event.target.value);
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
    await OrigynClient.getInstance().init(true, await currentCanisterId(), {
      key: {
        seed: TEST_IDENTITY.seed,
      },
    });
    try {
    let i = 0;
    const payload = {
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
    console.log('payload is ', await payload);
      const response = await stageLibraryAsset(await payload.files[0], props.tokenId, typedTitle);
      console.log(response);
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
