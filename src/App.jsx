import './App.css';
import TodoList from './features/TodoList/TodoList'
import TodoForm from './features/TodoForm';
import { useState } from 'react';

function App() {
  const [todoList, setTodoList] = useState([]);

  // create a handler function
  const addTodo = (title) => {
    const newTodo = { title: title, id: Date.now(), isCompleted: false}; 
    setTodoList([...todoList, newTodo]);
  }

  // helper function completeTodo
  const completeTodo = (id) => {
    // map thru todolist
    const updatedTodos = todoList.map((todo) => {
      if(todo.id === id) {
        return {...todo, isCompleted: true};
      }
      return todo;
    });

    // updated todoList state with updatedTodos
    setTodoList(updatedTodos);
  }

  return (
    <div>
      <h1>My Todos</h1>
      <TodoForm onAddTodo={addTodo}/>
      <TodoList todoList={todoList} onCompleteTodo={completeTodo}/>
    </div>
  );
}

export default App
