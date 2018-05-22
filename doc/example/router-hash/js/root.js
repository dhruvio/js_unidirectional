"use strict";

import React from "react";
import mapDispatch from "src/util/map-dispatch";
import mapCommand from "src/util/map-command";
import mapSubscriptions from "src/util/map-subscriptions";
import updateChild from "src/util/update-child";
import pushHash from "src/command/push-hash";

export function init ({ path, location, route }) {
  const shared = {
    path,
    location,
    messages: []
  };
  const { state: pageState, command: pageCommand } = route.Component.init(shared);
  return {
    state: {
      route,
      page: pageState,
      shared
    },
    command: mapCommand("pageMessage", pageCommand)
  };
}

export function subscriptions ({ state, lib }) {
  return mapSubscriptions("pageMessage", state.route.Component.subscriptions({
    state: state.page,
    shared: state.shared,
    lib
  }));
}

export function update ({ state, message, data }) {
  switch (message) {

    case "@navigate":
      return { state, command: pushHash(data.path) };

    case "@addMessage":
      state.messages = state.shared.messages.concat(data.message);
      return { state };

    case "route":
      state.shared.path = data.path;
      state.shared.location = data.location;
      state.route = data.route;
      const { state: pageState, command: pageCommand } = data.route.Component.init(state.shared);
      state.page = pageState;
      const command = mapCommand("pageMessage", pageCommand);
      return { state, command };

    case "pageMessage":
      return updateChild({
        key: "page",
        parentMessage: "pageMessage",
        parentState: state,
        sharedState: state.shared,
        childUpdate: state.route.Component.update,
        childMessage: data.message,
        childData: data.data
      });

    default:
      return { state };
  }
}

export function view ({ state, dispatch }) {
  return (
    <div>
      <header>
        {state.shared.path}
        <br />
        {JSON.stringify(state.shared.location)}
      </header>
      <section>
        <state.route.Component.view state={state.page} shared={state.shared} dispatch={mapDispatch("pageMessage", dispatch)} />
      </section>
    </div>
  );
}
