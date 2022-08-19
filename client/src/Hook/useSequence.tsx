import { Wallet, sequence } from '0xsequence'
import { useEffect, useState } from 'react'

const useSequence = () => {

  const [account, setAccount] = useState('')

  useEffect(() => {
    const getWallet = async (wallet: Wallet) => {
      const address = await wallet.getAddress()
      setAccount(address)
    }

    let wallet = sequence.getWallet()

    if(wallet.isConnected()) {
      getWallet(wallet)
        .catch(console.error)
    }
  }, [])

  return {
    account
  }
}

export default useSequence