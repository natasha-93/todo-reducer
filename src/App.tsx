import React, { useReducer } from "react";
import { v4 as uuid } from "uuid";
import styled from "styled-components";

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

const defaultState: TodosState = {
  todos: [
    { id: uuid(), text: "Learn React", isCompleted: false },
    {
      id: uuid(),
      text: "Design tattoo",
      isCompleted: false,
    },
    { id: uuid(), text: "Swim in the pool", isCompleted: false },
  ],
  newTodoText: "",
};

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

const Container = styled.div`
  margin: auto;
  padding: 2rem;
  background-color: #8879a5;
  box-shadow: 3px 3px 24px 4px rgba(0, 0, 0, 0.75);
  border-radius: 2rem;
  border: none;
`;

const TodoItems = styled.ul`
  padding-left: 0;
`;

const TodoItem = styled.li`
  outline: none;
  border: none;
  padding: 0.5rem;
  list-style: none;
`;

const Input = styled.input`
  outline: none;
  border: none;
  border-radius: 1rem;
  padding: 0.2rem 0.5rem;
  margin: 0 0.2rem;
`;

const Button = styled.button`
  padding: 0.2rem 0.5rem;
  outline: none;
  border-radius: 1rem;
`;

const Title = styled.h2`
  color: white;
`;

function App() {
  const [{ todos, newTodoText }, dispatch] = useReducer(reducer, defaultState);

  return (
    <Container>
      <Title>Todo List</Title>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          dispatch({ type: "ADD_TODO" });
        }}
      >
        <Input
          required
          placeholder="Enter todo..."
          value={newTodoText}
          onChange={(e) =>
            dispatch({ type: "EDIT_NEW_TODO", payload: e.target.value })
          }
        />
        <Button>Add Todo</Button>
      </form>
      <TodoItems>
        {todos.map((todo) => (
          <TodoItem key={todo.id}>
            <input
              type="checkbox"
              onClick={() => {
                dispatch({ type: "TOGGLE_TODO", payload: todo.id });
              }}
            />
            <Input
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
            <Button
              onClick={(e) =>
                dispatch({ type: "DELETE_TODO", payload: todo.id })
              }
            >
              X
            </Button>
          </TodoItem>
        ))}
      </TodoItems>
    </Container>
  );
}

export default App;
