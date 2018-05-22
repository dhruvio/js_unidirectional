"use strict";

import { isString } from "lodash";
import objectHash from "object-hash";

export default (...tokens) => tokens.map(token => isString(token) ? token : objectHash(token)).join("/");
