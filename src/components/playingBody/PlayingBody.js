import React, { useEffect, useState } from 'react'
import FlipCard from '../PlayingFlipCard/FlipCard'
import './PlayingBody.css'
import Chart from "react-apexcharts";


export default function PlayingBody(props) {

    const [Card, setCard] = useState({});

    useEffect(() => {
        setCard(props.Cards[props.PlayingIndex])
    }, [props.PlayingIndex, props.Cards,]);


    const state = {
        options: {
            labels: ['Mistakes', 'Hits', 'Not Played'],
            legend: {
                position: 'bottom',
                labels: {
                    colors: "#FFFF"
                }
            },
            colors: ['#d9534f', '#5cb85c', '#f0ad4e']
        },
        series: [5, 3, 2],

    }


    const getChartWidth = () => {
        if (window.innerWidth > 1000)
            return 500
        else if (window.innerWidth < 1000 && window.innerWidth > 600)
            return 450
        else if (window.innerWidth <= 600)
            return 350
    }


    return (
        <div className='PlayingBody'>
            {props.PlayingProgress < 100 && <FlipCard Jogada={props.Jogada} CardToPlay={Card} StopPlaying={props.StopPlaying} ToNextCard={props.ToNextCard} Automatic={props.Automatic} />}

            {props.PlayingProgress >= 100 && <div className='RoundComplete'>
                Round Complete

                <Chart
                    options={state.options}
                    series={props.Series}
                    type="pie"
                    width={getChartWidth()}
                />

                <button onClick={props.StopPlaying} className='FinishButton'>Next</button> 
            </div>}

        </div>

    )
}
