import { useRef, useState } from "react";

function TodoForm({onAddTodo}) {
    const todoTitleInput = useRef('');
    const [workingTodoTitle, setWorkingTodoTitle] = useState('');

    // event handler
    const handleAddTodo = (event) => {
        event.preventDefault();
        //console.dir(event.target.title);
        //const title = event.target.title.value;
        onAddTodo(workingTodoTitle);
        //event.target.title.value = ""; // clear our user input
        setWorkingTodoTitle('');
        todoTitleInput.current.focus();
    }

    return (
        <form onSubmit={handleAddTodo}>
            <label htmlFor="todoTitle">Todo</label>
            <input 
                type="text" 
                id="todoTitle" 
                name="title" 
                ref={todoTitleInput} 
                value={workingTodoTitle}
                onChange={(event) => {
                    setWorkingTodoTitle(event.target.value)
                }}
            />
            <button disabled={workingTodoTitle.length === 0}>
                Add Todo
            </button>
        </form>
    );
}

export default TodoForm;