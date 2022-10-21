import React, { useState } from 'react';
import { OrigynClient, stageLibraryAsset } from '@origyn-sa/mintjs';
import JSONbig from 'json-bigint';
import { useForm } from 'react-hook-form';
import { Buffer } from 'buffer';
import Paper from '@mui/material/Paper';
import { Box } from '@mui/system';

export const AddForm = (props) => {
  const [library, setLibraries] = useState<any>([]);

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
  let i = 0 ;
  const handleClick = async (data) => {
    await OrigynClient.getInstance().init(true,props.canisterId);
    const payload = {
      ...(await Promise.all(
        [...library].map(async (file) => {
          return {
            token_id: 'ts-0',
            files: [
              {
                filename: file.name,
                index: i++,
                path: file.path ?? `${file.size}+${file.name}`,
                size: file.size,
                type: file.type,
                rawFile: await readFileAsync(file),
                assetType: 'preview' as 'preview', // Just make the first file of the NFT as preview asset, needs to be removed in the future
              },
            ],
          };
        }),
      )),
    };

    console.log('payload',payload);
    const stage = await stageLibraryAsset(payload[0].files, payload[0].token_id);
    console.log('stage',stage);
  };
  return (
    <>
      <Box component={Paper} elevation={2} sx={{ margin: 2, width: '100%', padding: 2 }}>
        <div>
          <form>
            <div>
              <label htmlFor="Libraries">Choose Libraries :</label>
              <input
                type="file"
                name="Libraries"
                multiple
                onChange={(e) => setLibraries(e.target.files)}
              />
            </div>
          </form>
          <button onClick={handleClick}>Add Library</button>
        </div>
      </Box>
    </>
  );
};
