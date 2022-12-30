import React from 'react';
import { UpdateLibraryFile } from './UpdateLibraryFile';
import { UpdateLibraryWeb } from './UpdateLibraryWeb';

const UpdateLayouts = {
  canister : (tokenId, libraryId, updateCollectionLevelLibraryData, setOpenLibraryCollectionLevel, metadata) => (
    <UpdateLibraryFile
      tokenId={tokenId}
      libraryId={libraryId}
      updateCollectionLevelLibraryData={updateCollectionLevelLibraryData}
      setOpenLibraryCollectionLevel={setOpenLibraryCollectionLevel}
      metadata = {metadata}
    />
  ),
  web : (tokenId, libraryId, updateCollectionLevelLibraryData, setOpenLibraryCollectionLevel,metadata) => (
    <UpdateLibraryWeb
      tokenId={tokenId}
      updateCollectionLevelLibraryData={updateCollectionLevelLibraryData}
      setOpenLibraryCollectionLevel={setOpenLibraryCollectionLevel}
      metadata={metadata}
    />
  ),
}

type Props = {
  tokenId: string;
  libraryId: string;
  updateCollectionLevelLibraryData: any;
  setOpenLibraryCollectionLevel: any;
  locationType: string;
  metadata: any
};
export const UpdateLibrary = ({
  tokenId,
  libraryId,
  updateCollectionLevelLibraryData,
  setOpenLibraryCollectionLevel,
  locationType,
  metadata
}: Props) => {
 
  return (
    <>
      {
        UpdateLayouts[locationType](tokenId, libraryId, updateCollectionLevelLibraryData, setOpenLibraryCollectionLevel,metadata)
      }
    </>
  );
};
