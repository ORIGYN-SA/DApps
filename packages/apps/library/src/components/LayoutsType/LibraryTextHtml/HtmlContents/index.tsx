import React from 'react';
import { YouTube } from './youtube';
import { Vimeo } from './vimeo';
export const WebContentsType = {
  "youtube": (props) => <YouTube htmlContent={props} />,
  "vimeo": (props) => <Vimeo htmlContent={props} />,
};
