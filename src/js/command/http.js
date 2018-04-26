"use strict";

import { assign } from "lodash";
import got from "got";

export default ({ url, method = "GET", body, headers, successMessage, failureMessage, data = {} }) => dispatch => {
  got(url, {
    method,
    headers,
    body,
    json: true
  })
    .then(({ body }) => dispatch(successMessage, assign({ body }, data)))
    .catch(error => dispatch(failureMessage, assign({ body: error }, data)));
};
