"use strict";

import { isFunction } from "lodash";
import mapIndexedDispatch from "./map-indexed-dispatch";

export default (parentMessage, index, command) => dispatch => isFunction(command) && command(mapIndexedDispatch(parentMessage, index, dispatch));
