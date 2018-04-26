"use strict";

import React from "react";
import PropTypes from "prop-types";
import dispatchCommand from "../command/dispatch";

export const init = () => ({
  state: null,
  command: dispatchCommand("@setTitle", { title: "Websocket Log" })
});

export const subscriptions = () => [];

export const update = ({ state }) => state;

const reverseClone = arr => arr.reduce((newArr, a) => [a].concat(newArr), []);

const formatTime = timestamp => (new Date(timestamp)).toString();

const viewLogItem = ({ index, timestamp, message }) => (
  <li className="websocket-log-item" style={{ marginBottom: "10px" }} key={index}>
    {message}
    <br />
    <span style={{ color: "#888", fontSize: "0.9em" }}>
      {formatTime(timestamp)}
    </span>
  </li>
);

export const view = ({ shared }) => {
  return (
    <div className="websocket-log">
      <h2>Websocket log</h2>
      <ul>
        {reverseClone(shared.websocketLog).map(({ timestamp, message }, index) => viewLogItem({ timestamp, message, index }))}
      </ul>
    </div>
  );
};
