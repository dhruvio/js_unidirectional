"use strict";

import React from "react";
import mapDispatch from "src/util/map-dispatch";
import mapSubscriptions from "src/util/map-subscriptions";
import mapCommand from "src/util/map-command";
import updateChild from "src/util/update-child";
import pushPath from "src/command/push-path";

export const init = ({ params, route }) => {
  const shared = null;
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
    case "@navigate":
      return {
        state,
        command: pushPath(data.path)
      };

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

export const view = ({ state, dispatch }) => {
  return (
    <div id="app">
      <h1>My HelloWorld App</h1>
      <hr />
      <state.page.Component.view state={state.page.state} shared={state.shared} dispatch={mapDispatch("pageMessage", dispatch)} />
    </div>
  );
};
