import React, { useState, useContext } from 'react';
import { AuthContext, useRoute } from '@dapp/features-authentication';
import { OrigynClient, stageLibraryAsset, getNft, getNftCollectionMeta } from '@origyn/mintjs';
import { Layouts } from '../LayoutsType';
import LibraryDefault from '../LayoutsType/LibraryDefault';
import { useSnackbar } from 'notistack';
import { Container, TextInput, Button, HR, Flex, CheckboxInput } from '@origyn/origyn-art-ui';
import { Buffer } from 'buffer';

export const CanisterLocation = (props: any) => {
  const { actor } = useContext(AuthContext);
  const { enqueueSnackbar } = useSnackbar();
  const [libraryAssets, setLibraryAssets] = useState<any>([]);
  const [file, setFile] = useState<any>();
  const [type, setType] = useState<any>();
  const [typedTitle, setTypedTitle] = useState<string>();
  const [typedId, setTypedId] = useState<string>();
  const [immutable, setImmutable] = React.useState(false);

  const handleChangeImmutable = () => {
    setImmutable(!immutable);
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
  console.log(props);
  const stageLibrary = async () => {
    const { canisterId } = await useRoute();
    await OrigynClient.getInstance().init(true, canisterId, { actor });
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
                title: typedTitle,
                immutable: immutable,
                libraryId: typedId,
                isNewLibrary: true,
              };
            }),
          )),
        ],
      };
      console.log('payload is ', payload);
      props.setInProgress(true);
      try {
        const response = await stageLibraryAsset([payload.files[0]], props.tokenId);
        console.log('response', response);
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
    props.setInProgress(false);
    props.isOpen(false);

    if (props.tokenId == '') {
      //Update the library data for the collection
      getNftCollectionMeta().then((r) => {
        props.updateData(
          r.ok?.metadata?.[0]?.['Class']?.filter((res) => {
            return res.name === 'library';
          })?.[0]?.value?.Array?.thawed || [],
        );
      });
    } else {
      //Update the library data for the Token
      getNft(props.tokenId).then((r) => {
        props.updateData(
          r.ok?.metadata?.[0]?.['Class']?.filter((res) => {
            return res.name === 'library';
          })?.[0]?.value?.Array?.thawed || [],
        );
      });
    }
  };

  return (
    <>
      <Container size="full">
        <Flex flexFlow="column" gap={8}>
          <Flex>
            <TextInput
              label="Library title"
              id="title"
              placeholder="Enter Library Title"
              onChange={getTypedTitle}
            />
          </Flex>
          <Flex>
            <TextInput
              label={'Library id'}
              id="id"
              placeholder="Enter Library Id"
              onChange={getTypedId}
            />
          </Flex>
          <HR marginTop={16} marginBottom={16} />
          <Flex>
            <input
              type="file"
              id="library"
              name="library"
              onChange={handleInputChange}
              multiple={false}
            />
          </Flex>
          <HR marginTop={16} marginBottom={16} />
          <Flex>
            <Flex flexFlow="row" gap={8}>
              <Flex>
                <CheckboxInput
                  name="immutable"
                  onChange={handleChangeImmutable}
                  checked={immutable}
                />
              </Flex>
              <Flex>
                <p>
                  Make this Library <b>immutable</b>
                </p>
              </Flex>
            </Flex>
          </Flex>

          {file === undefined ? (
            <></>
          ) : (
            <Flex>{type in Layouts ? Layouts[type](file) : <LibraryDefault source={file} />}</Flex>
          )}

          <HR marginTop={16} marginBottom={16} />

          <Flex>
            <Button btnType="filled" onClick={stageLibrary}>
              Stage Library
            </Button>
          </Flex>
        </Flex>
      </Container>
    </>
  );
};
