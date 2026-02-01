import TodoListItem from "./TodoListItem";
import styles from './TodoList.module.css';

function TodoList({ todoList, onCompleteTodo, onUpdateTodo, isLoading }) {
    const filteredTodoList = todoList.filter((todo) => !todo.isCompleted);
    const numOfTodos = filteredTodoList.length;

    if(isLoading) {
        return <p>Todo list loading...</p>
    }

    if(numOfTodos == 0) {
        return <p>Add Todo above to get started!</p>
    }

    return (
        <ul className={styles.list}>
            {filteredTodoList.map((todo) => (
            <TodoListItem key={todo.id} todo={todo} onCompleteTodo={onCompleteTodo} onUpdateTodo={onUpdateTodo}/>
            ))}
        </ul>
    );
}

export default TodoList;