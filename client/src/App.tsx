import React, { useEffect } from 'react';
import './App.css';

import {BrowserRouter as Router, Route, Routes} from 'react-router-dom'

import Navigation from './Components/Navigation'

import MyAssets from './Pages/MyAssets'
import Shelves from './Pages/Shelves'
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
          <Route path="/shelves" element={<Shelves/>} />
          <Route path="/assets" element={<MyAssets/>} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
