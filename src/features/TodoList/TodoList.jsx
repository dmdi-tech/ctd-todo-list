import TodoListItem from "./TodoListItem";

function TodoList({todoList, onCompleteTodo}) {
    const filteredTodoList = todoList.filter((todo) => !todo.isCompleted);
    const numOfTodos = filteredTodoList.length;

    if(numOfTodos == 0) {
        return <p>Add Todo above to get started!</p>
    }

    return (
        <ul>
            {filteredTodoList.map((todo) => (
            <TodoListItem key={todo.id} todo={todo} onCompleteTodo={onCompleteTodo}/>
            ))}
        </ul>
    );
}

export default TodoList;