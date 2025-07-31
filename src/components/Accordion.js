import React, { useState, useRef, useId } from 'react';
import styled, { css } from 'styled-components';

const Accordion = ({ title, children }) => {
    const [isOpen, setisOpen] = useState(true);

    return (
        <AccordionContainer onClick = {() => setisOpen(!isOpen)}>
            <p>{title}</p>
            <AccordionItems $isOpen = {isOpen}>
                {children}
            </AccordionItems>
        </AccordionContainer>
    );
};

export default Accordion;

const AccordionContainer = styled.div`
    cursor: pointer;
    width: 100%;
    margin-left: 0.5rem;
    transition: all 200ms ease-in-out;

    p {
        font: 400 1rem/1.5rem 'At Aero';
    }
`
const AccordionItems = styled.div`
    display: none;
    overflow: hidden;
    flex-direction: column;
    gap: 0.75rem;
    padding: 0.75rem 1rem  0rem .75rem;
    width: fit-content;
    max-height: 0;

    ${props => props.$isOpen && css`
        max-height: unset;
        display: flex;
    `}
`