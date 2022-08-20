import React, { useEffect } from 'react';
import {useState} from 'react'

import './App.css';

import { sequence } from '0xsequence'

import NavLayout from './Layout/NavLayout';

function App() {

  const [init, isInit] = useState(false)

  useEffect(() => {

    const walletAppURL = process.env.REACT_APP_WALLET_APP_URL || 'https://sequence.app'
    const network = 'polygon'
    sequence.initWallet(network, { walletAppURL })
    isInit(true)
  }, [isInit])

  return (
    <div className="App">
      {init && <NavLayout />}
    </div>
  );
}

export default App;
