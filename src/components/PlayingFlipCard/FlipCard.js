import React, { useState, useEffect, useRef } from 'react';
import './FlipCard.css';
import { DefaultCard } from '../../Default/DefaultObjects'
import { v4 as uuid_v4 } from "uuid";
import { MdClear, MdCheck, MdNavigateNext } from 'react-icons/md';



const FlipCard = ({ CardToPlay = {}, StopPlaying, ToNextCard }) => {

  const [Card, setCard] = useState({ ...DefaultCard });
  const [OptionsSet, setOptionsSet] = useState([]);
  const [TextAnswer, setTextAnswer] = useState('');
  const [CorrectIndex, setCorrectIndex] = useState(-1);
  const [Played, setPlayed] = useState(false);
  const [Message, setMessage] = useState('');
  const [Round, setRound] = useState('No');
  const [Filled, setFilled] = useState(false);

  useEffect(() => {
    if (Object.keys(CardToPlay).length > 0) {
      setCard({ ...CardToPlay })
      var ops = [...CardToPlay.Options]
      ops.forEach(element => { element.IsAnswer = false })
      setOptionsSet([...ops])
      setRound('No')
      setMessage('')
      setPlayed(false)
      setTextAnswer('')
      setCorrectIndex(-1)
    }

  }, [CardToPlay]);

  useEffect(() => {
    if (Card.Type === 'Text' && TextAnswer)
      setFilled(true)
    else if (Card.Type === 'MultipleChoice' && CorrectIndex !== -1)
      setFilled(true)
    else
      setFilled(false)
  }, [TextAnswer, CorrectIndex]);


  const [flip, setFlip] = useState(false)
  const [height, setHeight] = useState('initial')

  const FrontElement = useRef()
  const BackElement = useRef()

  function setMaxHeight() {
    const FrontHeight = FrontElement.current.getBoundingClientRect().height
    const BackHeight = BackElement.current.getBoundingClientRect().height
    setHeight(Math.max(FrontHeight, BackHeight, 100))
  }

  useEffect(setMaxHeight, [Card.Question, Card.Answer, Card.Options])

  useEffect(() => {
    window.addEventListener('resize', setMaxHeight)
    return () => window.removeEventListener('resize', setMaxHeight)
  }, [])


  const StopPlayingFunc = () => {
    StopPlaying()
  }

  const ToNextCardFunc = () => {
    ToNextCard()
  }


  const handleChangeCorrectOption = (event) => {
    const OptionID = event.target.value
    const OptionIndex = OptionsSet.findIndex(op => op.Id == OptionID)
    const NewOptionsSet = [...OptionsSet]
    NewOptionsSet.forEach(op => { op.IsAnswer = false })
    NewOptionsSet[OptionIndex].IsAnswer = true
    setCorrectIndex(OptionIndex)
    setOptionsSet([...NewOptionsSet])
    //console.log([...NewOptionsSet])
  }


  const handleCheckQuestion = (e) => {
    e.preventDefault()
    if (Card.Type === 'Text') {
      if (TextAnswer.trim().toLowerCase() == Card.Answer.Option.trim().toLowerCase()) {
        setPlayed(true)
        setMessage('Answer: ' + Card.Answer.Option)
        setRound('Right')
      } else {
        setPlayed(true)
        setMessage('Answer: ' + Card.Answer.Option)
        setRound('Wrong')
      }
      //console.log(TextAnswer, Card.Answer.Option)
    } else {
      if (CorrectIndex === -1) {
        setMessage('Choose one option')
      } else {
        if (OptionsSet[CorrectIndex].Option.trim().toLowerCase() == Card.Answer.Option.trim().toLowerCase()) {
          setPlayed(true)
          setMessage('Answer: ' + OptionsSet[CorrectIndex].Option)
          setRound('Right')
        } else {
          setPlayed(true)
          setMessage('Answer: ' + Card.Answer.Option)
          setRound('Wrong')
        }
      }
    }
  }

  return (
    <div className='PlayingFlipCardContainer'>
      <div className={`PlayingFlipCard  ${flip ? 'PlayingFlipCardFlip' : ''}`} onClick={() => setFlip(!flip)} style={{ height: height }}>
        <div className='PlayingFlipCardFront' ref={FrontElement}>
          <div className='PlayingFlipCardQuestion'>
            <p>{Card.Question}</p>
          </div>
        </div>
        <div className="PlayingFlipCardBack" ref={BackElement}>{Card.Answer.Option}</div>
      </div>





      {
        Card.Type === 'MultipleChoice' &&

        <form className='PlayingFlipCardOptions' onSubmit={handleCheckQuestion}>
          {Round === 'No' && Card.Options.map(Option => {
            return <div key={uuid_v4()} className='PlayingFlipCardOption'>
              <input key={uuid_v4()} type="checkbox" checked={Option.IsAnswer === true} value={Option.Id} onChange={handleChangeCorrectOption} />
              <p>{Option.Option}</p>
            </div>
          })}
          <div className='PlayingFlipCardButtons'>
            {!Played && <button disabled={!Filled}>Check</button>}
            <div className='RoundIconContainer'>
              {Round === 'Right' && <div className='RoundIcon IconCorrect'><MdCheck /></div>}
              {Round === 'Wrong' && <div className='RoundIcon IconWrong'><MdClear /></div>}
            </div>
            {Played && <span className='RoundMessage'>{Message}</span>}
            <div className='RoundIconContainer'>
              {Round !== 'No' && <div className='NextIcon'>
                <button onClick={ToNextCardFunc}>Next <MdNavigateNext /></button>
              </div>}
            </div>
          </div>
        </form>

      }

      {
        Card.Type === 'Text' &&

        <form className='PlayingFlipCardTextForm' onSubmit={handleCheckQuestion}>
          {Round === 'No' && <input type="text" placeholder='Answer' value={TextAnswer} onChange={e => setTextAnswer(e.target.value)} />}
          <div className='PlayingFlipCardButtons' >
            {!Played && <button disabled={!Filled}>Check</button>}
            <div className='RoundIconContainer'>
              {Round === 'Right' && <div className='RoundIcon IconCorrect'><MdCheck /></div>}
              {Round === 'Wrong' && <div className='RoundIcon IconWrong'><MdClear /></div>}
            </div>
            {Played && <span className='RoundMessage'>{Message}</span>}
            <div className='RoundIconContainer'>
              {Round !== 'No' && <div className='NextIcon'>
                <button onClick={ToNextCardFunc}>Next <MdNavigateNext /></button>
              </div>}
            </div>
          </div>
        </form>

      }


    </div >
  );
};

export default FlipCard;
