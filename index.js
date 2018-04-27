"use strict";

import { noop, isEqual, differenceWith, get } from "lodash";

function createStoreRedux ({ createStore }) {
  function createDispatch ({ store }) {
    return (type, data) => store.dispatch({ type, data });
  }
  function createReducer ({ init, update }) {
    return (reduxState, { type: message, data }) => {
      //initialize state here so the command is run properly
      if (message === "@@redux/INIT" || message === "@@INIT") return init();
      //otherwise pipe through the state machine as normal
      else return update({
        state: get(reduxState, "state"),
        message,
        data
      });
    };
  }
  return ({ init, update }) => {
    const reducer = createReducer({ init, update });
    const reduxStore = createStore(reducer, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());
    return {
      subscribe: fn => store.subscribe(() => fn(store.getState())),
      dispatch: createDispatch({ store: reduxStore })
    };
  };
}

function renderReact ({ render, createElement}) {
  return ({ view, element, state, dispatch }) => render(
    createElement(view, { state, dispatch }, null),
    element
  );
}

function makeSubscriptionManager (subscriptions) {
  let activeSubscriptions = [];
  return ({ state, dispatch }) => {
    const componentSubs = subscriptions(state);
    const comparator = (a, b) => isEqual(get(a, "id"), get(b, "id"));
    const subsToBeStopped = differenceWith(activeSubscriptions, componentSubs, comparator);
    const unaffectedSubs = differenceWith(activeSubscriptions, subsToBeStopped, comparator);
    const subsToBeStarted = differenceWith(componentSubs, unaffectedSubs, comparator);
    const startedSubs = subsToBeStarted.map(({ id, start }) => ({ id, stop: start(dispatch) }));
    subsToBeStopped.forEach(({ stop }) => stop());
    activeSubscriptions = unaffectedSubs.concat(startedSubs);
  };
}

function createTick ({ element, render, subscriptions, view, dispatch }) {
  const manageSubscriptions = makeSubscriptionManager(subscriptions);
  return ({ state, command = noop }) => {
    command(dispatch);
    render({ view, element, state, dispatch });
    manageSubscriptions({ state, dispatch });
  };
}

function loop (options) {
  const tick = createTick(options);
  options.store.subscribe(tick);
  tick();
}

function program ({ Component = {}, selector = "body", options = {} }) {
  const { init, subscriptions, update, view } = Component;
  const { createStore, render } = options;
  const store = createStore({ init, update });
  const element = document.querySelector(selector);
  loop({ store, element, view });
}
