"use strict";

import { programWithRoutes } from "src";
import renderReact from "src/render/react";
import createStoreRedux from "src/create-store/redux";
import every from "src/subscription/every";
import websocket from "src/subscription/websocket";
import React from "react";
import ReactDom from "react-dom";
import * as Redux from "redux";
import * as Root from "./root";
import * as Hello from "./hello";
import * as NotFound from "./404";

programWithRoutes({
  Root,
  selector: "main",
  render: renderReact({
    renderDom: ReactDom.render,
    createElement: React.createElement
  }),
  createStore: createStoreRedux({
    createStore: Redux.createStore
  }),
  subscriptionLib: {
    every: every(),
    websocket: websocket()
  },
  routes: [
    {
      pattern: /^\/$/,
      Component: Hello 
    },
    {
      pattern: /^\/hello\/([a-zA-Z0-9\s]+)\/?$/,
      Component: Hello
    },
    {
      pattern: /.*/,
      Component: NotFound
    }
  ],
  routeMessage: "route",
  pushState: true
});
