"use strict";

//polyfills
if (!window.setImmediate) window.setImmediate = window.setTimeout;

import { noop, isEqual, differenceWith, get, find } from "lodash";
import serializeSubscriptionId from "./util/serialize-subscription-id";

function makeSubscriptionManager ({ subscriptions, subscriptionLib }) {
  let activeSubscriptions = [];
  return ({ state, dispatch }) => {
    const componentSubs = subscriptions({ state, lib: subscriptionLib });
    const comparator = (a, b) => isEqual(get(a, "id"), get(b, "id"));
    const subsToBeStopped = differenceWith(activeSubscriptions, componentSubs, comparator);
    const unaffectedSubs = differenceWith(activeSubscriptions, subsToBeStopped, comparator);
    const subsToBeStarted = differenceWith(componentSubs, unaffectedSubs, comparator);
    const startedSubs = subsToBeStarted.map(({ id, start }) => ({ id, stop: start(dispatch) }));
    subsToBeStopped.forEach(({ stop }) => stop());
    activeSubscriptions = unaffectedSubs.concat(startedSubs);
  };
}

function loop ({ store, element, render, view, subscriptions, subscriptionLib }) {
  const { getState, dispatch } = store;
  const manageSubscriptions = makeSubscriptionManager({ subscriptions, subscriptionLib });
  const tick = ({ state, command = noop }) => {
    command(dispatch);
    render({ view, element, state, dispatch });
    manageSubscriptions({ state, dispatch });
  };
  store.subscribe(tick);
  tick(getState());
}

function makeRouter ({ routes = [], pushState = true }) {
  //set up closure state
  let path, location, route;
  const subscribers = [];

  //parse a path string to a route
  const parse = path => find(routes, r => !!path.match(r.pattern));

  //update the closure state
  const setState = ({ path: path_, location: location_, route: route_ }) => {
    path = path_;
    location = location_;
    route = route_;
  };

  //get the closure state
  const getState = () => ({
    path,
    location,
    route,
    params: path && route ? path.match(route.pattern).slice(1) : []
  });

  //refresh state with current information from the browser
  const refreshState = () => {
    const location = rawLocation();
    let path = (pushState ? location.pathname : location.hash).replace(/^[#\/]+/, "/");
    if (path === "") path = "/";
    if (path === getState().path) return; //do nothing if the path has not changed
    const route = parse(path)
    if (!route) return; //do nothing if the path doesn't match any route
    setState({ location, path, route });
  };

  const unsubscribe = fn => {
    const index = subscribers.indexOf(fn);
    subscribers.splice(index, 1);
  };

  //subscribe to route events
  //returns function to unsubscribe
  const subscribe = fn => {
    if (subscribers.indexOf(fn) === -1) {
      subscribers.push(fn);
      return () => unsubscribe(fn);
    } else {
      return noop;
    }
  }

  //get location info from the browser
  const rawLocation = () => ({
    pathname: window.decodeURI(window.location.pathname),
    hash: window.location.hash,
    query: window.location.query,
    origin: window.location.origin
  });

  //start the router
  const start = () => {
    //listen to custom event that indicates route transitions
    window.addEventListener("unidirectional:route", () => {
      refreshState();
      const state = getState();
      subscribers.forEach(fn => fn(state));
    });
    //propagate popstate or hashchange events depending on config
    const changeEvent = pushState ? "popstate" : "hashchange";
    window.addEventListener(changeEvent, () => {
      window.dispatchEvent(new Event("unidirectional:route"));
    });
    //set up initial router state
    refreshState();
  };

  start();

  return { getState, subscribe };
}

function makeRouteSubscription (router) {
  return message => {
    const id = serializeSubscriptionId("unidirectional", "route", message)
    const start = dispatch => {
      return router.subscribe(routerState => {
        dispatch(message, routerState);
      });
    };
    return { id, start };
  };
}

export function program ({ Root = {}, selector = "body", createStore, render, subscriptionLib }) {
  const { init, subscriptions, update, view } = Root;
  const store = createStore({ init, update });
  //element is undefined on the server, or when querySelector is not available
  const element = get(document, "querySelector") && document.querySelector(selector);
  loop({ store, element, render, view, subscriptions, subscriptionLib });
}

export function programWithRoutes ({ Root, selector, createStore, render, subscriptionLib, routes, routeMessage, pushState = true }) {
  const router = makeRouter({ routes, pushState });
  const init = () => Root.init(router.getState());
  const routeSubscription = makeRouteSubscription(router);
  const subscriptions = (options) => Root.subscriptions(options).concat([ routeSubscription(routeMessage) ]);
  program({
    Root: {
      init,
      subscriptions,
      update: Root.update,
      view: Root.view
    },
    selector,
    createStore,
    render,
    subscriptionLib
  });
}

export default {
  program,
  programWithRoutes
};
