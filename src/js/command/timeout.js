"use strict";

export default (duration, message, data) => dispatch => setTimeout(() => dispatch(message, data), duration);
