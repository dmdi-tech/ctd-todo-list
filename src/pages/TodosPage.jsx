import TodoList from '../features/TodoList/TodoList'
import TodoForm from '../features/TodoForm';
import TodoViewForm from '../features/TodoViewForm';


function TodosPage({ 
    onAddTodo, 
    isSaving, 
    todoList, 
    onCompleteTodo, 
    onUpdateTodo, 
    isLoading, 
    sortDirection, 
    setSortDirection, 
    sortField, 
    setSortField, 
    queryString, 
    setQueryString }) {
    return (
        <div>
            <TodoForm onAddTodo={onAddTodo} isSaving={isSaving}/>
            <TodoList 
                todoList={todoList} 
                onCompleteTodo={onCompleteTodo} 
                onUpdateTodo={onUpdateTodo} 
                isLoading={isLoading}
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
        </div>
    )
}

export default TodosPage