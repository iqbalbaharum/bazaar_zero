import * as React from 'react';
import {useState} from 'react'

import { H1, Button } from '@blueprintjs/core'
import { Container, Row, Col } from 'react-grid-system';

import { ETHAuth } from '@0xsequence/ethauth'
import { sequence } from '0xsequence'
import ListedProductBox from '../Components/ListedProductBox';

const Shelves = () => {
  
  const walletAppURL = process.env.REACT_APP_WALLET_APP_URL || 'https://sequence.app'
  const network = 'polygon'
  sequence.initWallet(network, { walletAppURL })

  const [address, setAddress] = useState("")

  async function openWallet(authorize: boolean = false) {
    const wallet = sequence.getWallet()
    const connectDetails = await wallet.connect({
      app: 'Bazaar Zero',
      authorize: true,
      settings: {
        theme: 'indigoDark',
        bannerUrl: ``,
        includedPaymentProviders: ['moonpay'],
        defaultFundingCurrency: 'matic',
        defaultPurchaseAmount: 111
      }
    })

    console.log('user accepted connect?', connectDetails.connected)
    console.log('users signed connect proof to valid their account address:', connectDetails.proof)

    const ethAuth = new ETHAuth()

    if (connectDetails.proof) {
      const decodedProof = await ethAuth.decodeProof(connectDetails.proof.proofString, true)

      const isValid = await wallet.utils.isValidTypedDataSignature(
        await wallet.getAddress(),
        connectDetails.proof.typedData,
        decodedProof.signature,
        await wallet.getAuthChainId()
      )

      if (!isValid) throw new Error('sig invalid')
      
      const address = await wallet.getAddress()
      setAddress(address)
    }
  }

  return (
    <Container>
      <Row style={{ height: '80px' }} align="center"><H1>My Shelves</H1></Row>
      <Row style={{ height: '50px' }} align="center" justify="center">
        {!address ?
          <Button text="Connect Sequence" onClick={() => openWallet()} /> : <a target="_blank" href="https://sequence.app" rel="noreferrer">{address}</a>
        }
      </Row>
      {address && <Row>
        <Col sm={4}>
          <ListedProductBox title='Lorem ipsum dolor sit amet, consectetur adipiscing elit' description='Phasellus lobortis cursus urna, at blandit dui pretium eget. Nam luctus risus sed libero ullamcorper, id ornare nisi eleifend. Cras quis convallis libero, viverra semper mi. Vestibulum facilisis tortor ut turpis dapibus tincidunt. Vivamus nibh lectus, imperdiet ac arcu id, lacinia venenatis odio. Ut pulvinar velit non quam volutpat, non accumsan felis malesuada. Sed consectetur accumsan metus a volutpat. ' />
        </Col>
        <Col sm={4}>
          <ListedProductBox title='Vivamus semper elementum sem et sodales' description='Pellentesque eu elit vestibulum, facilisis nisl ut, vestibulum elit. Aliquam erat volutpat. Sed fringilla rutrum ante condimentum viverra. Fusce sed tempus nulla. Aenean rhoncus ultrices semper. Nullam et ex bibendum, hendrerit magna ac, faucibus risus. Cras at feugiat libero, sed molestie sem.' />
        </Col>
      </Row>}
    </Container>
  )
}

export default Shelves