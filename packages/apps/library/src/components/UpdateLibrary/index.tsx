import React from 'react';
import { UpdateLibraryFile } from './UpdateLibraryFile';
import { UpdateLibraryWeb } from './UpdateLibraryWeb';
import { UpdateLibraryCollection } from './UpdateLibraryCollection';

const UpdateLayouts = {
  canister : (tokenId, libraryId, updateLibraryData, setOpenLibrary, metadata) => (
    <UpdateLibraryFile
      tokenId={tokenId}
      libraryId={libraryId}
      updateLibraryData={updateLibraryData}
      setOpenLibrary={setOpenLibrary}
      metadata = {metadata}
    />
  ),
  web : (tokenId, libraryId, updateLibraryData, setOpenLibrary,metadata) => (
    <UpdateLibraryWeb
      tokenId={tokenId}
      updateLibraryData={updateLibraryData}
      setOpenLibrary={setOpenLibrary}
      metadata={metadata}
    />
  ),
  collection : (tokenId,libraryId, updateLibraryData, setOpenLibrary,metadata) => (
    <UpdateLibraryCollection
      tokenId={tokenId}
      updateLibraryData={updateLibraryData}
      setOpenLibrary={setOpenLibrary}
      metadata={metadata}
    />
  )
}

type Props = {
  tokenId: string;
  libraryId: string;
  updateLibraryData: any;
  setOpenLibrary: any;
  locationType: string;
  metadata: any
};
export const UpdateLibrary = ({
  tokenId,
  libraryId,
  updateLibraryData,
  setOpenLibrary,
  locationType,
  metadata
}: Props) => {
 
  return (
    <>
      {
        UpdateLayouts[locationType](tokenId, libraryId, updateLibraryData, setOpenLibrary,metadata)
      }
    </>
  );
};
