import { useRef, useState } from "react";
import TextInputWithLabel from "../shared/TextInputWithLabel";
import styled from 'styled-components';

const StyledForm = styled.form`
    display: flex;
    flex-direction: column;
    gap: 10px;
    flex-wrap: wrap;
`;

const StyledButton = styled.button`
    font-style: ${(props) => (props.disabled ? 'italic' : 'normal')};
`;

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
        <StyledForm onSubmit={handleAddTodo} >
            <TextInputWithLabel 
                ref={todoTitleInput} 
                value={workingTodoTitle}
                onChange={(event) => {
                    setWorkingTodoTitle(event.target.value)
                }}
                elementId={"todoTitle"}
                labelText={"Todo"}
            />
            <StyledButton disabled={workingTodoTitle.length === 0}>
                {isSaving ? 'Saving...' : 'Add Todo'}
            </StyledButton>
        </StyledForm>
    );
}

export default TodoForm;