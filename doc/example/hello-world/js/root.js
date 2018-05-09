"use strict";

import React from "react";

export function init () {
  return {
    state: {
      text: "Hello, World!"
    }
  };
}

export function subscriptions ({ state }) {
  return [];
}

export function update ({ state, message, data }) {
  return { state };
}

export function view ({ state, dispatch }) {
  return (
    <div>
      {state.text}
    </div>
  );
}
