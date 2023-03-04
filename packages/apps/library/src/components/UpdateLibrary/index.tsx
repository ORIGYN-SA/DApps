import React from 'react';
import { UpdateLibraryFile } from './UpdateLibraryFile';
import { UpdateLibraryWeb } from './UpdateLibraryWeb';
import { UpdateLibraryCollection } from './UpdateLibraryCollection';

const UpdateLayouts = {
  canister: (tokenId, updateLibraryData, setOpenLibrary, metadata) => (
    <UpdateLibraryFile
      tokenId={tokenId}
      updateLibraryData={updateLibraryData}
      setOpenLibrary={setOpenLibrary}
      metadata={metadata}
    />
  ),
  web: (tokenId, updateLibraryData, setOpenLibrary, metadata) => (
    <UpdateLibraryWeb
      tokenId={tokenId}
      updateLibraryData={updateLibraryData}
      setOpenLibrary={setOpenLibrary}
      metadata={metadata}
    />
  ),
  collection: (tokenId, updateLibraryData, setOpenLibrary, metadata) => (
    <UpdateLibraryCollection
      tokenId={tokenId}
      updateLibraryData={updateLibraryData}
      setOpenLibrary={setOpenLibrary}
      metadata={metadata}
    />
  ),
};

type Props = {
  tokenId: string;
  updateLibraryData: void;
  setOpenLibrary: void;
  locationType: string;
  metadata: any;
};
export const UpdateLibrary = ({
  tokenId,
  updateLibraryData,
  setOpenLibrary,
  locationType,
  metadata,
}: Props) => {
  if(locationType != ''){
  return <>{UpdateLayouts[locationType](tokenId, updateLibraryData, setOpenLibrary, metadata)}</>;
  }else{
    return <></>;
  }
};
