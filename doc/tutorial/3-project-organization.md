# 3 Project Organization

## 3.0 Course Outline

### 3.0.1 Syllabus

0. Introduction to React and unidirectional state management
1. Asynchronous side-effects and state management
2. **Project organization and top-level components**
3. Client-side routing
4. Testing and quality management

### 3.0.2 Learning outcomes

- Explain the role of React in front-end applications.
- Explain the role of unidirectional state management in front-end applications.
- **Utilize type signatures to describe the functions the make up a unidirectional front-end application.**
- Incorporate side-effecting, asynchronous behaviour into a unidirectional front-end application in a type-safe way.
- **Explain the role of a Root component.**
- **Describe how state access and mutation can be shared across a component tree.**
- Incorporate client-side routing into a unidirectional front-end application.
- Define the differences in component "types" in unidirectional front-end applications that implement client-side routing.
- Understand the role of static analyzers in managing the quality of JavaScript applications.
- Implement a front-end application employing unidirectional state management utilizing React and Redux.
- Write property tests for the components of a unidirectional front-end application.

### 3.0.3 Resources

- The Elm Architecture
  - Tutorial documentation: https://guide.elm-lang.org/architecture/
  - Tutorial examples: https://github.com/evancz/elm-architecture-tutorial
- React
  - Quick start: https://reactjs.org/docs/hello-world.html
  - API reference: https://reactjs.org/docs/react-api.html
- Redux
  - Guide: https://redux.js.org/
  - API reference: https://redux.js.org/api-reference

## 3.1 Definitions

### 3.1.1 The Root Component

A *Root* component is the root node of our unidirectional front-end application's component tree. It plays the most significant role of all components in an application's architecture.

In this example, we will define a Root component that introduces three new pieces of functionality:

0. Define a view layout, which includes a content area to view an active "page" component.
1. Define a shared section of state that can be read by components' `subscriptions`, `update` and `view` functions.
2. Define a set of messages in the Root component's `update` function that can be dispatched from anywhere in the component tree.

The Elm Architecture does not specify how a Root component should be constructed. This example demonstrates one possible *application* of a Root component using The Elm Architecture.

### 3.1.2 Component type signatures

To achieve the above-mentioned functionality, we will be modifying the type signatures of our components:

```elm
type alias RootComponent msg model =
  { init : a -> ( model, Cmd msg )
  , subscriptions : model -> Sub msg
  , update : model -> msg -> ( model, Cmd msg )
  , view : model -> Html msg 
  }

type alias NonRootComponent childMsg childModel sharedMsg sharedModel =
  { init : a -> ( childModel, Cmd (Either childMsg sharedMsg) )
  , subscriptions : sharedModel -> childModel -> Sub (Either childMsg sharedMsg)
  , update : sharedModel -> childModel -> childMsg -> ( childModel, Cmd (Either childMsg sharedMsg) )
  , view : sharedModel -> childModel -> Html (Either childMsg sharedMsg)
  }
```

## 3.2 Code Review

```bash
git clone https://github.com/dhruvio/js_react-elm-example.git
cd js_react-elm-example/src/js/lesson/3
```
