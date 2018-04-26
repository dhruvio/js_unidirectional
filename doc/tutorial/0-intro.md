# 0 Introduction

## 0.0 Course Outline

### 0.0.1 Syllabus

0. **Introduction to React and unidirectional state management.**
1. Asynchronous side-effects and state management
2. Project organization and top-level components
3. Client-side routing
4. Testing and quality management

### 0.0.2 Learning outcomes

- **Explain the role of React in front-end applications.**
- **Explain the role of unidirectional state management in front-end applications.**
- **Utilize type signatures to describe the functions the make up a unidirectional front-end application.**
- Incorporate side-effecting, asynchronous behaviour into a unidirectional front-end application in a type-safe way.
- Explain the role of a Root component.
- Describe how state access and mutation can be shared across a component tree.
- Incorporate client-side routing into a unidirectional front-end application.
- Define the differences in component "types" in unidirectional front-end applications that implement client-side routing.
- Understand the role of static analyzers in managing the quality of JavaScript applications.
- Implement a front-end application employing unidirectional state management utilizing React and Redux.
- Write property tests for the components of a unidirectional front-end application.

### 0.0.3 Resources

- The Elm Architecture
  - Tutorial documentation: https://guide.elm-lang.org/architecture/
  - Tutorial examples: https://github.com/evancz/elm-architecture-tutorial
- React
  - Quick start: https://reactjs.org/docs/hello-world.html
  - API reference: https://reactjs.org/docs/react-api.html
- Redux
  - Guide: https://redux.js.org/
  - API reference: https://redux.js.org/api-reference

## 0.1 Definitions

### 0.1.0 State

*State* is the data used to create the interactive components of a front-end application. For example, in MVC, this is typically represented by Models and Collections (however, we often store state in Controllers and Views as well).

### 0.1.1 Unidirectional front-end application

*Unidirectional front-end applications* store state in one place (i.e. in one variable). These applications are made up of a component tree. The root component of the tree contains the entire application's state, and is in charge of sharing state "down the tree."

### 0.1.2 The Elm Architecture

*The Elm Architecture* pioneered unidirectional front-end applications. It states that components have five parts:

- Message type and value constructors (`Msg` type, typically an algebraic data type)
- State type (`Model` type, typically a type synonym for a record)
- State initialization function (`init : a -> Model`)
- State update function (`update : Model -> Msg -> Model`)
- View function (`view : Model -> Html Msg`)

In this course, we will implement The Elm Architecture in JavaScript using React and Redux.

### 0.1.3 React

*React* is a view library written by Facebook in JavaScript. When it was originally introduced, front-end applications were predominately implemented utilizing the MVC architecture. Facebook explained that React was only the "V" in "MVC". This meant that an application developer now had the autonomy to define their own state management by moving away from monolithic front-end application frameworks like Ember, Angular and Backbone. Consequently, it became more important for developers to be disciplined when building applications with React, as the risk of bloat and unnecessary coupling is now much higher than using a monolithic framework that defines the rules for you. The extra flexibility that comes with using React is a double-edged sword. 

We will use React's pure, stateless component syntax in this course, which will correspond to The Elm Architecture's `view` function.

### 0.1.4 Redux

*Redux* is a state management library for unidirectional front-end applications. It was directly influenced by The Elm Architecture!

We will use Redux to build functions that correspond to The Elm Architecture's `init` and `update` functions.

## 0.2 Code Review

```bash
git clone https://github.com/dhruvio/js_react-elm-example.git
cd js_react-elm-example/src/js/lesson/0
```
