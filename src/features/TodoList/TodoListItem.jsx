import { useState, useEffect } from "react";
import TextInputWithLabel from "../../shared/TextInputWithLabel";
import styles from './TodoListItem.module.css';
import styled from 'styled-components';

const StyledLabel = styled.label`
    display:flex;
    gap: 5px;
`;

function TodoListItem({ todo, onCompleteTodo, onUpdateTodo }) {
    const [isEditing, setIsEditing] = useState(false);
    const [workingTitle, setWorkingTitle] = useState(todo.title);

    const handleCancel = () => {
        setWorkingTitle(todo.title); // changed from todo.list to todo.title
        setIsEditing(false);
    };

    const handleEdit = (event) => {
        setWorkingTitle(event.target.value)
    };

    const handleUpdate = (event) => {
        if (isEditing==false) return;

        event.preventDefault();
        onUpdateTodo({...todo, title: workingTitle});
        setIsEditing(false);
    };

    useEffect(() => {
        setWorkingTitle(todo.title);
    },[todo]);

    return (
        <li className={styles.listitem}>
            <form onSubmit={handleUpdate}>
                {isEditing ? (
                    <>
                        <TextInputWithLabel value={workingTitle} onChange={handleEdit}/>
                        <button type="button" onClick={handleCancel}>Cancel</button>
                        <button type="button" onClick={handleUpdate}>Update</button>
                    </>
                ) : (
                    <>
                        <StyledLabel>
                            <input 
                            type="checkbox" 
                            checked={todo.isCompleted} 
                            onChange={() => onCompleteTodo(todo.id)} 
                            />
                            <span onClick={() => setIsEditing(true)}>{todo.title}</span>
                        </StyledLabel>
                        
                    </>
                )}              
            </form>
        </li>
    );
}

export default TodoListItem;