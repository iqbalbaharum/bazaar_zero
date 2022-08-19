import * as React from 'react';
import { useNavigate } from "react-router-dom";
import { Alignment, Classes, Navbar, NavbarGroup, NavbarHeading, NavbarDivider, Button } from '@blueprintjs/core'
import useSequence from '../Hook/useSequence';
import { useEthers } from '@usedapp/core';

const Navigation = () => {

  const navigate = useNavigate() 

  const { account } = useSequence()
  const ethers = useEthers()

  return (
    <Navbar>
      <NavbarGroup align={Alignment.LEFT}>
        <Button className={Classes.MINIMAL} text="My Shop" onClick={() => navigate('/my')} />
        <Button className={Classes.MINIMAL} text="Wrapper" onClick={() => navigate('/wrapping')}/>
        <NavbarDivider />
        <NavbarHeading>Sequence: {account ? account : <Button intent="success" text="Login" onClick={() => navigate('/login')} /> }</NavbarHeading>
        <NavbarDivider />
        <NavbarHeading>Polygon: {ethers.account ? ethers.account : <Button large={true} intent="success" text="Connect Metamask" onClick={() => ethers.activateBrowserWallet()} /> }</NavbarHeading>
      </NavbarGroup>
    </Navbar>
  )
}

export default Navigation