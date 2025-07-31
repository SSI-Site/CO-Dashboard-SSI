import React, { useState} from 'react';
import styled, { css } from 'styled-components';

const Accordion = ({ title, children }) => {
    const [isOpen, setisOpen] = useState(true);

    return (
        <AccordionContainer>
            <AccordionToggle $isOpen = {isOpen} onClick = {() => setisOpen(!isOpen)}>
                <p>{title}</p>
                <svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M6.68125 17.23L12.5 11.4112L18.3187 17.23L20.5 15.0487L12.5 7.04873L4.5 15.0487L6.68125 17.23Z" fill="white"/>
                </svg>
            </AccordionToggle>
            <AccordionItems $isOpen = {isOpen}>
                {children}
            </AccordionItems>
        </AccordionContainer>
    );
};

export default Accordion;

const AccordionContainer = styled.div`
    width: 100%;
    margin-left: 0.5rem;

    p {
        font: 400 1rem/1.5rem 'At Aero';
    }
`

const AccordionToggle = styled.div`
    display: flex;
    width: 100%;
    justify-content: space-between;
    cursor: pointer;

    svg {
        transition: transform 200ms ease-in-out;

        ${props => props.$isOpen && css`
            transform: rotate(180deg);
        `}
        path {
            fill: var(--content-neutrals-primary);
        }
    }
    
`

const AccordionItems = styled.div`
    display: none;
    overflow: hidden;
    flex-direction: column;
    gap: 0.75rem;
    padding: 0.75rem 1rem  0rem .75rem;
    max-height: 0;

    > * {
        width: fit-content;
    }

    ${props => props.$isOpen && css`
        max-height: fit-content;
        display: flex;
    `}
`