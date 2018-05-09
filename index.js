"use strict";

import { noop, isEqual, differenceWith, get } from "lodash";

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

function loop ({ store, element, render, view, subscriptions }) {
  const manageSubscriptions = makeSubscriptionManager(subscriptions);
  const tick = ({ state, command = noop }) => {
    command(dispatch);
    render({ view, element, state, dispatch });
    manageSubscriptions({ state, dispatch });
  };
  store.subscribe(tick);
  tick();
}

export default function program ({ Component = {}, selector = "body", options = {} }) {
  const { init, subscriptions, update, view } = Component;
  const { createStore, render } = options;
  const store = createStore({ init, update });
  const element = document.querySelector(selector);
  loop({ store, element, render, view, subscriptions });
}
