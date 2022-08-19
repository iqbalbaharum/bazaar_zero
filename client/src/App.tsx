import React, { useEffect } from 'react';
import {useState} from 'react'

import './App.css';

import { sequence } from '0xsequence'

import { Fluence } from '@fluencelabs/fluence';
import { krasnodar } from '@fluencelabs/fluence-network-environment';
import NavLayout from './Layout/NavLayout';

function App() {

  const [init, isInit] = useState(false)

  useEffect(() => {

    const walletAppURL = process.env.REACT_APP_WALLET_APP_URL || 'https://sequence.app'
    const network = 'polygon'
    sequence.initWallet(network, { walletAppURL })
    isInit(true)

    setTimeout(() => {
      Fluence.start({ connectTo: krasnodar[0] })
      .then(e => console.log(Fluence.getStatus()))
      .catch(e => {
        console.log(e)
      })
    }, 1000)
  }, [isInit])

  return (
    <div className="App">
      {init && <NavLayout />}
    </div>
  );
}

export default App;
