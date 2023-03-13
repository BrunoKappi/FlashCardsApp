import React, { useEffect, useState } from 'react'
import './Playing.css'
import PlayingHeader from '../playingHeader/PlayingHeader'
import PlayingBody from '../playingBody/PlayingBody'
import { v4 as uuid_v4 } from "uuid";

export default function Playing(props) {


    const [CurrentCategory, setCurrentCategory] = useState({});
    const [Cards, setCards] = useState([]);
    const [PlayingProgress, setPlayingProgress] = useState(0);
    const [PlayingIndex, setPlayingIndex] = useState(0);

    const [Series, setSeries] = useState([])


    const [Play, setPlay] = useState({
        Acertos: 0,
        Erros: 0,
        NaoJogada: 0
    })



    const Jogada = (Tipo) => {
        if (Tipo == "Certo") {
            setPlay({ ...Play, Acertos: Play.Acertos + 1 })
        }
        if (Tipo == "Errado") {
            setPlay({ ...Play, Erros: Play.Erros + 1 })
        }

    }



    useEffect(() => {
        if (!props.CurrentCategoryId) return

        setCurrentCategory(props.Categories.find((Card) => Card.Id.trim() === props.CurrentCategoryId))
        setCards(props.Categories.find((Card) => Card.Id.trim() === props.CurrentCategoryId).Cards)

        //console.log("CARDS DO PLAY", props.Categories.find((Card) => Card.Id.trim() === props.CurrentCategoryId).Cards)

    }, [props.CategoryId, props.Categories]);


    useEffect(() => {
        if (Cards.length === 0) return
        setPlayingProgress(Math.round((PlayingIndex / Cards.length) * 100))
    }, [PlayingIndex, Cards]);



    useEffect(() => {
        if (PlayingProgress === 100) {
            setSeries([Play.Erros, Play.Acertos, (Cards.length - (Play.Erros + Play.Acertos))])
            const Round = {
                Id: uuid_v4(),
                Acertos: Play.Acerto,
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


    return (
        <div className='PlayingContainer'>
            <PlayingHeader PlayingProgress={PlayingProgress} StopPlaying={StopPlaying} ToNextCard={ToNextCard} />
            <PlayingBody Series={Series} Jogada={Jogada} Cards={Cards} CurrentCategory PlayingIndex={PlayingIndex} PlayingProgress={PlayingProgress} StopPlaying={StopPlaying} ToNextCard={ToNextCard} Automatic={false} />
        </div>

    )
}
