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
import * as GifList from "./gif-list";
import * as GifPermalink from "./gif-permalink";
import * as WebsocketLog from "./websocket-log";
//import * as NotFound from "./404";

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
      Component: GifList
    },
    {
      pattern: /^\/gif\/([a-zA-Z0-9]+)\/([a-zA-Z0-9]+)\/?$/,
      Component: GifPermalink
    },
    {
      pattern: /^\/log\/?$/,
      Component: WebsocketLog
    },
    //{
      //pattern: /.*/,
      //Component: NotFound
    //}
  ],
  routeMessage: "route",
  pushState: true
});
