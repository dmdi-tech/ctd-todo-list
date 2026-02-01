import { useEffect, useRef, useState } from "react";
import styled from 'styled-components';

const StyledForm = styled.form`
    display: flex;
    flex-direction: column;
    gap: 10px;
`;

const StyledDiv = styled.div` 
    display: flex; 
    gap: 10px;
    flex-wrap: wrap;
`;

const StyledButton = styled.button`
    font-style: ${(props) => (props.disabled ? 'italic' : 'normal')};
`;

const StyledSelect = styled.select`
    display: flex; 
    gap: 10px;
`;

const preventDefault = (event) => {
    event.preventDefault();
};

function TodoViewForm({ sortDirection, setSortDirection, sortField, setSortField, queryString, setQueryString }) {
    const [localQueryString, setLocalQueryString] = useState(queryString);

    useEffect(() => {
        const debounce = setTimeout(() => setQueryString(localQueryString), 500);
        return () => clearTimeout(debounce);
    },[localQueryString, setQueryString]);

    return (
        <StyledForm onSubmit={preventDefault}>
            <StyledDiv>
                <label id="searchTodos">Search todos: 
                    <input
                        id="searchTodos"
                        type="text"
                        onChange={(event) => {
                            setLocalQueryString(event.target.value);
                        }}
                        value={localQueryString}
                    />  
                </label>
                
                <StyledButton
                    type="button"
                    onClick={() => {setLocalQueryString("")}}
                >
                    Clear
                </StyledButton>
            </StyledDiv>
            <StyledDiv>
                <label id="sortBy">Sort By
                    <StyledSelect 
                        id="sortBy"
                        onChange={(event) => {
                            setSortField(event.target.value);
                        }}
                        value={sortField}
                    >
                        <option value={"title"}>Title</option>
                        <option value={"createdTime"}>Time added</option>
                    </StyledSelect>
                </label>
                

                <label id="direction">Direction
                    <StyledSelect 
                        id="direction"
                        onChange={(event) => {
                            setSortDirection(event.target.value);
                        }}
                        value={sortDirection}
                    >
                        <option value={"asc"}>Ascending</option>
                        <option value={"desc"}>Descending</option>
                    </StyledSelect>
                </label>
            </StyledDiv>
        </StyledForm>
    );
}

export default TodoViewForm;