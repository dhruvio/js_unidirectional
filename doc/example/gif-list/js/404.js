"use strict";

import React from "react";
import dispatchCommand from "src/command/dispatch";

export function init (shared) {
  return {
    state: {},
    command: dispatchCommand("@setTitle", { title: "Not Found" })
  };
}

export function subscriptions ({ state, shared, lib }) {
  return [];
}

export function update ({ state, shared, message, data }) {
  return { state };
}

export function view ({ state, shared, dispatch }) {
  const goHome = e => {
    e.preventDefault();
    dispatch("@navigate", { path: "/" });
  };
  return (
    <div>
      <h1>
        404 Not Found
      </h1>
      <a href="#" onClick={goHome}>
        Go Home
      </a>
    </div>
  );
}
