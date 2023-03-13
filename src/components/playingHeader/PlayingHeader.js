import React from 'react'
import './PlayingHeader.css'
import { MdClear, MdNavigateNext } from 'react-icons/md';
import ProgressBar from 'react-bootstrap/ProgressBar';

export default function PlayingHeader(props) {

    const StopPlaying = () => {
        props.StopPlaying()
    }

    const ToNextCard = () => {
        props.ToNextCard()
    }


    return (
        <div className='PlayingHeader'>
            <div className='PlayingHeaderExitButton' onClick={StopPlaying} >
                <MdClear />
            </div>

            <ProgressBar variant="warning" now={props.PlayingProgress} />

            <div className='PlayingHeaderNextButton' onClick={ToNextCard}>
                <MdNavigateNext />
            </div>
        </div>

    )
}
