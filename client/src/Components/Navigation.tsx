import * as React from 'react';
import { useNavigate } from "react-router-dom";
import { Alignment, Classes, Navbar, NavbarGroup, NavbarHeading, NavbarDivider, Button } from '@blueprintjs/core'

const Navigation = () => {

  const navigate = useNavigate() 

  return (
    <Navbar>
      <NavbarGroup align={Alignment.RIGHT}>
        <NavbarHeading>Bazaar Zero</NavbarHeading>
        <NavbarDivider />
        <Button intent="success" text="Account" onClick={() => navigate('/node')} />
        <NavbarDivider />
        <Button className={Classes.MINIMAL} text="Shelves" onClick={() => navigate('/shelves')} />
        <Button className={Classes.MINIMAL} text="My Assets" onClick={() => navigate('/assets')}/>
      </NavbarGroup>
    </Navbar>
  )
}

export default Navigation