
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom'
import Navigation from '../Components/Navigation'

import Login from '../Pages/Login'
import Wrapping from '../Pages/Wrapping'
import MyShop from '../Pages/MyShop'
import NodeAccount from '../Pages/NodeAccount'

const NavLayout = () => {      
  return (
    <Router>
      <Navigation />
      <Routes>
        <Route path="/login" element={<Login/>} />
        <Route path="/node" element={<NodeAccount/>} />
        <Route path="/my" element={<MyShop/>} />
        <Route path="/wrapping" element={<Wrapping/>} />
      </Routes>
    </Router>
  )
}

export default NavLayout