import React, { useState } from 'react';
import Automatic from './Automatic';
import Header from './Header';
import Manual from './Manual';
import "./App.css"


function App() {

  const [Choice, setChoice] = useState('Automatic');
  //Colocar como Login para Login

  return (
    <>
      <Header />

      {Choice === 'Login' &&
        <div>
          <button onClick={() => setChoice('Manual')}>Personalizados</button>
          <button onClick={() => setChoice('Automatic')}>Automaticos</button>
        </div>
      }

      <div>
        {Choice === 'Manual' && <Manual />}
        {Choice === 'Automatic' && <Automatic />}
      </div>

    </>
  );
}

export default App;