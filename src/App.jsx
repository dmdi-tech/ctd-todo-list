import './App.css';
import TodoList from './features/TodoList/TodoList'
import TodoForm from './features/TodoForm';
import TodoViewForm from './features/TodoViewForm';
import { useEffect, useState, useCallback, useReducer } from 'react';
import styles from './App.module.css';

// reducer imports
import {
  reducer as todosReducer,
  actions as todoActions,
  initialState as initialTodosState,
} from './reducers/todos.reducer';


const url = `https://api.airtable.com/v0/${import.meta.env.VITE_BASE_ID}/${import.meta.env.VITE_TABLE_NAME}`;

function App() {
  // const [todoList, setTodoList] = useState([]);
  // const [isLoading, setIsLoading] = useState(false);
  // const [errorMessage, setErrorMessage] = useState(''); // fixed to include hook
  // const [isSaving, setIsSaving] = useState(false);

  const [sortField, setSortField] = useState("createdTime");
  const [sortDirection, setSortDirection] = useState("desc");

  const [queryString, setQueryString] = useState('');

  const [todoState, dispatch] = useReducer(todosReducer, initialTodosState);

  const encodeUrl = useCallback(() => {
    // template literal that combines the 2 sort query parameters
    let sortQuery = `sort[0][field]=${sortField}&sort[0][direction]=${sortDirection}`;
    let searchQuery = '';

    if(queryString) {
      searchQuery = `&filterByFormula=SEARCH("${queryString}",+title)`;
    }

    return encodeURI(`${url}?${sortQuery}&${searchQuery}`);
  },[sortField, sortDirection, queryString]);

  const token = `Bearer ${import.meta.env.VITE_PAT}`;

  // create a handler function
  const addTodo = async (title) => {
    // const newTodo = { title: title, id: Date.now(), isCompleted: false}; 
    // setTodoList([...todoList, newTodo]);
    dispatch({ type: todoActions.startRequest })
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
      const resp = await fetch(encodeUrl(), options);

      if(!resp.ok) throw new Error(todoState.error);

      const { records } = await resp.json();

      dispatch({ type: todoActions.addTodo, records: records });

    } catch(error) {
      console.log(error.message);
      dispatch({ type: todoActions.setLoadError, error})
    } finally {
      dispatch({ type: todoActions.endRequest })
    }
  }



  // helper function completeTodo
  const completeTodo = async (id) => {
    const originalUpdatedTodos = todoState.todoList.find((todo) => todo.id === id);

    // updated todoList state with updatedTodos
    dispatch({ type: todoActions.completeTodo, id: id });

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
      const resp = await fetch(encodeUrl(), options);

      if(!resp.ok) throw new Error(todoState.error);
      
    } catch(error) {
      dispatch({ type: todoActions.revertTodo, originalTodo: originalUpdatedTodos, error: error });
    }
  }

  const updateTodo = async (editedTodo) => {
    const originalTodo = todoState.todoList.find((todo) => todo.id === editedTodo.id);

    dispatch({ type: todoActions.updateTodo, editedTodo: editedTodo });

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
      const resp = await fetch(encodeUrl(), options);

      if(!resp.ok) throw new Error(todoState.error);

    } catch(error) {
      dispatch({ type: todoActions.revertTodo, originalTodo: originalTodo, error: error  });
    }
  };

  useEffect(() => {
    const fetchTodos = async () => {
      dispatch({ type: todoActions.fetchTodos })

      const options = {
        method: 'GET',
        headers: {
          Authorization: token,
        }
      }

      try {
        const resp = await fetch(encodeUrl(), options);

        if(!resp.ok) {
          throw new Error(todoState.error);
        }

        const response = await resp.json();

        dispatch({ type: todoActions.loadTodos, records: response.records })
      
      } catch(error) {
        dispatch({ type: todoActions.setLoadError, error});
      }
    };
      fetchTodos();
  }, [sortDirection, sortField, queryString]);



  return (
    <div className={styles.container}>
      <h1 className={styles.title}>My Todos</h1>
      <TodoForm onAddTodo={addTodo} isSaving={todoState.isSaving}/>
      <TodoList 
        todoList={todoState.todoList} 
        onCompleteTodo={completeTodo} 
        onUpdateTodo={updateTodo} 
        isLoading={todoState.isLoading}
      />

      {/* <hr></hr> */}

      <TodoViewForm 
        sortDirection={sortDirection}
        setSortDirection={setSortDirection}
        sortField={sortField}
        setSortField={setSortField}
        queryString={queryString}
        setQueryString={setQueryString}
      />

      {todoState.error && (
        <div className={styles.error}>
          <hr />
          <p>{todoState.error}</p>
          <button onClick={() => dispatch({ type: todoActions.clearError })}>Dismiss</button>
        </div>
      )}
    </div>
  );
}

export default App
