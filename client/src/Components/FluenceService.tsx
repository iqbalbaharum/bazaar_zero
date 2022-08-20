import { sequence } from '0xsequence';
import * as React from 'react';
import { useEffect } from 'react'
import useSequence from '../Hook/useSequence';
import { registerShopService } from '../_aqua/node';
import { Fluence } from '@fluencelabs/fluence';

interface ProductItem {
  address: string
  id: string
  price: number
  title: string  
}

const FluenceService = () => {
  
  const sequenceWallet = useSequence()

  useEffect(() => {

    const getItems = async() => {
      const indexer = new sequence.indexer.SequenceIndexerClient(sequence.indexer.SequenceIndexerServices.POLYGON_MUMBAI)
      if(sequenceWallet.account) {
        const wrappedNFTs = await indexer.getTokenBalances({
          accountAddress: sequenceWallet.account,
          includeMetadata: true,
          contractAddress: process.env.REACT_APP_CONTRACT_ASSET_WRAPPER
        })

        return wrappedNFTs.balances.map((nft) => {
          return {
            address: nft.contractAddress,
            id: nft.tokenID,
            title: `Bundle #${nft.tokenID}`,
            price: 0
          }
        }) as ProductItem[]
      } else {
        return []
      }
    }

    try {
      registerShopService({
        list: async () => {
          return await getItems()
        },
        list_by_keyword: (search: string) => {
          return getItems()
        }
      })

      console.log(Fluence.getPeer())
    } catch(e) {
      console.log(e)
    }
    
  }, [sequenceWallet])

  return (<div></div>)
}

export default FluenceService