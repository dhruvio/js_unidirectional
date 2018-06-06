## Required

0. Create separate `render` driver that uses `ReactDOMServer.renderToString()`.
1. Create separate `create-store` driver that seeds the Redux store with an object.
2. Upgrade the `program` and `programWithRoutes` functions to return an object that exposes the following functions:
  - `getState`
    - Returns the program's state at a given time.
  - `getRendered`
    - Returns the result of the `render` driver at a given time.
    - e.g. Returns a string when rendering on the server-side.
3. Update the `grunt` tasks to support running arbitrary `express` servers on a per-example basis.
4. Create an example application that uses server-side rendering with React.
  - The logic for hydration would be the following:
    0. User makes GET request to a path (e.g. `/post/123`).
    1. Back-end server responds to the request with an HTML document. This document contains:
      - The React container element rendered with static HTML.
      - The container element has a `data-seed=<JSON>` property that hydrates the program's state.
    2. The client-side JavaScript runs the program and seeds its initial state.
      - The seed is the parsed JSON value provided by the `data-seed` HTML attribute on the container element.
      - The `render` and `create-store` drivers 
    3. The client-side continues to execute normally.


## Possible requirements

- Create a `router` driver for client and server applications.
  - Need to determine router path on the server-side.

