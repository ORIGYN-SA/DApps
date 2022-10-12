import React from "react";
import LibraryFont from "./LibraryFont";
import LibraryImage from "./LibraryImage";
import LibraryVideo from "./LibraryVideo";
import LibraryTextHtml from "./LibraryTextHtml";
import LibraryPdf from "./LibraryPdf";

export const Layouts = {
    "image/jpeg": (props) => <LibraryImage source={props} />,
    "image/jpg": (props) => <LibraryImage source={props} />,
    "image/png": (props) => <LibraryImage source={props} />,
    "image/gif": (props) => <LibraryImage source={props} />,
    "image/svg+xml": (props) => <LibraryImage source={props} />,
    "image/webp": (props) => <LibraryImage source={props} />,
    "image/bmp": (props) => <LibraryImage source={props} />,
    "video/mp4": (props) => <LibraryVideo source={props} />,
    "video/html5": (props) => <LibraryVideo source={props} />,
    "text/html": (props) => <LibraryTextHtml source={props} />,
    "font/ttf": (props) => <LibraryFont source={props} />,
    "font/otf": (props) => <LibraryFont source={props} />,
    "font/woff": (props) => <LibraryFont source={props} />,
    "application/pdf": (props) => <LibraryPdf source={props}/>,
  };

