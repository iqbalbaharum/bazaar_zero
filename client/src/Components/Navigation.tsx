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
        <Button intent="success" text="Create Box" rightIcon="plus" onClick={() => navigate('/node')} />
        <NavbarDivider />
        <Button className={Classes.MINIMAL} text="My Shop" onClick={() => navigate('/my')} />
        <Button className={Classes.MINIMAL} text="Wrapper" onClick={() => navigate('/wrapping')}/>
      </NavbarGroup>
    </Navbar>
  )
}

export default Navigation