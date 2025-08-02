import styled, { css } from "styled-components";
import { useState, useEffect } from "react";

const Alert = ({mode, children}) => {

    const [isOpen, setIsOpen] = useState(true);

    useEffect(() => {
        setTimeout(() => {
            setIsOpen(false);
        }, 2000)
    })
   

    return (
        <>
        {
        isOpen && 
            <AlertContainer $mode = {mode}>
                {children}
            </AlertContainer>
        }
        </>
    )
}

export default Alert

const AlertContainer = styled.div`
    width: fit-content;
    padding: 0.75rem 1rem;
    display: flex;
    gap: 1rem;
    position: fixed;
    bottom: 0;
    right: 0;

    ${(props) => {
        switch(props.$mode){
            case "CREATE":
                return css`
                    background-color: var(--background-accent-green);
                    color: var(--content-accent-green);
                    svg path {
                        fill: var(--content-accent-green);
                    }
                `
            case "DELETE":
                return css`
                    background-color: var(--background-accent-red);
                    color: var(--content-accent-red);
                    svg path {
                        fill: var(--content-accent-red)
                    }
                `
            
            default:
                return css`
                    background-color: var(--background-neutrals-inverse);
                    color: var(--content-neutrals-inverse);
                    border: 1px solid var(--outline-neutrals-inverse);

                    svg path {
                        fill: var(--content-neutrals-inverse);
                    }
                `
        }
    }}
    
`