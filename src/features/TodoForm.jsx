import { useRef, useState } from "react";
import TextInputWithLabel from "../shared/TextInputWithLabel";

function TodoForm({ onAddTodo, isSaving }) {
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
            <TextInputWithLabel 
                ref={todoTitleInput} 
                value={workingTodoTitle}
                onChange={(event) => {
                    setWorkingTodoTitle(event.target.value)
                }}
                elementId={"todoTitle"}
                labelText={"Todo"}
            />
            <button disabled={workingTodoTitle.length === 0}>
                {isSaving ? 'Saving...' : 'Add Todo'}
            </button>
        </form>
    );
}

export default TodoForm;