import React, { useEffect } from 'react';
import './App.css';

import {BrowserRouter as Router, Route, Routes} from 'react-router-dom'

import Navigation from './Components/Navigation'

import Wrapping from './Pages/Wrapping'
import MyShop from './Pages/MyShop'
import NodeAccount from './Pages/NodeAccount'

import { Fluence } from '@fluencelabs/fluence';
import { krasnodar } from '@fluencelabs/fluence-network-environment';

function App() {

  useEffect(() => {
    // Fluence.start({ connectTo: krasnodar[0] });
  })

  return (
    <div className="App">
      <Router>
        <Navigation />
        <Routes>
          <Route path="/node" element={<NodeAccount/>} />
          <Route path="/my" element={<MyShop/>} />
          <Route path="/wrapping" element={<Wrapping/>} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
