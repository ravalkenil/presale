// src/contracts/CrotchPresale.js
import { ethers } from 'ethers';
import CrotchPresaleABI from './CrotchPresaleABI.json';

const CROTCH_PRESALE_ADDRESS = "YOUR_CONTRACT_ADDRESS"; // Replace with your contract address

// Function to get the signer for transactional calls
const getSigner = async () => {
  if (window.ethereum) {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []); // Request account access
    return provider.getSigner();
  } else {
    throw new Error("No crypto wallet found. Please install MetaMask.");
  }
};

// Function to get the provider for read-only calls
const getProvider = () => {
  if (window.ethereum) {
    return new ethers.providers.Web3Provider(window.ethereum);
  } else {
    throw new Error("No crypto wallet found. Please install MetaMask.");
  }
};

const CrotchPresale = {
  // Write Functions (Transactional)

  async startPresale(duration) {
    const signer = await getSigner();
    const contract = new ethers.Contract(CROTCH_PRESALE_ADDRESS, CrotchPresaleABI, signer);
    const tx = await contract.startPresale(duration);
    return tx.wait();
  },

  async buyTokens() {
    const signer = await getSigner();
    const contract = new ethers.Contract(CROTCH_PRESALE_ADDRESS, CrotchPresaleABI, signer);
    const tokenPrice = await contract.tokenPrice();
    const tx = await contract.buyTokens({
      value: tokenPrice, // Fetch token price for exact ETH value
    });
    return tx.wait();
  },

  async endPresale() {
    const signer = await getSigner();
    const contract = new ethers.Contract(CROTCH_PRESALE_ADDRESS, CrotchPresaleABI, signer);
    const tx = await contract.endPresale();
    return tx.wait();
  },

  async getPresaleStartTime() {
    const provider = getProvider();
    const contract = new ethers.Contract(CROTCH_PRESALE_ADDRESS, CrotchPresaleABI, provider);
    const startTime = await contract.presaleStart();
    return startTime.toNumber(); // Convert BigNumber to normal number
  },

  async getPresaleEndTime() {
    const provider = getProvider();
    const contract = new ethers.Contract(CROTCH_PRESALE_ADDRESS, CrotchPresaleABI, provider);
    const endTime = await contract.presaleEnd();
    return endTime.toNumber();
  },

  async distributeRewards() {
    const signer = await getSigner();
    const contract = new ethers.Contract(CROTCH_PRESALE_ADDRESS, CrotchPresaleABI, signer);
    const tx = await contract.distributeRewards();
    return tx.wait();
  },

  async addToRewardsPool(amount) {
    const signer = await getSigner();
    const contract = new ethers.Contract(CROTCH_PRESALE_ADDRESS, CrotchPresaleABI, signer);
    const tx = await contract.addToRewardsPool({
      value: ethers.utils.parseEther(amount),
    });
    return tx.wait();
  },

  async withdrawFunds() {
    const signer = await getSigner();
    const contract = new ethers.Contract(CROTCH_PRESALE_ADDRESS, CrotchPresaleABI, signer);
    const tx = await contract.withdrawFunds();
    return tx.wait();
  },

  // Read-Only Functions (Getter)

  async getPresaleStatus() {
    const provider = getProvider();
    const contract = new ethers.Contract(CROTCH_PRESALE_ADDRESS, CrotchPresaleABI, provider);
    const status = await contract.getPresaleStatus();
    return status;
  },

  async getTokenPrice() {
    const provider = getProvider();
    const contract = new ethers.Contract(CROTCH_PRESALE_ADDRESS, CrotchPresaleABI, provider);
    const tokenPrice = await contract.tokenPrice();
    return ethers.utils.formatEther(tokenPrice); // Convert from Wei to Ether
  },

  async getRewardsPoolBalance() {
    const provider = getProvider();
    const contract = new ethers.Contract(CROTCH_PRESALE_ADDRESS, CrotchPresaleABI, provider);
    const balance = await contract.getRewardsPoolBalance();
    return ethers.utils.formatEther(balance);
  },

  async getHardCap() {
    const provider = getProvider();
    const contract = new ethers.Contract(CROTCH_PRESALE_ADDRESS, CrotchPresaleABI, provider);
    const hardCap = await contract.getHardCap();
    return ethers.utils.formatEther(hardCap);
  },

  async getSoftCap() {
    const provider = getProvider();
    const contract = new ethers.Contract(CROTCH_PRESALE_ADDRESS, CrotchPresaleABI, provider);
    const softCap = await contract.getSoftCap();
    return ethers.utils.formatEther(softCap);
  },
};

export default CrotchPresale;
