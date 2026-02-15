import TodoListItem from "./TodoListItem";
import styles from './TodoList.module.css';
import { useSearchParams, useNavigate } from "react-router";
import { useEffect } from "react";

function TodoList({ todoList, onCompleteTodo, onUpdateTodo, isLoading }) {
    const filteredTodoList = todoList.filter((todo) => !todo.isCompleted);
    const numOfTodos = filteredTodoList.length;
    
    const [searchParams, setSearchParams] = useSearchParams()
    const itemsPerPage = 15;
    const currentPage = parseInt(searchParams.get('page') || '1', 10);
    const indexOfFirstTodo = (currentPage - 1) * itemsPerPage;
    const indexOfLastTodo = indexOfFirstTodo + itemsPerPage;
    const totalPages = Math.ceil(filteredTodoList.length / itemsPerPage);

    const currentTodos = filteredTodoList.slice(indexOfFirstTodo, indexOfLastTodo);

    const navigate = useNavigate();

    const handlePreviousPage = () => {
        setSearchParams({page: Math.max(1, currentPage - 1)});
    }

    const handleNextPage = () => {
        setSearchParams({ page: Math.min(totalPages, currentPage + 1)})
    }

    useEffect(() => {
        if(totalPages > 0){
            if(isNaN(currentPage) || currentPage < 1 || currentPage > totalPages) {
                navigate("/");
            }
        }
    },[currentPage, totalPages, navigate]);


    if(isLoading) {
        return <p>Todo list loading...</p>
    }

    if(numOfTodos == 0) {
        return <p>Add Todo above to get started!</p>
    }
    
    return (
        <ul className={styles.list}>
            {currentTodos.map((todo) => (
            <TodoListItem key={todo.id} todo={todo} onCompleteTodo={onCompleteTodo} onUpdateTodo={onUpdateTodo}/>
            ))}

            <div className={styles.paginationControls}>
                <button
                    onClick={() =>{
                        handlePreviousPage();
                    }}
                    disabled={currentPage===1}
                >Previous</button>
                <span>Page {currentPage} of {totalPages} </span>
                <button
                    onClick={() => {
                        handleNextPage();
                    }}
                    disabled={currentPage===totalPages}
                >Next</button>
            </div>  
        </ul>
    );
}

export default TodoList;