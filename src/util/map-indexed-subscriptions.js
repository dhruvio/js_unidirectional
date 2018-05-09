"use strict";

import { defaults } from "lodash";
import mapIndexedDispatch from "./map-indexed-dispatch";
import serializeSubscriptionId from "./serialize-subscription-id";

export default (parentMessage, index, childSubs) => {
  return childSubs.map(({ id, start }) => ({
    id: serializeSubscriptionId(id, `${parentMessage}.${index}`),
    start: dispatch => start(mapIndexedDispatch(parentMessage, index, dispatch))
  }));
};
