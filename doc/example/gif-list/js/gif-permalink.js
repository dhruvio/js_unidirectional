"use strict";

import { defaults } from "lodash";
import React from "react";
import PropTypes from "prop-types";
import * as GifStatic from "./gif-static";
import httpCommand from "src/command/http";
import batchCommands from "src/util/batch-commands";
import dispatchCommand from "src/command/dispatch";
import mapDispatch from "src/util/map-dispatch";
import mapSubscriptions from "src/util/map-subscriptions";
import updateChild from "src/util/update-child";

export const init = ({ shared, params }) => {
  const [bucketId, id] = params;
  return {
    state: GifStatic.init({ bucketId }).state,
    command: batchCommands(
      dispatchCommand("@setTitle", { title: `Permalink for gif: ${id}` }),
      httpCommand({
        method: "GET",
        url: `http://localhost:3001/gif/${id}`,
        headers: { "x-bucket-id": bucketId },
        successMessage: "onGetSuccess",
        failureMessage: "onGetFailure"
      })
    )
  };
};

export const subscriptions = ({ shared, state, lib }) => {
  return mapSubscriptions("gifMessage", GifStatic.subscriptions({ shared, state, lib }));
};

export const update = ({ shared, state, message, data }) => {
  switch (message) {
    case "onGetSuccess":
      return {
        state: GifStatic.init({
          uid: data.body.uid,
          id: data.body.id,
          imageUrl: data.body.imageUrl,
          likes: data.body.likes,
          statusMessage: "complete",
          bucketId: state.bucketId
        }).state
      };

    case "onGetFailure":
      return {
        state: GifStatic.init({
          statusMessage: "error",
          imageUrl: "https://media.giphy.com/media/l4KibWpBGWchSqCRy/giphy.gif"
        }).state
      };

    case "gifMessage":
      return updateChild({
        parentState: state,
        parentMessage: "gifMessage",
        sharedState: shared,
        childUpdate: GifStatic.update,
        childMessage: data.message,
        childData: data.data
      });

    default:
      return { state };
  }
};

export const view = ({ state, shared, dispatch }) => (
  <GifStatic.view shared={shared} state={state} dispatch={mapDispatch("gifMessage", dispatch)} />
);
