"use strict";

import { program } from "src";
import renderReact from "src/render/react";
import createStoreRedux from "src/create-store/redux";
import React from "react";
import ReactDom from "react-dom";
import * as Redux from "redux";
import * as Component from "./root";

program({
  Component,
  selector: "main",
  options: {
    render: renderReact({
      renderDom: ReactDom.render,
      createElement: React.createElement
    }),
    createStore: createStoreRedux({
      createStore: Redux.createStore
    })
  }
});
