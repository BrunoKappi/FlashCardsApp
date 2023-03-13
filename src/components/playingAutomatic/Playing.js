import React, { useEffect, useState } from 'react'
import './Playing.css'
import PlayingHeader from '../playingHeader/PlayingHeader'
import PlayingBody from '../playingBody/PlayingBody'
import { v4 as uuid_v4 } from "uuid";
import { Card } from 'react-bootstrap';

export default function Playing(props) {

    const [Cards, setCards] = useState([]);
    const [PlayingProgress, setPlayingProgress] = useState(0);
    const [PlayingIndex, setPlayingIndex] = useState(0);
    const [Series, setSeries] = useState([])


    const [Play, setPlay] = useState({
        Acertos: 0,
        Erros: 0,
        NaoJogada: 0
    })

    useEffect(() => {
        console.log(props.CurrentCategoryId)
    }, [])



    const Jogada = (Tipo) => {
        if (Tipo == "Certo") {
            setPlay({ ...Play, Acertos: Play.Acertos + 1 })
        }
        if (Tipo == "Errado") {
            setPlay({ ...Play, Erros: Play.Erros + 1 })
        }

    }


    useEffect(() => {
        if (!props.FlashCards) return
        setCards([...props.FlashCards])

    }, [props.FlashCards]);





    useEffect(() => {
        if (Cards.length === 0) return



        Cards.forEach(Card => {
            //Card['Answer'] = Card['answer']; delete Card['answer'];
            //Card['Question'] = Card['question']; delete Card['question'];
            //Card['Options'] = Card['options']; delete Card['options'];
            Card.Options = []
            Card.Answer = {}
            Card.Question = Card.question
            Card.Type = 'MultipleChoice'
            Card.options.forEach(option => {
                var Is = Card.answer == option ? true : false
                var op = { Id: uuid_v4(), Option: option, IsAnswer: Is }
                Card.Options.push(op)
            })
            Card.Answer = Card.Options.find(C => C.IsAnswer === true)
        })

    }, [PlayingIndex, Cards]);

 


    useEffect(() => {
        if (PlayingProgress === 100) {
            setSeries([Play.Erros, Play.Acertos, (Cards.length - (Play.Erros + Play.Acertos))])
            const Round = {
                Id: uuid_v4(),
                Acertos: Play.Acertos,
                Erros: Play.Erros,
                NaoJogada: (Cards.length - (Play.Erros + Play.Acertos)),
                Series: [Play.Erros, Play.Acertos, (Cards.length - (Play.Erros + Play.Acertos))]
            }
            props.RecordPlay(Round)
        }
    }, [PlayingProgress]);




    const ToNextCard = () => {
        if (PlayingIndex > (Cards.length - 1))
            StopPlaying()
        else
            setPlayingIndex(PlayingIndex + 1)
    }

    const StopPlaying = () => {
        setPlayingIndex(0)
        setPlayingProgress(0)
        props.StopPlaying()
    }

    useEffect(() => {
        if (Cards.length === 0) return
        setPlayingProgress(Math.round((PlayingIndex / Cards.length) * 100))
    }, [PlayingIndex, Cards]);




    return (
        <div className='PlayingContainer'>

            <PlayingHeader PlayingProgress={PlayingProgress} StopPlaying={StopPlaying} ToNextCard={ToNextCard} />
            <PlayingBody Series={Series} Jogada={Jogada} Cards={Cards} CurrentCategory PlayingIndex={PlayingIndex} PlayingProgress={PlayingProgress} StopPlaying={StopPlaying} ToNextCard={ToNextCard} Automatic={true} />

        </div>

    )
}


/*

<PlayingHeader PlayingProgress={PlayingProgress} StopPlaying={StopPlaying} ToNextCard={ToNextCard} />
            <PlayingBody Cards={Cards} CurrentCategory PlayingIndex={PlayingIndex} PlayingProgress={PlayingProgress} StopPlaying={StopPlaying} ToNextCard={ToNextCard} />

        */