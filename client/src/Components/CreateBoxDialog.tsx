import * as React from 'react';
import { useState } from 'react'
import { Card, Dialog, Classes, Button, Elevation, Icon, IconSize } from "@blueprintjs/core";
import { useEthers } from '@usedapp/core';

import AssetWrapperAbi from "../../../contracts/artifacts/contracts/AssetWrapper.sol/AssetWrapper.json"

import ethers from 'ethers'


type Prop = {
  isOpen?: boolean,
  handleClose: any
}

interface MintingState {
  verified: Boolean,
  minting: Boolean
}

const CreateBoxDialog: React.FC<Prop> = (prop: Prop) => {

  const [state, setState] = useState<MintingState>({
    verified: false,
    minting: false
  })

  const mint = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
    await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(process.env.REACT_APP_CONTRACT_ASSET_WRAPPER as string, AssetWrapperAbi.abi, signer)

    const subscriptionName = ethers.utils.formatBytes32String("bazaar zero")
    const groupId = BigInt(ethers.utils.solidityKeccak256(['bytes32'], [subscriptionName])) >> BigInt(8)
    
  }

  return (
    <Dialog isOpen={prop.isOpen} onClose={prop.handleClose}>
      <div className={Classes.DIALOG_BODY}>
        <Card elevation={Elevation.TWO} className='table-list' >
          Verify and accept term and condition
          {state.verified && <Icon icon="tick-circle" className='icon-right' size={IconSize.LARGE} color='green' /> }
        </Card>
        <Card elevation={Elevation.TWO}className='table-list' >
          Minting
          {state.minting && <Icon icon="tick-circle" className='icon-right' size={IconSize.LARGE} /> }
        </Card>
      </div>
      <DialogFooter handleClose={prop.handleClose} />
    </Dialog>
  )

  function DialogFooter(props: { handleClose: (e: React.MouseEvent) => void }) {
    return (
        <div className={Classes.DIALOG_FOOTER}>
            <div className={Classes.DIALOG_FOOTER_ACTIONS}>
              <Button onClick={props.handleClose}>Complete</Button>
            </div>
        </div>
    );
  }
}

export default CreateBoxDialog