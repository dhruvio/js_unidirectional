"use strict";

import React from "react";

export const init = ({ shared, params }) => ({
  state: `Hello, ${params[0] || "World"}`
});

export const subscriptions = () => [];

export const update = ({ state }) => state;

export const view = ({ state }) => {
  return (
    <div>
      <h2>{state}</h2>
    </div>
  );
};
