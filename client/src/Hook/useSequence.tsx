import { Wallet, sequence } from '0xsequence'
import { useEffect, useState } from 'react'

const useSequence = () => {

  const [account, setAccount] = useState('')
  const [wallet, setWallet] = useState<Wallet>()

  useEffect(() => {
    const getWallet = async (wallet: Wallet) => {
      const address = await wallet.getAddress()
      let signer = wallet.getSigner()

      setAccount(address)
      setWallet(wallet)
    }

    let wallet = sequence.getWallet()

    if(wallet.isConnected()) {
      getWallet(wallet)
        .catch(console.error)
    }
  }, [])

  return {
    account,
    wallet
  }
}

export default useSequence