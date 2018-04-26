"use strict";

import { assign } from "lodash";
import mapDispatch from "./map-dispatch";
import serializeSubscriptionId from "./serialize-subscription-id";

export default (parentMessage, childSubs) => {
  return childSubs.map(({ id, start }) => ({
    id: serializeSubscriptionId(id, parentMessage),
    start: dispatch => start(mapDispatch(parentMessage, dispatch))
  }));
};
