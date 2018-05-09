"use strict";

export default function createStoreRedux ({ createStore }) {
  const createDispatch = ({ store }) => (type, data) => store.dispatch({ type, data });
  const createReducer = ({ init, update }) => {
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
  };
  return ({ init, update }) => {
    const reducer = createReducer({ init, update });
    const reduxStore = createStore(reducer, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());
    return {
      getState: () => reduxStore.getState(),
      subscribe: fn => reduxStore.subscribe(() => fn(reduxStore.getState())),
      dispatch: createDispatch({ store: reduxStore })
    };
  };
}
