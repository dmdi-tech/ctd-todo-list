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

const reducer = (state= initialState, action) => {
    switch(action.type) {
        case actions.fetchTodos: {
            return {
                ...state,
                isLoading: true,
            };
        }       
        case actions.loadTodos: {
            const todos = actions.records.map((record) =>{
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
            const savedTodo = { id:records[0].id, title: records[0].fields.title, isCompleted: true };
            
            if (!records[0].fields.isCompleted) {
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

        case actions.updateTodo: {
            return {
                ...state,
            };
        }

        case actions.completeTodo: {
            return {
                ...state,
            };
        }

        case actions.revertTodo: {
            return {
                ...state,
            };
        }

        case actions.clearError: {
            return {
                ...state,
            };
        }
    }
};

const initialState = {
    todoList: [],
    isLoading: false,
    isSaving: false,
    error: '',
};




export default { initialState, actions, reducer } ;