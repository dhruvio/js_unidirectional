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
      <a onClick={goHome}>
        404 Not Found
      </a>
    </div>
  );
}
