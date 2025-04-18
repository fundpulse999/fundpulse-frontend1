import { ethers } from "ethers"

export const connectWallet = async () => {
  if (window.ethereum) {
    try {
      // Request account access
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" })

      // Get the first account
      const address = accounts[0]

      // Create a provider
      const provider = new ethers.providers.Web3Provider(window.ethereum)

      return {
        address,
        provider,
        connected: true,
      }
    } catch (error) {
      console.error("User denied account access")
      return {
        address: "",
        provider: null,
        connected: false,
      }
    }
  } else {
    console.error("Ethereum object not found, install MetaMask")
    alert("Please install MetaMask to use this feature")
    return {
      address: "",
      provider: null,
      connected: false,
    }
  }
}

export const getWalletBalance = async (provider, address) => {
  if (!provider || !address) return "0"

  try {
    const balance = await provider.getBalance(address)
    return ethers.utils.formatEther(balance)
  } catch (error) {
    console.error("Error getting balance:", error)
    return "0"
  }
}

export const sendTransaction = async (provider, toAddress, amount) => {
  if (!provider || !toAddress || !amount) return { success: false, message: "Invalid parameters" }

  try {
    const signer = provider.getSigner()
    const tx = await signer.sendTransaction({
      to: toAddress,
      value: ethers.utils.parseEther(amount.toString()),
    })

    return {
      success: true,
      message: "Transaction sent",
      hash: tx.hash,
    }
  } catch (error) {
    console.error("Error sending transaction:", error)
    return {
      success: false,
      message: error.message || "Transaction failed",
    }
  }
}
