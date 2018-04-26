"use strict";

import { defaultsDeep, get, set } from "lodash";
import mapCommand from "./map-command";

export default ({ key, parentState, parentMessage, sharedState, childUpdate, childMessage, childData }) => {
  const currentChildState = key ? get(parentState, key) : parentState;
  const { state: newChildState, command: childCommand } = childUpdate({
    shared: sharedState,
    state: currentChildState,
    message: childMessage,
    data: childData
  });
  const newParentStateSubset = key ? set({}, key, newChildState) : newChildState;
  return {
    state: defaultsDeep(newParentStateSubset, parentState),
    command: mapCommand(parentMessage, childCommand)
  };
};

