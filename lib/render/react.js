"use strict";

export default function renderReact ({ renderDom, createElement }) {
  return ({ view, element, state, dispatch }) => renderDom(
    createElement(view, { state, dispatch }, null),
    element
  );
}
