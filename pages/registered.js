import { useRouter } from 'next/router';
import { React, useEffect, useState } from 'react';
import { useForm } from "react-hook-form";
import styled from 'styled-components';

import useAuth from '../hooks/useAuth';
import saphira from '../services/saphira';
import Meta from '../src/infra/Meta';
import NavBar from '../src/patterns/base/Nav';

// components
import Button from '../src/components/Button';
import SecondaryButton from '../src/components/SecondaryButton';

const Registered = () => {

    const router = useRouter();
    const { isAuthenticated } = useAuth();
    const { register, getValues, setError, formState: { errors }, handleSubmit, reset } = useForm();

    const [accessAllowed, setAccessAllowed] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [students, setStudents] = useState([]);

    const onSubmit = data => {
        setIsLoading(true);

        searchStudentByName(data.name);

        setTimeout(() => {
            setIsLoading(false);
        }, 500);
    };
    
    const checkAuthentication = () => {
        if (isAuthenticated === null) {
            return;
        }
        
        if (isAuthenticated) {
            setAccessAllowed(true);
        } else {
            setAccessAllowed(false);
            router.push("/");
        }
    }

    const searchStudentByName = (name) => {
        setStudents([]);

        saphira.searchStudentByName(name)
            .then((res) => {
                console.log(res.data);
                setStudents((prevStudents) => prevStudents.concat(...res.data).sort((a, b) => a.name.localeCompare(b.name)));
            })
            .catch((err) => {
                console.log("Erro ao pesquisar estudantes com este nome", err);
            })
    }

    const clearUserInfo = () => {
        setStudents();
    }

    useEffect(() => {
        checkAuthentication();
    }, []);

    return (
        <>
            <script
                dangerouslySetInnerHTML={{
                    __html: `
                    if (!document.cookie || !document.cookie.includes('co-auth')) {
                        window.location.href = "/"
                    }
                `
                }} 
            />

            <Meta title='CO SSI 2025 | Consultar presença' />

            <NavBar />
            <RegisteredWrapper>
                <div className='section-container'>

                    <h5>Inscritos</h5>

                    {accessAllowed &&
                        <FormWrapper>
                            <form onSubmit={handleSubmit(onSubmit)}>
                                {!isLoading &&
                                    <>
                                        <InputBox>
                                            <div className='input-btn'>
                                                <div className='form-input'>
                                                    <input id='name' type='text' placeholder='Busque por nome...' className={`${errors.name && 'error-border'}`}
                                                        {...register("name", { required: true })} />
                                                </div>
                                                {!students || students.length == 0 ?
                                                    <Button> Consultar </Button>
                                                    :
                                                    <SecondaryButton type="button" onClick={() => clearUserInfo()}> Limpar consulta </SecondaryButton>
                                                }
                                            </div>
                                        </InputBox>
                                    </>
                                }

                                {isLoading &&
                                    <Loading>
                                        <img src='./loading.svg' alt='SSI 2025 - Loading' />
                                    </Loading>
                                }
                            </form>
                        </FormWrapper>
                    }
                </div>

                {!isLoading &&
                    <StudentsListSection>
                        <StudentsTable>
                            <thead>
                                <tr>
                                    <th>Nome</th>
                                    <th>Email</th>
                                    <th>Código SSI</th>
                                </tr>
                            </thead>
                            <tbody>
                                {students && students.map((student, index) => (
                                    <tr
                                        key={student.id}
                                        style={{ backgroundColor: index % 2 === 0 ? 'var(--color-neutral-800)' : 'transparent' }}
                                    >
                                        <td>{student.name}</td>
                                        <td>{student.email}</td>
                                        <td>{student.code}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </StudentsTable>
                    </StudentsListSection>
                }
            </RegisteredWrapper>
        </>
    )
}

export default Registered;


const Loading = styled.figure`
    display: flex;
    align-items: center;
    justify-content: center;

    img {
        width: 50%;
        max-width: 250px;
    }
`

const RegisteredWrapper = styled.section`
    margin-top: 3.75rem;
    display: flex;
    align-items: center;
    justify-content: center;

    .section-container {
        width: 100%;
        max-width: 1328px;
        height: fit-content;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        gap: 1.5rem;

        h5 {
            width: 100%;
        }
    }
`

const FormWrapper = styled.div`
    --color-invalid: #F24822;
    --color-valid: #14AE5C;
    width: 100%;

    form {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        flex-wrap: wrap;
        gap: 1rem;

        p {
            font: 700 1rem/1.5rem 'AT Aero Bold';
            text-align: left;
            width: 100%;
        }

        .input-btn {
            display: flex;
            width: 100%;
            gap: .5rem;
        }

        button {
            padding-inline: 1.5rem;
            width: fit-content;
        }
    }

    .form-input {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        width: 100%;
        padding: 0.5rem;

        border: 2px solid var(--content-neutrals-primary);
        background: transparent;
        background-clip: padding-box;
        color: var(--content-neutrals-primary);

        &:has(input[type=text]:focus):not(:has(.error-border)):not(:has(.token-registered)) {
            border-color: var(--color-primary);
        }

        &:has(input[type=password]:focus):not(:has(.error-border)):not(:has(.token-registered)) {
            border-color: var(--color-primary);
        }

        &:has(.error-border) {
            border-color: var(--color-invalid);
        }

        &:has(.token-registered) {
            border-color: var(--color-valid);
        }

        input[type=text], input[type=password],  select {
            width: 95%;
            border: none;
            background-color: transparent;
            color: var(--content-neutrals-primary);
            font: 400 1rem/1.5rem 'AT Aero';
        }

        select {
            color: var(--content-neutrals-primary);
        }

        ::placeholder {
            color: var(--content-neutrals-primary);
            font: 400 1rem/1.5rem 'AT Aero';
        }

        ::-ms-input-placeholder {
            color: var(--content-neutrals-primary);
            font: 400 1rem/1.5rem 'AT Aero';
        }
    }

    /* Firefox */
    input[type=number] {
        -moz-appearance: textfield;
    }

    span {
        font: 400 0.875rem/1rem 'AT Aero Bold';
        color: var(--color-invalid);
    }
`

const InputBox = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    position: relative;
    width: 100%;

    label {
        font: 700 1.125rem/1.5rem 'AT Aero Bold';
        width: 100%;
        margin-bottom: .5rem;
    }
`

const StudentsListSection = styled.section`
    width: 100%;
    overflow-x: auto;
`

const StudentsTable = styled.table`
    width: 100%;
    max-width: 1328px;
    border-collapse: separate;
    border-spacing: 0 2rem;
    

    thead {
        border-block: 1px solid var(--color-neutral-secondary);
        background: transparent;
    }
    
    th {
        font: 700 1rem/1.5rem 'AT Aero Bold';
        border-block: 1px solid var(--color-neutral-secondary);
        padding-block: 1rem;
        text-align: left;

        &:first-child {
            padding-left: 2rem;
        }
    }
`
