import styled from "styled-components";

const SpeakerInput = ({selectedSpeakers = [], setSelectedSpeakers, speakers}) => {
    const handleAdd = (speaker) => {
        setSelectedSpeakers([...selectedSpeakers, speaker])
    }

    const handleRemove = (id) => {
        setSelectedSpeakers(selectedSpeakers.filter(speaker => speaker.split("|")[0] != id))
    }

    const availableOptions = speakers.filter((speaker) => 
        !selectedSpeakers.some(selected => selected.split("|")[0] == speaker.id)
    )

    return (
        <InputContainer>
            <label>Palestrantes</label>
            {selectedSpeakers.map((speaker) => {
                return(
                    <InputRow key = {speaker.split("|")[0]}>
                        <input value = {speaker.split("|")[1]} readOnly/>
                        <button onClick = {() => handleRemove(speaker.split("|")[0])}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M6.4 19L5 17.6L10.6 12L5 6.4L6.4 5L12 10.6L17.6 5L19 6.4L13.4 12L19 17.6L17.6 19L12 13.4L6.4 19Z" fill="white"/>
                            </svg>
                        </button>
                    </InputRow>
                )
            })}

            <InputRow>
            <select onChange = {(option) => handleAdd(option.target.value)}>
                <option value = {undefined}>Selecione um Palestrante...</option>
                {availableOptions.map((speaker) => {
                    return(
                        <option key = {speaker.id} value = {`${speaker.id}|${speaker.name}`}>{speaker.name}</option>
                    )
                })}
            </select>
            </InputRow>
        </InputContainer>

    )
}

export default SpeakerInput

const InputContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
`
const InputRow = styled.div`
    width: 100%;
    gap: 1.5rem;
    display: flex;

    button {
        background: none;
        border: none;
    }
`