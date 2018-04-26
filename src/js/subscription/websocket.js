"use strict";

import io from "socket.io-client";
import { assign } from "lodash";
import serializeSubscriptionId from "../util/serialize-subscription-id";

const socket = io("http://localhost:3001");
const listeners = {};

const getHandlers = channel => (listeners[channel] = listeners[channel] || []);

const startListeningOnSocket = channel => {
  socket.on(channel, data => {
    const handlers = getHandlers(channel);
    handlers.forEach(handler => handler(data));
  });
};

const stopListeningOnSocket = channel => socket.off(channel);

const on = (channel, handler) => {
  const handlers = getHandlers(channel);
  if (!handlers.length) startListeningOnSocket(channel);
  handlers.push(handler);
};

const off = (channel, handler) => {
  const handlers = getHandlers(channel);
  const beforeLength = handlers.length;
  const index = handlers.indexOf(handler);
  if (index !== -1) handlers.splice(index, 1);
  if (beforeLength > 0 && !handlers.length) stopListeningOnSocket(channel);
};

export default (channel, message, data = {}) => {
  const id = serializeSubscriptionId("websocket", channel, message);
  const start = dispatch => {
    const handler = body => dispatch(message, assign({ body }, data));
    on(channel, handler);
    return () => off(channel, handler);
  };
  return { id, start };
};
