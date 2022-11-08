import React, { useState, useEffect, createContext, useContext } from 'react';

export interface metadataContextType {
  setMetatype : (name: string, value: any) => void;
  preview : MetaType;
  experience : MetaType;
  primary : MetaType;
  hidden : MetaType;
  id : MetaType;
  owner : MetaType;
  app_id : MetaType;
}

// create a context with an array of items and a function to add items
export const MetadataContext = createContext<metadataContextType>({
  setMetatype : (value : any) => {},
  preview : {
    name : '',
    value : '',

  },
  experience : {
    name : '',
    value : '',
  },
  primary : {
    name : '',
    value : '',
  },
  hidden : {
    name : '',
    value : '',
  },
  id : {
    name : '',
    value : '',
  },
  owner : {
    name : '',
    value : '',
  },
  app_id : {
    name : '',
    value : '',
  },
});

export const useMetaContext = () => useContext(MetadataContext);

export interface MetaType {
  name: string;
  value: any;
}

export const useMeta = () => {
  const [preview, setPreview] = useState<MetaType>();
  const [experience, setExperience] = useState<MetaType>();
  const [primary, setPrimary] = useState<MetaType>();
  const [hidden, setHidden] = useState<MetaType>();
  const [owner, setOwner] = useState<MetaType>();
  const [id, setId] = useState<MetaType>();
  const [app_id, setApp_id] = useState<MetaType>();

  const setMetatype = (name: string, value: any) => {
    switch (name) {
      case 'Preview':
        setPreview({ name, value });
        break;
      case 'Experience':
        setExperience({ name, value });
        break;
      case 'Primary':
        setPrimary({ name, value });
        break;
      case 'Hidden':
        setHidden({ name, value });
        break;
      case 'Id': 
        setId({ name, value });
        break;
      case 'Owner':
        setOwner({ name, value });
        break;
      case 'App_Id' : 
        setApp_id({ name, value });
        break;
      default:
        break;
    }
  };

  return {
    setMetatype,
    preview,
    experience,
    primary,
    hidden,
    id,
    owner,
  };
}


export const MetaProvider: React.FC = ({ children }) => {
  const auth  = useMeta();

  return (
    <MetadataContext.Provider value={auth}>
      {children}
    </MetadataContext.Provider>
  );
};
