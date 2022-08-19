import * as React from 'react';
import { useState, useEffect } from 'react'

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
  const [selectedBundleId, setSelectedBundleId] = useState('')

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

  const toggleDrawer = (bundleId: string) => {
    if(!open) {
      console.log(bundleId)
      setSelectedBundleId(bundleId)
    }

    isOpen(!open)
  }

  const toggleCreateDialog = () => {
    isCreateDialogOpened(!createDialogOpen)
  }

  return (
    <Container>
      <Row className="mt-xl">
        <Col sm={3}>
          <CreateBoxButton onClick={toggleCreateDialog} />
        </Col>
        
        {nfts.map((nft) => 
          (
            <Col sm={3}>
            <ListedProductBox
              title={nft.tokenMetadata?.name as string}
              description={`Bundle #${nft.tokenID}`}
              onClick={() => toggleDrawer(nft.tokenID)} />
            </Col>
          )
        )}

        <CreateBoxDialog isOpen={createDialogOpen} handleClose={toggleCreateDialog} />
        <WalletItemDrawer handleClose={handleClose} isOpen={open} selectedBundleId={selectedBundleId} />
      </Row>
    </Container>
  )
}

export default MyShop