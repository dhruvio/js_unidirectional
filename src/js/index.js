"use strict";

//polyfills
window.setImmediate = window.setTimeout;

import { isFunction, isEqual, differenceWith, get } from "lodash";
import React from "react";
import ReactDom from "react-dom";
import { createStore } from "redux";
import * as Root from "./component/root";

//helper to build dispatch function
const storeToDispatch = store => (type, data) => store.dispatch({ type, data });

//helper to build reducer function
const updateToReducer = update => (reduxState, { type: message, data }) => {
  //initialize state here so the command is run properly
  if (message === "@@redux/INIT" || message === "@@INIT") return Root.init();
  //otherwise pipe through the state machine as normal
  else return update({
    state: get(reduxState, "state"),
    message,
    data
  });
}

//helper to propagate render to DOM
const render = (state, dispatch) => ReactDom.render(
  (<Root.view state={state} dispatch={dispatch} />),
  document.getElementById("main")
);

//helper to manage subscription state
let activeSubscriptions = [];
const manageSubscriptions = (state, dispatch) => {
  const componentSubs = Root.subscriptions(state);
  const comparator = (a, b) => isEqual(get(a, "id"), get(b, "id"));
  const subsToBeStopped = differenceWith(activeSubscriptions, componentSubs, comparator);
  const unaffectedSubs = differenceWith(activeSubscriptions, subsToBeStopped, comparator);
  const subsToBeStarted = differenceWith(componentSubs, unaffectedSubs, comparator);
  subsToBeStopped.forEach(({ stop }) => stop());
  activeSubscriptions = unaffectedSubs.concat(
    subsToBeStarted.map(
      ({ id, start }) => ({ id, stop: start(dispatch) })
    )
  );
};

//set up the reducer function
const reducer = updateToReducer(Root.update);
//initialize the store
const store = createStore(
  reducer,
  //support redux devtools
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);
//build root component dispatch function
const dispatch = storeToDispatch(store);

//render the component tree, and
//manage subscriptions
//every state update
const tick = () => {
  const { state, command } = store.getState();
  if (isFunction(command)) command(dispatch);
  render(state, dispatch);
  manageSubscriptions(state, dispatch);
};

//re-render whenever state changes
store.subscribe(tick);

//kick off the state machine
tick();
