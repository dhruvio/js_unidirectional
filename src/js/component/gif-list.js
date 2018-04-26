"use strict";

import React from "react";
import PropTypes from "prop-types";
import { find, assign, flatMap } from "lodash";
import * as GifStatic from "./gif-static";
import mapIndexedDispatch from "../util/map-indexed-dispatch";
import mapIndexedCommand from "../util/map-indexed-command";
import mapIndexedSubscriptions from "../util/map-indexed-subscriptions";
import updateIndexedChild from "../util/update-indexed-child";
import batchCommands from "../util/batch-commands";
import httpCommand from "../command/http";
import websocketSubscription from "../subscription/websocket";
import dispatchCommand from "../command/dispatch";

const getAllGifs = bucketId => httpCommand({
  method: "GET",
  url: "http://localhost:3001/gif",
  headers: { "x-bucket-id": bucketId },
  successMessage: "onGetAllGifsSuccess",
  failureMessage: "onGetAllGifsFailure"
});

const getNewGif = (bucketId, category) => httpCommand({
  method: "POST",
  url: `http://localhost:3001/gif/${category}`,
  headers: { "x-bucket-id": bucketId },
  successMessage: "onGetNewGifSuccess",
  failureMessage: "onGetNewGifFailure"
});

const INIT_BUCKET_ID = "dogs";

export const init = () => ({
  state: {
    loadingStatus: "loading",
    bucketId: {
      input: INIT_BUCKET_ID,
      value: INIT_BUCKET_ID
    },
    categoryInput: "dog",
    gifs: []
  },
  command: batchCommands(
    dispatchCommand("@setTitle", { title: "List of Gifs" }),
    getAllGifs(INIT_BUCKET_ID)
  )
});

export const subscriptions = ({ shared, state }) => {
  const { gifs } = state;
  const mappedSubs = flatMap(gifs, (gif, index) => mapIndexedSubscriptions("updateGif", index, GifStatic.subscriptions({ shared, state: gif })));
  const newGifSub = websocketSubscription("newGif", "receiveNewGif");
  return mappedSubs.concat(newGifSub);
};

export const update = ({ shared, state, message, data }) => {
  switch (message) {
    case "onInputBucketId":
      state.bucketId.input = data.input;
      return { state };

    case "changeBucketId":
      state.loadingStatus = "loading";
      state.bucketId.value = state.bucketId.input;
      return {
        state,
        command: getAllGifs(state.bucketId.value)
      };

    case "onInputCategory":
      state.categoryInput = data.input;
      return { state };

    case "addGif":
      state.loadingStatus = "loading";
      return {
        state,
        command: getNewGif(state.bucketId.value, state.categoryInput)
      };

    case "updateGif":
      return updateIndexedChild({
        key: "gifs",
        index: data.index,
        parentState: state,
        parentMessage: "updateGif",
        sharedState: shared,
        childUpdate: GifStatic.update,
        childMessage: data.message,
        childData: data.data
      });

    case "onGetAllGifsSuccess":
      state.loadingStatus = "complete";
      const result = data.body.map(
        gif => GifStatic.init({
          uid: gif.uid,
          id: gif.id,
          imageUrl: gif.imageUrl,
          likes: gif.likes,
          statusMessage: "complete",
          bucketId: state.bucketId.value,
          showPermalinkButton: true
        })
      );
      state.gifs = result.map(({ state }) => state);
      return { state };

    case "onGetAllGifsFailure":
      state.loadingStatus = "error";
      return { state };

    case "onGetNewGifSuccess":
      state.loadingStatus = "complete";
      const gifDoesNotExist = !find(state.gifs, { uid: data.body.uid });
      if (gifDoesNotExist) {
        const { state: gifState } = GifStatic.init({
          uid: data.body.uid,
          id: data.body.id,
          imageUrl: data.body.imageUrl,
          likes: data.body.likes,
          statusMessage: "complete",
          bucketId: state.bucketId.value,
          showPermalinkButton: true
        });
        state.gifs.push(gifState);
      }
      return { state };

    case "onGetNewGifFailure":
      state.loadingStatus = "complete";
      const { state: errorGifState } = GifStatic.init({
        //grandma dentures gif
        imageUrl: "https://media.giphy.com/media/l4KibWpBGWchSqCRy/giphy.gif",
        statusMessage: "error"
      });
      state.gifs.push(errorGifState);
      return { state };

    case "receiveNewGif":
      const gifDoesNotExist_ = !find(state.gifs, { uid: data.body.uid });
      let command;
      if (gifDoesNotExist_) {
        command = batchCommands(
          dispatchCommand("@appendToWebsocketLog", { message: `Received new Gif, UID: ${data.body.uid}` }),
          dispatchCommand("onGetNewGifSuccess", data)
        );
      }
      return { state, command };

    default:
      return { state };
  }
};

const viewGifs = ({ shared, gifs, dispatch }) => {
  const children= gifs.reduce(
    (views, gif, index) => {
      //reverse the UI of gifs so the newest one is at the top
      views.unshift(
        <div key={index} className="gif-list-child" style={{ marginTop: "40px" }}>
        <GifStatic.view shared={shared} state={gif} dispatch={mapIndexedDispatch("updateGif", index, dispatch)} />
        </div>
      );
      return views;
    },
    []
  );
  return (
    <div className="gif-list-children">
      {children}
    </div>
  );
};

export const view = ({ state, shared, dispatch }) => {
  const onInputBucketId = e => dispatch("onInputBucketId", { input: e.target.value });
  const onInputCategory = e => dispatch("onInputCategory", { input: e.target.value });
  const changeBucketId = e => e.preventDefault() || dispatch("changeBucketId");
  const addGif = e => e.preventDefault() || dispatch("addGif");
  return (
    <div className="gif-list">
      <h2>Gif List</h2>
      <ul className="gif-list-metadata">
        <li>Loading status: {state.loadingStatus}</li>
        <li>Bucket ID: {state.bucketId.value}</li>
        <li>Category: {state.categoryInput}</li>
      </ul>
      <form className="gif-list-bucket-id" onSubmit={changeBucketId}>
        <input value={state.bucketId.input} placeholder="Bucket ID" onChange={onInputBucketId} />
        <button onClick={changeBucketId}>Change Bucket ID</button>
      </form>
      <form className="gif-list-add" onSubmit={addGif}>
        <input value={state.categoryInput} placeholder="Category" onChange={onInputCategory} />
        <button onClick={addGif}>Add Gif</button>
      </form>
      {viewGifs({
        shared,
        gifs: state.gifs,
        dispatch
      })}
    </div>
  );
};
