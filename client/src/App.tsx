import React from 'react';
import './App.css';

import {BrowserRouter as Router, Route, Routes} from 'react-router-dom'

import Navigation from './Components/Navigation'

import MyAssets from './Pages/MyAssets'
import Shelves from './Pages/Shelves'
import NodeAccount from './Pages/NodeAccount'

function App() {
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
