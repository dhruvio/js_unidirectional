"use strict";

export default (...commands) => dispatch => commands.forEach(c => c(dispatch));
