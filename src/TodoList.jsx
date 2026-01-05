import TodoListItem from "./TodoListItem";

function TodoList({todoList, onCompleteTodo}) {
    const filteredTodoList = todoList.filter((todo) => !todo.isCompleted);

    return (
        <ul>
            {filteredTodoList.length === 0 ? (
                <p>Add Todo above to get started</p>
            ) : (
                filteredTodoList.map((todo) => (
                //<li key={todo.id}>{todo.title}</li>
                <TodoListItem key={todo.id} todo={todo} onCompleteTodo={onCompleteTodo}/>
            )))}
        </ul>
    );
}

export default TodoList;