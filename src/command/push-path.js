"use strict";

export default path => dispatch => {
  window.history.pushState(null, "", path);
  window.dispatchEvent(new Event("unidirectional:route"));
};
