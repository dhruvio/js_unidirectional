"use strict";

import React from "react";
import PropTypes from "prop-types";
import * as GifList from "./gif-list";
import * as WebsocketLog from "./websocket-log";
import mapDispatch from "../util/map-dispatch";
import mapSubscriptions from "../util/map-subscriptions";
import mapCommand from "../util/map-command";
import updateChild from "../util/update-child";

export const init = (Component = GifList) => {
  const { state: pageState, command: pageCommand } = Component.init();
  return {
    state: {
      shared: {
        title: "",
        websocketLog: []
      },
      page: {
        Component,
        state: pageState
      }
    },
    command: mapCommand("pageMessage", pageCommand)
  };
};

export const subscriptions = state => {
  const { Component, state: pageState } = state.page;
  return mapSubscriptions("pageMessage", Component.subscriptions({
    shared: state.shared,
    state: pageState
  }));
};

export const update = ({ state, message, data }) => {
  switch (message) {
    case "@setTitle":
      state.shared.title = data.title;
      return { state };

    case "@navigate":
      const { Component, initArgs = [] } = data;
      const { state: pageState, command: pageCommand } = Component.init(...initArgs);
      state.page = {
        Component,
        state: pageState
      };
      return {
        state,
        command: mapCommand("pageMessage", pageCommand)
      };

    case "@appendToWebsocketLog":
      state.shared.websocketLog.push({
        timestamp: Date.now(),
        message: data.message
      });
      return { state };

    case "pageMessage":
      const { state: pageState_, command } = updateChild({
        key: "state",
        parentState: state.page,
        parentMessage: "pageMessage",
        sharedState: state.shared,
        childUpdate: state.page.Component.update,
        childMessage: data.message,
        childData: data.data
      });
      state.page = pageState_;
      return { state, command };

    default:
      return { state };
  }
};

const linkStyle = {
  color: "blue",
  textDecoration: "underline",
  cursor: "pointer"
};

const viewHeader = ({ state, dispatch }) => {
  return (
    <header>
      <h1 style={linkStyle} onClick={() => dispatch("@navigate", { Component: GifList })}>
        My Gif App
      </h1>
      <ul>
        <li>
          <b>Title:</b> {state.shared.title}
        </li>
        <li>
          <b style={linkStyle} onClick={() => dispatch("@navigate", { Component: WebsocketLog })}>Websocket messages processed:</b>
          <span style={{ marginLeft: "10px" }}>{state.shared.websocketLog.length}</span>
        </li>
      </ul>
    </header>
  );
};

const viewActivePage = ({ state, dispatch }) => {
  const pageDispatch = mapDispatch("pageMessage", dispatch);
  const { Component, state: pageState } = state.page;
  return (
    <div className="page page-active">
      <Component.view shared={state.shared} state={pageState} dispatch={pageDispatch} />
    </div>
  );
};

export const view = ({ state, dispatch }) => {
  return (
    <div id="app">
      {viewHeader({ state, dispatch })}
      <hr />
      {viewActivePage({ state, dispatch })}
    </div>
  );
};
