import { useRef } from "react";

function TodoForm({onAddTodo}) {
    const todoTitleInput = useRef('');

    // event handler
    const handleAddTodo = (event) => {
        event.preventDefault();
        //console.dir(event.target.title);
        const title = event.target.title.value;
        onAddTodo(title);
        event.target.title.value = ""; // clear our user input
        todoTitleInput.current.focus();
    }

    return (
        <form onSubmit={handleAddTodo}>
            <label htmlFor="todoTitle">Todo</label>
            <input type="text" id="todoTitle" name="title" ref={todoTitleInput}></input>
            <button>Add Todo</button>
        </form>
    );
}

export default TodoForm;