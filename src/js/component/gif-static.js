"use strict";

import { defaults } from "lodash";
import React from "react";
import PropTypes from "prop-types";
import * as GifPermalink from "./gif-permalink";
import dispatchCommand from "../command/dispatch";
import httpCommand from "../command/http";
import websocketSubscription from "../subscription/websocket";
import batchCommands from "../util/batch-commands";

export const init = (options = {}) => {
  const {
    uid = "",
    id = "",
    imageUrl = "https://media.giphy.com/media/3oEjI6SIIHBdRxXI40/giphy.gif",
    likes = 0,
    statusMessage = "loading",
    bucketId = "",
    showPermalinkButton = false
  } = options;
  return {
    state: {
      statusMessage,
      uid,
      id,
      imageUrl,
      likes,
      bucketId,
      showPermalinkButton
    }
  };
};

export const subscriptions = ({ shared, state }) => {
  if (state.uid) return [ websocketSubscription(`like:${state.uid}`, "receiveLike") ];
  else return [];
};

export const update = ({ shared, state, message, data }) => {
  switch (message) {
    case "like":
      return {
        state,
        command: httpCommand({
          method: "POST",
          url: `http://localhost:3001/like/${state.uid}`,
          headers: { "x-bucket-id": state.bucketId },
          successMessage: "onLikeSuccess",
          failureMessage: "onLikeFailure"
        })
      };

    case "onLikeSuccess":
      state.likes = data.body.likes;
      return { state };

    case "onLikeFailure":
      return { state };

    case "receiveLike":
      let command;
      if (state.likes < data.body.likes) {
        command = batchCommands(
          dispatchCommand("@appendToWebsocketLog", { message: `Received new like for Gif, UID: ${state.uid}` }),
          dispatchCommand("onLikeSuccess", data)
        );
      }
      return { state, command };

    default:
      return { state };
  }
};

const viewMetadata = ({ state }) => {
  if (state.statusMessage === "complete")
    return (
      <ul className="gif-metadata">
        <li>Status: {state.statusMessage}</li>
        <li>ID: {state.id}</li>
        <li>Likes: {state.likes}</li>
      </ul>
    );
  else
    return (
      <ul className="gif-metadata">
        <li>Status: {state.statusMessage}</li>
      </ul>
    );
};

const viewButtons = ({ state, dispatch }) => {
  if (state.statusMessage === "complete") {
    const like = () => dispatch("like");
    const navigate = () => dispatch("@navigate", {
      Component: GifPermalink,
      initArgs: [{
        id: state.id,
        bucketId: state.bucketId
      }]
    });
    return (
      <div className="gif-buttons">
        <button onClick={like}>Like</button>
        {state.showPermalinkButton ? (<button onClick={navigate}>Permalink</button>) : undefined}
      </div>
    );
  }
};

export const view = ({ state, shared, dispatch }) => {
  return (
    <div className="gif">
      <img src={state.imageUrl} style={{ width: "300px" }}/>
      {viewMetadata({ state })}
      {viewButtons({ state, dispatch })}
    </div>
  );
};
