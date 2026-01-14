import './App.css';
import TodoList from './features/TodoList/TodoList'
import TodoForm from './features/TodoForm';
import { useEffect, useState } from 'react';

function App() {
  const [todoList, setTodoList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = ('');
  const [isSaving, setIsSaving] = useState(false);

  const url = `https://api.airtable.com/v0/${import.meta.env.VITE_BASE_ID}/${import.meta.env.VITE_TABLE_NAME}`;
  const token = `Bearer ${import.meta.env.VITE_PAT}`;

  // create a handler function
  const addTodo = async (title) => {
    // const newTodo = { title: title, id: Date.now(), isCompleted: false}; 
    // setTodoList([...todoList, newTodo]);
    const payload = {
      records: [ 
        {
          fields: {
            title: title,
            isCompleted: false,
          }
        } 
      ]
    };

    const options = {
      method: 'POST',
      headers: {
        Authorization: token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    };

    try {
      setIsSaving(true);
      const resp = await fetch(url, options);

      if(!resp.ok) throw new Error(resp.message);

      const { records } = await resp.json();

      const savedTodo = {id:records[0].id, title: records[0].fields.title, isCompleted: true};

      if (!records[0].fields.isCompleted) {
        savedTodo.isCompleted = false;
      }

      setTodoList([...todoList, savedTodo]);
    } catch(error) {
      console.log(error.message);
      setErrorMessage(error.message);
    } finally {
      setIsSaving(false);
    }
  }



  // helper function completeTodo
  const completeTodo = async (id) => {
    const updatedTodos = todoList.map((todo) => {
      if(todo.id === id) {
        return {...todo, isCompleted: true};
      }
      return todo;
    });

    // updated todoList state with updatedTodos
    setTodoList(updatedTodos);

    const originalUpdatedTodos = todoList.find((todo) => todo.id === id);

    const payload = {
        records: [
            {
                id: originalUpdatedTodos.id,
                fields: {
                    title: originalUpdatedTodos.title,
                    isCompleted: true,
                },
            },
        ],
    };
    
    const options = {
      method: 'PATCH',
      headers: {
        Authorization: token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    };

    try {
      setIsSaving(true);

      const resp = await fetch(url, options);

      if(!resp.ok) throw new Error(resp.message);
      
    } catch(error) {
      console.log(error.message);

      setErrorMessage(`${error.message}. Reverting completing todos....`);

      const revertedTodos = originalUpdatedTodos.map((todo) => {
        if(todo.id === originalUpdatedTodos.id) {
          return originalUpdatedTodos;
        }
      });

      setTodoList(revertedTodos);
    } finally {
      setIsSaving(false);
    }
  }

  const updateTodo = async (editedTodo) => {
    const updatedTodos = todoList.map((todo) => {
      if (todo.id == editedTodo.id) {
        return {...editedTodo}; // changed it to return the whole editedTodo
      }
      return todo;
    });

    setTodoList(updatedTodos);

    const originalTodo = todoList.find((todo) => todo.id === editedTodo.id);

    const payload = {
        records: [
            {
                id: editedTodo.id,
                fields: {
                    title: editedTodo.title,
                    isCompleted: editedTodo.isCompleted,
                },
            },
        ],
    };

    const options = {
      method: 'PATCH',
      headers: {
        Authorization: token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    };

    try {
      setIsSaving(true);

      const resp = await fetch(url, options);

      if(!resp.ok) throw new Error(resp.message);

    } catch(error) {
      console.log(error.message);

      setErrorMessage(`${error.message}. Reverting todo....`);
      
      const revertedTodos = originalTodo.map((todo) => {
        if(todo.id === originalTodo.id) {
          return originalTodo;
        }
      });
      
      setTodoList([...revertedTodos]);
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    const fetchTodos = async () => {
      setIsLoading(true);

      const options = {
        method: 'GET',
        headers: {
          Authorization: token,
        }
      }

      try {
        const resp = await fetch(url, options);

        if(!resp.ok) {
          throw new Error(resp.message);
        }

        const response = await resp.json();

        const todos = response.records.map((record) =>{
          const todo = {
            title: record.fields.title,
            id: record.id,
            isCompleted: false,
          };

          if(todo.isCompleted){
            todo.isCompleted = false;
          }

          return todo;
        });

        setTodoList(todos);
      } catch(error) {
        setErrorMessage(error.message);
      } finally {
        setIsLoading(false);
      }
    };
      fetchTodos();
  }, []);



  return (
    <div>
      <h1>My Todos</h1>
      <TodoForm onAddTodo={addTodo} isSaving={isSaving}/>
      <TodoList 
        todoList={todoList} 
        onCompleteTodo={completeTodo} 
        onUpdateTodo={updateTodo} 
        isLoading={isLoading}
      />

      {errorMessage && (
        <div>
          <hr />
          <p>{errorMessage}</p>
          <button onClick={() => setErrorMessage("")}>Dismiss</button>
        </div>
      )}
    </div>
  );
}

export default App
