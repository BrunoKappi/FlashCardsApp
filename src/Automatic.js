import React, { useState, useEffect, useRef } from 'react';
import FlashcardList from './FlashcardList';
import './Automatic.css'
import axios from 'axios'
import { MdArrowBackIos } from 'react-icons/md';
import { Link } from 'react-router-dom'
import { setFunction } from './store/actions/UserActions';
import store from './store/store';
import Playing from './components/playingAutomatic/Playing';
import { setPlaying } from './store/actions/UserActions';
import { setCurrentCategory } from './store/actions/UserActions';
import { connect } from 'react-redux';
import Song from './components/song/Song';

const Automatic = (props) => {
  const [flashcards, setFlashcards] = useState([])
  const [categories, setCategories] = useState([{ "id": 9, "name": "General Knowledge" }, { "id": 10, "name": "Entertainment: Books" }, { "id": 11, "name": "Entertainment: Film" }, { "id": 12, "name": "Entertainment: Music" }, { "id": 13, "name": "Entertainment: Musicals & Theatres" }, { "id": 14, "name": "Entertainment: Television" }, { "id": 15, "name": "Entertainment: Video Games" }, { "id": 16, "name": "Entertainment: Board Games" }, { "id": 17, "name": "Science & Nature" }, { "id": 18, "name": "Science: Computers" }, { "id": 19, "name": "Science: Mathematics" }, { "id": 20, "name": "Mythology" }, { "id": 21, "name": "Sports" }, { "id": 22, "name": "Geography" }, { "id": 23, "name": "History" }, { "id": 24, "name": "Politics" }, { "id": 25, "name": "Art" }, { "id": 26, "name": "Celebrities" }, { "id": 27, "name": "Animals" }, { "id": 28, "name": "Vehicles" }, { "id": 29, "name": "Entertainment: Comics" }, { "id": 30, "name": "Science: Gadgets" }, { "id": 31, "name": "Entertainment: Japanese Anime & Manga" }, { "id": 32, "name": "Entertainment: Cartoon & Animations" }])

  const categoryEl = useRef()
  const amountEl = useRef()

  useEffect(() => {
    axios
      .get('https://opentdb.com/api_category.php')
      .then(res => {
        setCategories(res.data.trivia_categories)
      })
  }, [])




  useEffect(() => {
    setPLaying(props.User.Playing)
  }, [props.User.Playing])




  function decodeString(str) {
    const textArea = document.createElement('textarea')
    textArea.innerHTML = str
    return textArea.value
  }

  function handleSubmit(e) {
    e.preventDefault()
    axios
      .get('https://opentdb.com/api.php', {
        params: {
          amount: amountEl.current.value,
          category: categoryEl.current.value
        }
      })
      .then(res => {
        //console.log(res.data.results)
        store.dispatch(setCurrentCategory({ Name: 'CardsFilled', Id: 1 }))
        console.log("CardsFilled")
        setFlashcards(res.data.results.map((questionItem, index) => {
          const answer = decodeString(questionItem.correct_answer)
          const options = [
            ...questionItem.incorrect_answers.map(a => decodeString(a)),
            answer
          ]
          return {
            id: `${index}-${Date.now()}`,
            question: decodeString(questionItem.question),
            answer: answer,
            options: options.sort(() => Math.random() - .5)
          }
        }))
      })
  }

  const showDropdown = (element) => {
    var event;
    event = document.createEvent('MouseEvents');
    event.initMouseEvent('mousedown', true, true, window);
    element.dispatchEvent(event);
  };

  const OpenSelect = () => {
    var dropdown = document.getElementById("category")
    showDropdown(dropdown)
  }

  const SetFuction = (func) => {
    store.dispatch(setFunction(func))
  }


  const [PLaying, setPLaying] = useState(false);


  const handleStartPLaying = () => {
    //console.log('PLaying')
    store.dispatch(setPlaying(true))
    setPLaying(true)
  }

  const handleStopPLaying = () => {
    //console.log('PLaying')
    store.dispatch(setPlaying(false))
    setPLaying(false)
  }

  return (
    <>
      {!PLaying &&
        <div className='AutomaticHeaderContainer'>
          <form className="AutomaticHeader" onSubmit={handleSubmit}>
            <Link className='BackButton' onClick={e => SetFuction('No')} to="/"><MdArrowBackIos /></Link>
            <div className="form-group" onClick={OpenSelect}>
              <label htmlFor="category">Category</label>
              <select id="category" ref={categoryEl} >
                {categories.map(category => {
                  return <option value={category.id} key={category.id}>{category.name}</option>
                })}
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="amount">Number of Questions</label>
              <input type="number" id="amount" min="1" max="50" step="1" defaultValue={10} ref={amountEl} />
            </div>
            <div className="form-group" id='form-groupBtn'>
              <button className="Btn">Generate</button>
            </div>
          </form>
        </div>
      }
      <div className="FlashCardsListContainer">
        {!PLaying && <FlashcardList flashcards={flashcards} />}

        {PLaying && <div className='AutomaticPlaying'>
          <Playing FlashCards={flashcards} StopPlaying={handleStopPLaying} Automatic={true} />
        </div>
        }
      </div>

      <Song Playing={PLaying} />
    </>
  );
}


const ConnectedAutomatic = connect((state) => {
  return {
    User: state.User
  }
})(Automatic)

export default ConnectedAutomatic
