import { Card, Elevation, H5 } from "@blueprintjs/core"
import { useEthers } from "@usedapp/core"
import { Contract, ethers } from "ethers"
import { useState } from "react"
import { Col, Row } from "react-grid-system"
import useFetch from "use-http"
import AssetWrapperAbi from "../../artifacts/AssetWrapper.json"

import erc721abi from "../../artifacts/erc721.json"
import erc1155abi from "../../artifacts/erc1155.json"
import useSequence from "../../Hook/useSequence"

type Prop = {
  onClick?: any,
  selectedBundleId: string
}

interface State {
  amount: number
}

const TabNFT: React.FC<Prop> = (prop: Prop) => {

  const { account } = useEthers()
  const sequenceWallet = useSequence()
  
  const onDeposit = async (data: any) => {

    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
      await provider.send("eth_requestAccounts", []);
      const signer = provider.getSigner();

      const contract = new ethers.Contract(process.env.REACT_APP_CONTRACT_ASSET_WRAPPER as string, AssetWrapperAbi.abi, signer)

      let account = await signer.getAddress()

      const gasPrice = await provider.getGasPrice()
      const gas_price = Math.round(gasPrice.toNumber() * 1.2)
      console.log({ gas_price })

      let appContract: Contract, seqContract: Contract

      if(data.contract_type === 'ERC721') {
        appContract = new ethers.Contract(data.token_address as string, erc721abi, signer)
        seqContract = new ethers.Contract(data.token_address as string, erc721abi, sequenceWallet.wallet?.getSigner())
      } else {
        appContract = new ethers.Contract(data.token_address as string, erc1155abi, signer)
        seqContract = new ethers.Contract(data.token_address as string, erc1155abi, sequenceWallet.wallet?.getSigner())
      }

      if(!await appContract.isApprovedForAll(account, process.env.REACT_APP_CONTRACT_ASSET_WRAPPER)) {
        await appContract.setApprovalForAll(process.env.REACT_APP_CONTRACT_ASSET_WRAPPER, true)
      }

      let tx

      if(data.contract_type === 'ERC721') {
        tx = await contract.depositERC721(
          data.token_address, 
          data.token_id,
          prop.selectedBundleId,
          'A ERC721 NFT' )
      } else if(data.contract_type === 'ERC1155') {
        tx = await contract.depositERC1155(
          data.token_address, 
          data.token_id,
          1,
          prop.selectedBundleId,
          'A ERC1155 NFT')
      }

      await tx.wait()

      if(!await seqContract.isApprovedForAll(sequenceWallet.account, process.env.REACT_APP_CONTRACT_ASSET_WRAPPER)) {
        await seqContract.setApprovalForAll(process.env.REACT_APP_CONTRACT_ASSET_WRAPPER, true)
      }

    } catch(e) {
      console.log(e)
    }
  }

  const options = {
    headers: {
      "X-API-Key": process.env.REACT_APP_MORALIS_KEY as string
    }
  }

  const { data = [] } = useFetch(`https://deep-index.moralis.io/api/v2/${account}/nft?chain=polygon&format=decimal`, options, [])
  
  return (
    <div>
        <Row>
          {data.result && data.result.map((d, index) => {
            return (
              <Col sm={12} key={index}>
                <Card elevation={Elevation.TWO} className='table-list mt-xl' interactive={true} onClick={() => onDeposit(d)}>
                <H5>{d.name}</H5>
                <div className='bp4-text-small bp4-text-muted'>{`${d.token_address} (${d.token_id})`}</div>
                <div className='bp4-text-small bp4-text-muted'>{ d.contract_type }</div>
                </Card>
              </Col>
            )
          })}
        </Row>
    </div>
  )
}

export default TabNFT