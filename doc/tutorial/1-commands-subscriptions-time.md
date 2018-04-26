# 1 Commands, Subscriptions and Time

## 1.0 Course Outline

### 1.0.1 Syllabus

0. Introduction to React and unidirectional state management
1. **Asynchronous side-effects and state management**
2. Project organization and top-level components
3. Client-side routing
4. Testing and quality management

### 1.0.2 Learning outcomes

- Explain the role of React in front-end applications.
- Explain the role of unidirectional state management in front-end applications.
- **Utilize type signatures to describe the functions the make up a unidirectional front-end application.**
- **Incorporate side-effecting, asynchronous behaviour into a unidirectional front-end application in a type-safe way.**
- Explain the role of a Root component.
- Describe how state access and mutation can be shared across a component tree.
- Incorporate client-side routing into a unidirectional front-end application.
- Define the differences in component "types" in unidirectional front-end applications that implement client-side routing.
- Understand the role of static analyzers in managing the quality of JavaScript applications.
- Implement a front-end application employing unidirectional state management utilizing React and Redux.
- Write property tests for the components of a unidirectional front-end application.

### 1.0.3 Resources

- The Elm Architecture
  - Tutorial documentation: https://guide.elm-lang.org/architecture/
  - Tutorial examples: https://github.com/evancz/elm-architecture-tutorial
- React
  - Quick start: https://reactjs.org/docs/hello-world.html
  - API reference: https://reactjs.org/docs/react-api.html
- Redux
  - Guide: https://redux.js.org/
  - API reference: https://redux.js.org/api-reference

## 1.1 Definitions

### 1.1.0 The Elm Architecture

In the first lesson, we stated that components have three functions. Components like this are known
to constitue a *simple program* in the Elm architecture:

```elm
-- Component in a simple program
type alias SimpleComponent msg model =
  { init : a -> model
  , update : model -> msg -> model
  , view : model -> Html msg
  }
```

However, components like this do not allow us to incorporate the results of impure, side-effecting
behaviour into our application's state lifecycle. Consequently, we need to expand out component
definition to support *full programs*.

```elm
-- Component in a full program
type alias FullComponent msg model =
  { init : a -> ( model, Cmd msg )
  , subscriptions : model -> Sub msg
  , update : model -> msg -> ( model, Cmd msg )
  , view : model -> Html msg
  }
```

In this lesson, we will upgrade our component examples of counters to support the `FullComponent`
type signature.

### 1.1.1 Commands

The *Command* type (written as `Cmd msg` in Elm) represents a side-effecting action that has the
following properties:

0. It is only intended to be run once.
1. It can result in a message to be run in a component's state lifecycle.

This allows us to perform impure behaviour, but only allow that impure behaviour to affect our
state via our existing `update` function.

Commands are often used to make network requests, query the DOM, set a timeout, etc.

In this lesson, we will implement a `timeout` command that dispatches a message to a component after a given
duration.

### 1.1.2 Subscriptions

The *Subscription* type (written as `Sub msg` in Elm) represents a stream of events that are emitted from
outside the application's state. Each event in the stream results in a message to be run in a component's
state lifecycle.

Subscriptions are often used to manage websocket subscriptions, listen to browser history stack events,
listen to DOM events (e.g. `window.onscroll`), listen to interval timers, etc.

In this lesson, we will implement an `every` subscription that dispatches a message to a component
on a given interval.

## 1.2 Code Review

```bash
git clone https://github.com/dhruvio/js_react-elm-example.git
cd js_react-elm-example/src/js/lesson/1
```
