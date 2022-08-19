import * as React from 'react';
import { useState, useEffect } from 'react'

import { H1 } from '@blueprintjs/core'
import { Container, Row, Col } from 'react-grid-system';
import ListedProductBox from '../Components/ListedProductBox';
import CreateBoxButton from '../Components/CreateBoxButton';
import WalletItemDrawer from '../Components/WalletItemDrawer';
import CreateBoxDialog from '../Components/CreateBoxDialog';
import { sequence } from '0xsequence';
import useSequence from '../Hook/useSequence';

const MyShop = () => {

  const [open, isOpen] = useState(false)
  const [createDialogOpen, isCreateDialogOpened] = useState(false)
  const [nfts, setNFTs] = useState<any[]>([])
  const [loaded, setLoaded] = useState(false)

  const sequenceWallet = useSequence()

  useEffect(() => {
    
    (async () => {
      if(loaded) return

      const indexer = new sequence.indexer.SequenceIndexerClient(sequence.indexer.SequenceIndexerServices.POLYGON_MUMBAI)
      if(sequenceWallet.account) {
        const wrappedNFTs = await indexer.getTokenBalances({
          accountAddress: sequenceWallet.account,
          includeMetadata: true,
          contractAddress: process.env.REACT_APP_CONTRACT_ASSET_WRAPPER
        })
  
        setNFTs(wrappedNFTs.balances)
        setLoaded(true)
      }

    }) ()

  }, [sequenceWallet, loaded])

  const handleClose = () => {
    isOpen(false)
  }

  const toggleDrawer = () => {
    isOpen(!open)
  }

  const toggleCreateDialog = () => {
    isCreateDialogOpened(!createDialogOpen)
  }

  const ProductList = () => {

    return (
      <Col sm={4}>
        {nfts.map((nft) => {
          return (
            <ListedProductBox 
              title={nft.tokenMetadata?.name as string}
              description={nft.tokenMetadata?.description as string}
              onClick={toggleDrawer} />
          )
        })}
      </Col>
    )
  }

  return (
    <Container>
      <Row style={{ height: '80px' }} align="center"><H1>My Shelves</H1></Row>
      <Row>
        <CreateBoxButton onClick={toggleCreateDialog} />
        <CreateBoxDialog isOpen={createDialogOpen} handleClose={toggleCreateDialog} />
        <ListedProductBox 
              title="Title"
              description="Bundle #1"
              onClick={toggleDrawer} />
        <ProductList />
        <WalletItemDrawer handleClose={handleClose} isOpen={open} />
      </Row>
    </Container>
  )
}

export default MyShop