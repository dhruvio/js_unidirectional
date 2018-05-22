"use strict";

import React from "react";
import mapDispatch from "src/util/map-dispatch";
import mapSubscriptions from "src/util/map-subscriptions";
import mapCommand from "src/util/map-command";
import updateChild from "src/util/update-child";
import pushPath from "src/command/push-path";

export const init = ({ params, route }) => {
  const shared = {
    title: "",
    websocketLog: []
  };
  const { state: pageState, command: pageCommand } = route.Component.init({ shared, params });
  return {
    state: {
      shared,
      page: {
        Component: route.Component,
        state: pageState
      }
    },
    command: mapCommand("pageMessage", pageCommand)
  };
};

export const subscriptions = ({ state, lib }) => {
  const { Component, state: pageState } = state.page;
  return mapSubscriptions("pageMessage", Component.subscriptions({
    lib,
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
      return {
        state,
        command: pushPath(data.path)
      };

    case "@appendToWebsocketLog":
      state.shared.websocketLog.push({
        timestamp: Date.now(),
        message: data.message
      });
      return { state };

    case "route":
      const { state: pageState, command: pageCommand } = data.route.Component.init({
        shared: state.shared,
        params: data.params
      });
      state.page.Component = data.route.Component;
      state.page.state = pageState;
      return {
        state,
        command: mapCommand("pageMessage", pageCommand)
      };

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
      <h1 style={linkStyle} onClick={() => dispatch("@navigate", { path: "/" })}>
        My Gif App
      </h1>
      <ul>
        <li>
          <b>Title:</b> {state.shared.title}
        </li>
        <li>
          <b style={linkStyle} onClick={() => dispatch("@navigate", { path: "/log" })}>Websocket messages processed:</b>
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
