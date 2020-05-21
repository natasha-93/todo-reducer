import React, { useState, useReducer } from "react";
import { v4 as uuid } from "uuid";

type Todo = {
  id: string;
  text: string;
  isCompleted: boolean;
};

type TodosState = {
  todos: Todo[];
  newTodoText: string;
};

type TodosAction =
  | { type: "ADD_TODO" }
  | { type: "TOGGLE_TODO"; payload: string }
  | { type: "EDIT_TODO"; payload: { id: string; text: string } }
  | { type: "DELETE_TODO"; payload: string }
  | { type: "EDIT_NEW_TODO"; payload: string };

function reducer(state: TodosState, action: TodosAction): TodosState {
  switch (action.type) {
    case "ADD_TODO":
      return {
        newTodoText: "",
        todos: [
          ...state.todos,
          {
            id: uuid(),
            text: state.newTodoText,
            isCompleted: false,
          },
        ],
      };
    default:
      return state;
    case "EDIT_TODO":
      return {
        ...state,
        todos: state.todos.map((todo) =>
          todo.id === action.payload.id
            ? { ...todo, text: action.payload.text }
            : todo
        ),
      };
    case "EDIT_NEW_TODO": {
      return {
        ...state,
        newTodoText: action.payload,
      };
    }
    case "DELETE_TODO":
      return {
        ...state,
        todos: state.todos.filter((todo) => todo.id !== action.payload),
      };
    case "TOGGLE_TODO":
      return {
        ...state,
        todos: state.todos.map((todo) =>
          todo.id === action.payload
            ? { ...todo, isCompleted: !todo.isCompleted }
            : todo
        ),
      };
  }
}

function App() {
  const [{ todos, newTodoText }, dispatch] = useReducer(reducer, {
    newTodoText: "",
    todos: [],
  });

  return (
    <div>
      <p>Todo List</p>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          dispatch({ type: "ADD_TODO" });
        }}
      >
        <input
          placeholder="Enter todo..."
          value={newTodoText}
          onChange={(e) =>
            dispatch({ type: "EDIT_NEW_TODO", payload: e.target.value })
          }
        />
        <button>Add Todo</button>
      </form>
      <ul>
        {todos.map((todo) => (
          <li key={todo.id}>
            <input
              type="checkbox"
              onClick={() => {
                dispatch({ type: "TOGGLE_TODO", payload: todo.id });
              }}
            />
            <input
              value={todo.text}
              onChange={(e) => {
                dispatch({
                  type: "EDIT_TODO",
                  payload: { id: todo.id, text: e.target.value },
                });
              }}
              style={{
                border: "none",
                textDecoration: todo.isCompleted ? "line-through" : "none",
              }}
            />
            <button
              onClick={(e) =>
                dispatch({ type: "DELETE_TODO", payload: todo.id })
              }
            >
              X
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
