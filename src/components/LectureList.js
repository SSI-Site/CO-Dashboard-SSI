import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import saphira from '../../services/saphira';

// components
import Button from './Button';

const LectureList = () => {
    const [lectures, setLectures] = useState([]);
    const [showLectures, setShowLectures] = useState(true);

    // Função para formatar a data em "Segunda-Feira", etc.
    const formatDay = (dateString) => {
        const daysOfWeek = [
            'Domingo', 'Segunda-Feira', 'Terça-Feira', 'Quarta-Feira',
            'Quinta-Feira', 'Sexta-Feira', 'Sábado'
        ];
        const date = new Date(dateString);
        return daysOfWeek[date.getDay()];
    };

    // Função para formatar o horário em "09:40", "13:20", etc.
    const formatTime = (dateString) => {
        const date = new Date(dateString);
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        return `${hours}h${minutes}`;
    };

    // Função para obter as palestras e setá-las
    const listLectures = () => {
        setLectures([]);
        saphira.getLectures()
        .then((res) => {
            setLectures(lectures.concat(...res.data).sort((a, b) => a.id > b.id ? -1 : 1));
        })
        .catch((err) => {
            console.error(err);
        });
    };

    // Carregar as palestras ao montar o componente
    useEffect(() => {
        listLectures();
    }, []);

    return (
        <LectureListWrapper>
            <ListTitle>
                <h5>Palestras</h5>
                <Button onClick={() => setShowLectures(!showLectures)}>
                    {showLectures ? 'Ocultar' : 'Exibir'} palestras
                </Button>
            </ListTitle>

            <div className='table-container'>
                {showLectures && (
                    <LecturesTable>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Nome da Palestra</th>
                                <th>Palestrante</th>
                                <th>Dia</th>
                                <th>Horário</th>
                            </tr>
                        </thead>
                        <tbody>
                            {lectures.map((lecture, index) => (
                                <tr
                                    key={lecture.id}
                                    style={{ backgroundColor: index % 2 === 0 ? 'var(--color-neutral-800)' : 'transparent' }}
                                >
                                    <td>{lecture.id}</td>
                                    <td>{lecture.title}</td>
                                    <td>{lecture.speaker}</td>
                                    <td>{formatDay(lecture.date_time)}</td>
                                    <td>{formatTime(lecture.date_time)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </LecturesTable>
                )}
            </div>
        </LectureListWrapper>
    );
};

export default LectureList;


const LectureListWrapper = styled.div`
    width: 100%;
    max-width: 1328px;
    margin: 0 auto;
    padding: 4rem 2rem;

    .table-container {
        width: 100%;
        overflow-x: auto;
    }
`;

const ListTitle = styled.div`
    display: flex;
    gap: 3rem;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;

    button {
        width: fit-content;
    }
`;

const LecturesTable = styled.table`
    width: 100%;
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

    tbody {
        tr {
            background: var(--color-neutral-800);
            border-radius: 0.5rem;
            transition: background 0.3s;

            td {
                padding-block: 0.5rem;
                text-align: left;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                max-width: 150px;
                padding-right: 3rem;

                &:nth-child(2) {
                    max-width: 400px;
                }

                &:nth-child(3) {
                    max-width: 200px;
                }

                &:nth-child(4) {
                    max-width: 90px;
                }
            
                &:nth-child(5) {
                    padding-inline: 0;
                }
            }

            td:first-child {
                padding-left: 2rem;
            }
        }
    }
`;