"use strict";

import React from "react";

export function init (shared) {
  return {
    state: {
      messages: []
    }
  };
}

export function subscriptions ({ state, shared, lib }) {
  return [ lib.every(1000, "addMessage", { message: `Hello, ${shared.path}` }) ];
}

export function update ({ state, shared, message, data }) {
  switch (message) {
    case "addMessage":
      return {
        state: {
          messages: state.messages.concat(data.message)
        }
      };
    default:
      return { state };
  }
}

export function view ({ state, shared, dispatch }) {
  return (
    <div className="messages">
      {state.messages.map((m, i) => {
        return (
          <div className="message" key={i}>
            {i}: {m}
          </div>
        );
      })}
    </div>
  );
}
