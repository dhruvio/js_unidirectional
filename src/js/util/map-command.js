"use strict";

import { isFunction } from "lodash";
import mapDispatch from "./map-dispatch";

export default (parentMessage, command) => dispatch => isFunction(command) && command(mapDispatch(parentMessage, dispatch));
