"use strict";

import { assign } from "lodash";
import serializeSubscriptionId from "../util/serialize-subscription-id";

export default (intervalDuration, message, data = {}) => {
  const id = serializeSubscriptionId("every", intervalDuration, message);
  const start = dispatch => {
    const intervalId = setInterval(
      () => dispatch(
        message,
        assign(
          { time: Date.now() },
          data
        )
      ),
      intervalDuration
    );
    return () => clearInterval(intervalId);
  };
  return { id, start };
};
