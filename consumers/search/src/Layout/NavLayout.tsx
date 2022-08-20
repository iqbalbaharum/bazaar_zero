
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom'
import Navigation from '../Components/Navigation'

import Search from '../Pages/Search'

const NavLayout = () => {      
  return (
    <Router>
      <Navigation />
      <Routes>
        <Route path="/" element={<Search/>} />
      </Routes>
    </Router>
  )
}

export default NavLayout