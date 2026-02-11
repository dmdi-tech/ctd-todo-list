const actions = {
    fetchTodos: 'fetchTodos',
    loadTodos: 'loadTodos',
    setLoadError: 'setLoadError',
    startRequest: 'startRequest',
    addTodo: 'addTodo',
    endRequest: 'endRequest',
    updateTodo: 'updateTodo',
    completeTodo: 'completeTodo',
    revertTodo: 'revertTodo',
    clearError: 'clearError',
};

const initialState = {
    todoList: [],
    isLoading: false,
    isSaving: false,
    error: '',
};

const reducer = (state = initialState, action) => {
    switch(action.type) {
        case actions.fetchTodos: {
            return {
                ...state,
                isLoading: true,
            };
        }       
        case actions.loadTodos: {
            const todos = action.records.map((record) =>{
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

            return {
                ...state,
                todoList: todos,
                isLoading: false,
            };
        }
        
        case actions.setLoadError: {
            return {
                ...state,
                errorMessage: action.error.message,
                isLoading: false,
            };
        }

        case actions.startRequest: {
            return {
                ...state,
                isSaving: true,
            };
        }

        case actions.addTodo: {
            const savedTodo = { id: action.records[0].id, title: action.records[0].fields.title, isCompleted: true };
            
            if (!action.records[0].fields.isCompleted) {
                savedTodo.isCompleted = false;
            }

            return {
                ...state,
                todoList: [...state.todoList, savedTodo],
                isSaving: false,
            };
        }

        case actions.endRequest: {
            return {
                ...state,
                isLoading: false,
                isSaving: false,
            };
        }

        case actions.revertTodo: 
        case actions.updateTodo: {
            const updatedTodos = state.todoList.map((todo) => {
                if (todo.id == action.editedTodo.id) {
                    return {...editedTodo}; 
                }
                return todo;
            });

            const updatedState = {
                ...state, 
                todoList: updatedTodos,
                error: action.error ? action.error.message : '',
            }
            
            return updatedState;
        }

        case actions.completeTodo: {
            const updatedTodos = state.todoList.map((todo) => {
                if(todo.id === action.id) {
                    return {...todo, isCompleted: true};
                }
                return todo;
            });

            return {
                ...state,
                todoList: updatedTodos,
            };
        }

        case actions.clearError: {
            return {
                ...state,
                error: '',
            };
        }
        
        default:
            return state;
    }
};


export { initialState, actions, reducer } ;