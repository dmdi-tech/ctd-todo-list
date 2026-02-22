import { Link } from "react-router";
import styled from 'styled-components';

const StyledDiv = styled.div`
    display: flex;
    flex-direction: column;
    margin: 0 auto;
    text-align:center;
`;

function NotFound() {
    return (
        <StyledDiv>
            <h3>Page Not Found</h3>
            <Link 
                to='/'
            > Go back Home </Link>
        </StyledDiv>
    )
}

export default NotFound