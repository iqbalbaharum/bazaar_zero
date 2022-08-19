import * as React from 'react';
import { useState } from 'react'
import { Card, Dialog, Classes, Button, Elevation, Icon, IconSize, Spinner, SpinnerSize } from "@blueprintjs/core";

import AssetWrapperAbi from "../artifacts/AssetWrapper.json"
import { generate_proof } from '../_aqua/node'

import {ethers} from 'ethers'
import web3 from 'web3'
import useSequence from '../Hook/useSequence';


type Prop = {
  isOpen?: boolean,
  handleClose: any
}

interface MintingState {
  isProcessing: Boolean, 
  verified: Boolean,
  minting: Boolean
}

const CreateBoxDialog: React.FC<Prop> = (prop: Prop) => {

  const [state, setState] = useState<MintingState>({
    isProcessing: false,
    verified: false,
    minting: false
  })

  const sequenceWallet = useSequence()

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

      const gasPrice = await provider.getGasPrice()
      const gas_price = Math.round(gasPrice.toNumber() * 1.2)

      const initBundle = contract
                            .initializeBundle(
                              sequenceWallet.account, 
                              groupId,
                              proof.byteSignal,
                              proof.fullProof.publicSignals.nullifierHash,
                              proof.solidityProof
                            )

      var gas_estimate = await initBundle.estimateGas({ from: account })
      gas_estimate = Math.round(gas_estimate * 1.2); 
        
      console.log({gas_price, gas_estimate})

      // await initBundle.send({
      //   from: account,
      //   gas: web3.utils.toHex(gas_estimate), 
      //   gasPrice:  web3.utils.toHex(gas_price)
      // })

      setState(e => ({
        ...e,
        minting: true
      }))

    } catch (e) {
      console.log(e)
      setState({
        isProcessing: false,
        verified: false,
        minting: false
      })
    }
  }

  const handleClose = () => {
    setState({
      isProcessing: false,
      verified: false,
      minting: false
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