import * as React from 'react';
import { Container, Row, Col } from 'react-grid-system';
import { ETHAuth } from '@0xsequence/ethauth'
import { sequence } from '0xsequence'

import { Button } from "@blueprintjs/core";
import useSequence from '../Hook/useSequence';

const Login = () => {

  const { account } = useSequence()

  const onHandleSequenceWallet = async () => {
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
    }
  }

  return (
    <Container fluid>
      <Row style={{ height: '80px' }} align="center">&nbsp;</Row>
      <Row align="center">
        <Col sm={3}>&nbsp;</Col>
        <Col sm={5}>
          <Button large={true} intent="success" text="Logged In" onClick={onHandleSequenceWallet} />
        </Col>
      </Row>
    </Container>
  )
}

export default Login