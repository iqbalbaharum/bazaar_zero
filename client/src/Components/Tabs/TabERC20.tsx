import { Card, Elevation, H5 } from "@blueprintjs/core"
import { useEthers } from "@usedapp/core"
import { ethers } from "ethers"
import { useState } from "react"
import { Col, Row } from "react-grid-system"
import useFetch from "use-http"
import AssetWrapperAbi from "../../artifacts/AssetWrapper.json"
import abiERC20 from "../../artifacts/erc20.json"
import useSequence from "../../Hook/useSequence"

type Prop = {
  onClick?: any,
  selectedBundleId: string
}

interface State {
  amount: number
}

const TabERC20: React.FC<Prop> = (prop: Prop) => {

  const [state, setState] = useState<State>({
    amount: 10
  })

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

      let parseAmt: any, appContract: any, estimate: any

      parseAmt = ethers.utils.parseUnits(`${state.amount}`, 'ether');

      appContract = new ethers.Contract(data.token_address as string, abiERC20, signer)
      const contractSequenceSigner  = new ethers.Contract(data.token_address as string, abiERC20, sequenceWallet.wallet?.getSigner())

      let allowanceInWrappedNFT = await appContract.allowance(account, process.env.REACT_APP_CONTRACT_ASSET_WRAPPER)

      if(allowanceInWrappedNFT <= 0) {
        await appContract.approve(process.env.REACT_APP_CONTRACT_ASSET_WRAPPER, parseAmt)
      }

      let allowanceInSequenceWallet = await appContract.allowance(sequenceWallet.account, process.env.REACT_APP_CONTRACT_ASSET_WRAPPER)

      if(allowanceInSequenceWallet <= 0) {
        await contractSequenceSigner.approve(process.env.REACT_APP_CONTRACT_ASSET_WRAPPER, parseAmt)
      }

      estimate = await contract.estimateGas.depositERC20(data.token_address, parseAmt, prop.selectedBundleId, data.symbol)
      await contract.depositERC20(data.token_address, parseAmt, prop.selectedBundleId, data.symbol, {
        gasPrice: gas_price,
        gasLimit: Math.round(estimate.toNumber() * 2)
      })
    } catch(e) {
      console.log(e)
    }
  }

  const options = {
    headers: {
      "X-API-Key": process.env.REACT_APP_MORALIS_KEY as string
    }
  }

  const { data = [] } = useFetch(`https://deep-index.moralis.io/api/v2/${account}/erc20?chain=polygon&format=decimal`, options, [])
  
  return (
    <div>
        <Row>
          {data.map((d, index) => {
            return (
              <Col sm={12} key={index}>
                <Card elevation={Elevation.TWO} className='table-list mt-5' interactive={true} onClick={() => onDeposit(d)}>
                <H5>{`${d.name}`}</H5>
                <div className='bp4-text-small bp4-text-muted'>{d.token_address as string}</div>
                <div className='bp4-text-small bp4-text-muted'>{ ethers.utils.formatEther(ethers.BigNumber.from(d.balance)) } {d.symbol}</div>
                </Card>
              </Col>
            )
          })}
        </Row>
    </div>
  )
}

export default TabERC20