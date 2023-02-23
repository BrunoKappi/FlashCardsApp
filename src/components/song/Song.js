import React, { useState, useMemo } from 'react'
import { RxSpeakerOff, RxSpeakerLoud } from 'react-icons/rx';
import './Song.css'


export default function Song() {

    const [Sound, setSound] = useState(false);
    let src = '/Song.mp3'
    const audio = useMemo(() => new Audio(src), [src])

    const audioSwitch = () => {
        if (!Sound)
            audio.play()
        else
            audio.pause()
        setSound(!Sound)
    }

    return (
        <div className='SongContainer'>
            <button className='SongSwitchButton' onClick={audioSwitch}>
                {!Sound ? <RxSpeakerOff /> : <RxSpeakerLoud />}
            </button>
        </div>
    )
}
