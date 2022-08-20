import * as React from 'react';
import { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { Alignment, Classes, Navbar, NavbarGroup, NavbarDivider, Button, NavbarHeading, Icon } from '@blueprintjs/core'
import { useEthers } from '@usedapp/core';

import { Fluence } from '@fluencelabs/fluence';
import { krasnodar } from '@fluencelabs/fluence-network-environment';
import { registerService } from '@fluencelabs/fluence/dist/internal/compilerSupport/v3';

const Navigation = () => {

  const navigate = useNavigate()
  const ethers = useEthers()

  const [isFluenceConnected, setIsFluenceConnected] = useState(false)

  useEffect(() => {

    let id: any
    
    if(!isFluenceConnected) {
      id = setInterval(() => {

        Fluence.start({ 
          connectTo: krasnodar[0],
          defaultTtlMs: 30000
        })
          .then(() => {
            clearInterval(id);
            setIsFluenceConnected(true)
          })
      }, 10000)  
    }
    
    return () => {
      if(id) 
        clearInterval(id);
    }

  }, [isFluenceConnected, setIsFluenceConnected])

  const ConnectingText = () => {
    return (
      <strong style={{color:"orange"}}>Connecting...</strong>
    )
  }

  const ConnectedText = () => {
    return (
      <strong style={{color:"green"}}>
        Connected <Icon icon="tick-circle" color="green" /> 
      </strong>
    )
  }

  return (
    <Navbar>
      <NavbarGroup align={Alignment.RIGHT}>
        <NavbarHeading>{!isFluenceConnected ? <ConnectingText /> : <ConnectedText />}</NavbarHeading>
        <NavbarDivider />
        {ethers.account ? ethers.account : <Button intent="success" text="Connect Metamask" onClick={() => ethers.activateBrowserWallet()} /> }
      </NavbarGroup>
    </Navbar>
  )
}

export default Navigation