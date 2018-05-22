"use strict";

import React from "react";

export function init (shared) {
  return {
    state: {}
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
