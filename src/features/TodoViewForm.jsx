import { useRef, useState } from "react";

const preventDefault = (event) => {
    event.preventDefault();
};

function TodoViewForm({ sortDirection, setSortDirection, sortField, setSortField, queryString, setQueryString }) {
    return (
        <form onSubmit={preventDefault}>
            <div>
                <label id="searchTodos">Search todos: 
                    <input
                        id="searchTodos"
                        type="text"
                        onChange={(event) => {
                            setQueryString(event.target.value);
                        }}
                        value={queryString}
                    />  
                </label>
                
                <button
                    type="button"
                    onClick={() => {setQueryString("")}}
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