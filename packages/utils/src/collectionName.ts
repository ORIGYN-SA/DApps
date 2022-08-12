export const collectionName = (_tokenId: string) => {
  if (_tokenId == '') {
    //find the id of 'collection' -1
    const url_array: string[] = window.location.pathname.split('/');
    const collection_id: number = url_array.indexOf('collection') - 1;
    return url_array[collection_id];
  }
};
