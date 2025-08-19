import styled from "styled-components";

const ProgressBar = ({totalPresence, requisitePresence, userGifts, id}) => {

    const checkIfUserHasGift = () => {
        return userGifts.some(userGift => userGift.gift.id === id);
    };
    const percentage = Math.min((totalPresence/requisitePresence) * 100, 100);
    const hasGift = checkIfUserHasGift()

    if (hasGift){
        return (
            <ProgressBarContainer>
                <BarReceveid>{
                userGifts.some(userGift => userGift.gift.id == id && userGift.received)
                ? 'Brinde retirado!'
                : 'Disponível para retirada'
                }</BarReceveid>
            </ProgressBarContainer>
        )
    }

    return(
        <ProgressBarContainer>
            <BarCompleted $total = {percentage}>{totalPresence}</BarCompleted>
            <UncompleteBar $total = {percentage}>
                <p>{Math.max(requisitePresence - totalPresence, 0) == 0 ? '' : requisitePresence - totalPresence}</p>
            </UncompleteBar>
        </ProgressBarContainer>
    )
}

export default ProgressBar

const ProgressBarContainer = styled.div`
    width: 100%;
    display: flex;
    height: 100%;
`

const BarCompleted = styled.div`
    background-color: var(--brand-primary);
    display: flex;
    align-items: center;
    justify-content: center;
    width: ${(props) => props.$total}%;
    font: 700 1rem/1.5rem 'At Aero Bold';
`
const UncompleteBar = styled.div`
    background-color: var(--background-neutrals-inverse);
    display: flex;
    align-items: center;
    justify-content: center;
    width: ${(props) => 100 - props.$total}%;

    p{
        color: var(--content-neutrals-inverse);
    }
`

const BarReceveid = styled.div`
    background-color: var(--background-accent-green);
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--content-accent-green);
    font: 700 1rem/1.5rem 'At aero Bold';
`