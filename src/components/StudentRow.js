import styled from "styled-components";
import { useRouter } from "next/router";

const StudentRow = ({id, name, email, isEven}) => {

    const router = useRouter()

    return(
        <Student $isEven = {isEven} onClick={() => router.push({pathname: '/studentView', query: {id: id}})}>
            <p>{id}</p>
            <p>{name}</p>
            <p>{email}</p>
        </Student>
    )

}

const Student = styled.div`
    width: 100%;
    align-items: center;
    cursor: pointer;
    display: grid;
    grid-template-columns: 1fr 3fr 3fr; 
    grid-column-gap: 3rem;
    padding: 0.75rem 0.5rem; 
    min-height: 4rem;
    align-items: center;
    background-color: ${({$isEven}) => $isEven ? 'var(--background-neutrals-secondary)' : 'transparent'};
    transition: background-color 200ms ease-in-out;
    
    &:hover{
        background-color: var(--state-layers-neutrals-primary-008);
    }

    p {
        font: 700 1.125rem/1.5rem 'At Aero Bold';
    }
`

export default StudentRow