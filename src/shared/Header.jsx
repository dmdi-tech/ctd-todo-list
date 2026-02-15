import { NavLink, useLocation } from "react-router";
import { useEffect, useState } from "react";
import styles from './Header.module.css';

function Header() {
    const location = useLocation();
    const [title, setTitle] = useState("");

    useEffect(() => {
        if(location.pathname=="/"){
            setTitle("Todo List");
        } else if(location.pathname=="/about") {
            setTitle("About");
        } else {
            setTitle("Not Found")
        }
    },[location]);

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>{title}</h1>
            <nav>
                <NavLink
                    to={"/"}
                    className={({ isActive })=>{
                        if(isActive==true){
                            return styles.active;
                        } else {
                            return styles.inactive;
                        }
                    }}
                >
                    Home
                </NavLink>
                <NavLink
                    to={"/about"}
                    className={({ isActive })=>{
                        if(isActive==true){
                            return styles.active;
                        } else {
                            return styles.inactive;
                        }
                    }}
                >
                    About
                </NavLink>
            </nav>
        </div>
    )
}

export default Header