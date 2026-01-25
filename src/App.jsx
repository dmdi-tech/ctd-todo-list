import './App.css';
import TodoList from './features/TodoList/TodoList'
import TodoForm from './features/TodoForm';
import TodoViewForm from './features/TodoViewForm';
import { useEffect, useState } from 'react';

const url = `https://api.airtable.com/v0/${import.meta.env.VITE_BASE_ID}/${import.meta.env.VITE_TABLE_NAME}`;

const encodeUrl = ({ sortField, sortDirection, queryString }) => {
  // template literal that combines the 2 sort query parameters
  let sortQuery = `sort[0][field]=${sortField}&sort[0][direction]=${sortDirection}`;
  let searchQuery = '';

  if(queryString) {
    searchQuery = `&filterByFormula=SEARCH("${queryString}",+title)`;
  }

  return encodeURI(`${url}?${sortQuery}&${searchQuery}`);
};

function App() {
  const [todoList, setTodoList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(''); // fixed to include hook
  const [isSaving, setIsSaving] = useState(false);

  const [sortField, setSortField] = useState("createdTime");
  const [sortDirection, setSortDirection] = useState("desc");

  const [queryString, setQueryString] = useState('');

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
      const resp = await fetch(encodeUrl({ sortDirection, sortField, queryString }), options);

      if(!resp.ok) throw new Error(errorMessage);

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

    const originalUpdatedTodos = todoList.find((todo) => todo.id === id);

    // updated todoList state with updatedTodos
    setTodoList(updatedTodos);

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

      const resp = await fetch(encodeUrl({ sortDirection, sortField, queryString }), options);

      if(!resp.ok) throw new Error(errorMessage);
      
    } catch(error) {
      console.log(error.message);

      setErrorMessage(`${error.message}. Reverting completing todos....`);

      const revertedTodos = todoList.map((todo) => {
        todo.id === originalUpdatedTodos.id ? originalUpdatedTodos : todo
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

    const originalTodo = todoList.find((todo) => todo.id === editedTodo.id);

    setTodoList(updatedTodos);

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

      const resp = await fetch(encodeUrl({ sortDirection, sortField, queryString }), options);

      if(!resp.ok) throw new Error(errorMessage);

    } catch(error) {
      console.log(error.message);

      setErrorMessage(`${error.message}. Reverting todo....`);
      
      const revertedTodos = todoList.map((todo) =>
        todo.id === originalTodo.id ? originalTodo : todo        
      );

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
        const resp = await fetch(encodeUrl({ sortDirection, sortField, queryString }), options);

        if(!resp.ok) {
          throw new Error(errorMessage);
        }

        const response = await resp.json();

        const todos = response.records.map((record) =>{
          const todo = {
            title: record.fields.title,
            id: record.id,
            isCompleted: record.fields.isCompleted ?? false,
          };

          if(!todo.isCompleted){
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
  }, [sortDirection, sortField, queryString]);



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

      <hr></hr>

      <TodoViewForm 
        sortDirection={sortDirection}
        setSortDirection={setSortDirection}
        sortField={sortField}
        setSortField={setSortField}
        queryString={queryString}
        setQueryString={setQueryString}
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
