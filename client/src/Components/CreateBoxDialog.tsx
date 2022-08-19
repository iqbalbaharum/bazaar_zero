import * as React from 'react';
import { useState } from 'react'
import { Card, Dialog, Classes, Button, Elevation, Icon, IconSize, Spinner, SpinnerSize } from "@blueprintjs/core";

import AssetWrapperAbi from "../artifacts/AssetWrapper.json"
import { generate_proof } from '../_aqua/node'

import {ethers} from 'ethers'


type Prop = {
  isOpen?: boolean,
  handleClose: any
}

interface MintingState {
  isProcessing: Boolean, 
  verified: Boolean,
  minting: Boolean,
  accepted: Boolean
}

const CreateBoxDialog: React.FC<Prop> = (prop: Prop) => {

  const [state, setState] = useState<MintingState>({
    isProcessing: false,
    verified: false,
    minting: false,
    accepted: false
  })

  const mint = async () => {

    setState(e => ({
      ...e,
      isProcessing: true
    }))

    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
      await provider.send("eth_requestAccounts", []);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(process.env.REACT_APP_CONTRACT_ASSET_WRAPPER as string, AssetWrapperAbi.abi, signer)

      const subscriptionName = ethers.utils.formatBytes32String("bazaar zero")
      const groupId = BigInt(ethers.utils.solidityKeccak256(['bytes32'], [subscriptionName])) >> BigInt(8)
      
      let account = await signer.getAddress()
      const proof = await generate_proof(account)

      setState(e => ({
        ...e,
        verified: true
      }))
    } catch (e) {
      console.log(e)
      setState({
        isProcessing: false,
        verified: false,
        minting: false,
        accepted: false
      })
    }
  }

  const handleClose = () => {
    setState({
      isProcessing: false,
      verified: false,
      minting: false,
      accepted: false
    })

    prop.handleClose()
  }

  const SpinnerCompletion = (prop : any) => {
    return (
      prop.flag ? (
        <Icon icon="tick-circle" size={IconSize.LARGE} color='green' />
      ) : (
        <Spinner
          size={15}
          intent="success"
        />
      )
    )
  }

  return (
    <Dialog isOpen={prop.isOpen} onClose={prop.handleClose}>
      <div className={Classes.DIALOG_BODY}>
        <Card elevation={Elevation.TWO} className='table-list' >
          Verify (Generate proof)
          <span className='icon-right'>
            {state.isProcessing && <SpinnerCompletion flag={state.verified} />}
          </span>
        </Card>
        <Card elevation={Elevation.TWO} className='table-list' >
          Accept term and condition
          <span className='icon-right'>
          {state.isProcessing && <SpinnerCompletion flag={state.accepted} />}
          </span>
        </Card>
        <Card elevation={Elevation.TWO}className='table-list' >
          Minting
          <span className='icon-right'>
          {state.isProcessing && <SpinnerCompletion flag={state.minting} />}
          </span>
        </Card>
      </div>
      <DialogFooter handleClose={handleClose} />
    </Dialog>
  )

  function DialogFooter(props: { handleClose: (e: React.MouseEvent) => void }) {
    return (
        <div className={Classes.DIALOG_FOOTER}>
            <div className={Classes.DIALOG_FOOTER_ACTIONS}>
              <Button intent="success" onClick={mint}>Mint NFT</Button>
              <Button onClick={props.handleClose}>Complete</Button>
            </div>
        </div>
    );
  }
}

export default CreateBoxDialog