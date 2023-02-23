import React, { useEffect, useState } from 'react'
import FlipCard from '../PlayingFlipCard/FlipCard'
import './PlayingBody.css'


export default function PlayingBody(props) {

    const [Card, setCard] = useState({});  

    useEffect(() => {
        setCard(props.Cards[props.PlayingIndex])
    }, [props.PlayingIndex, props.Cards,]);



    return (
        <div className='PlayingBody'>
            {props.PlayingProgress < 100 && <FlipCard CardToPlay={Card} StopPlaying={props.StopPlaying} ToNextCard={props.ToNextCard} Automatic={props.Automatic}/>}

            {props.PlayingProgress >= 100 && <div className='RoundComplete'>
                Round Complete
            </div>}

        </div>

    )
}
