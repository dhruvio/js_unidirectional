"use strict";

export default path => dispatch => {
  window.history.replaceState(null, "", path);
  window.dispatchEvent(new Event("unidirectional:route"));
};
