import React from "react";
import Permission from "./Permission";
import App from "./App";
import Asset from "./Asset";
import Id from "./Id";

export const Inputs = {
  "Permission": (props) => <Permission item={props} />,
  "App": (props) => <App item={props} />,
  "Asset": (props) => <Asset item={props} />,
  "Id": (props) => <Id item={props} />,
};

