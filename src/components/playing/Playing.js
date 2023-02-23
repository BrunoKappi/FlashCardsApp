import React, { useEffect, useState } from 'react'
import './Playing.css'
import PlayingHeader from '../playingHeader/PlayingHeader'
import PlayingBody from '../playingBody/PlayingBody'

export default function Playing(props) {


    const [CurrentCategory, setCurrentCategory] = useState({});
    const [Cards, setCards] = useState([]);
    const [PlayingProgress, setPlayingProgress] = useState(0);
    const [PlayingIndex, setPlayingIndex] = useState(0);


    useEffect(() => {
        if (!props.CurrentCategoryId) return

        setCurrentCategory(props.Categories.find((Card) => Card.Id.trim() === props.CurrentCategoryId))
        setCards(props.Categories.find((Card) => Card.Id.trim() === props.CurrentCategoryId).Cards)

        console.log("CARDS DO PLAY", props.Categories.find((Card) => Card.Id.trim() === props.CurrentCategoryId).Cards)

    }, [props.CategoryId, props.Categories]);


    useEffect(() => {
        if (Cards.length === 0) return
        setPlayingProgress(Math.round((PlayingIndex / Cards.length) * 100))       
    }, [PlayingIndex, Cards]);


    useEffect(() => {
        if (PlayingProgress === 100) {
            setTimeout(() => {
                StopPlaying()
            }, 2500);
        }
    }, [PlayingProgress]);


    const ToNextCard = () => {
        setPlayingIndex(PlayingIndex + 1)
    }

    const StopPlaying = () => {
        setPlayingIndex(0)
        setPlayingProgress(0)
        props.StopPlaying()
    }


    return (
        <div className='PlayingContainer'>
            <PlayingHeader PlayingProgress={PlayingProgress} StopPlaying={StopPlaying} ToNextCard={ToNextCard} />
            <PlayingBody Cards={Cards} CurrentCategory PlayingIndex={PlayingIndex} PlayingProgress={PlayingProgress} StopPlaying={StopPlaying} ToNextCard={ToNextCard} Automatic={false}/>
        </div>

    )
}
