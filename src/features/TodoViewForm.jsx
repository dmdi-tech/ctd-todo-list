import { useEffect, useRef, useState } from "react";

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
        <form onSubmit={preventDefault}>
            <div>
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
                
                <button
                    type="button"
                    onClick={() => {setLocalQueryString("")}}
                >
                    Clear
                </button>
            </div>
            <div>
                <label id="sortBy">Sort By
                    <select 
                        id="sortBy"
                        onChange={(event) => {
                            setSortField(event.target.value);
                        }}
                        value={sortField}
                    >
                        <option value={"title"}>Title</option>
                        <option value={"createdTime"}>Time added</option>
                    </select>
                </label>
                

                <label id="direction">Direction
                    <select 
                        id="direction"
                        onChange={(event) => {
                            setSortDirection(event.target.value);
                        }}
                        value={sortDirection}
                    >
                        <option value={"asc"}>Ascending</option>
                        <option value={"desc"}>Descending</option>
                    </select>
                </label>
            </div>
        </form>
    );
}

export default TodoViewForm;