import React, { useState, useEffect } from "react";
import { ethers } from "ethers";

import "../App.css";
import { BrowserProvider, Contract } from "ethers";

import Crotchabi from "../contracts/Abis/CrotchPresaleABI.json";
import Usdcabi from "../contracts/Abis/Usdcabi.json";
import CroAbi from "../contracts/Abis/Croabi.json";
import background from "../images/bg.png";
import bgcover from "../images/bgcover.png";
import eth from "../images/eth.png";
import crothc from "../images/symbol1.png";
import usdt from "../images/usdt.png";
import card from "../images/card.png";
// import { useAccount } from "wagmi";
import { useAppKit } from "@reown/appkit/react";
import {
  useAppKitAccount,
  useDisconnect,
  useAppKitProvider,
} from "@reown/appkit/react";
import { loadStripe } from "@stripe/stripe-js";

// import { Web3Button, useWeb3Modal } from "@web3modal/react";
const contractABI = Crotchabi;
const contractAddress = "0xb17337164c0AC36F43D024208e7296d6ddceA7bc";
const croAddress = "0xb849c48c48a331eB8d2e58FD0585B3478C06e74e"; // Replace with your CRO token address
const usdcAddress = "0x162f5944c1D33BAe6fC8e9a6b3641C69e852D59a";
const cortchToken = "0x2BA09Ea53F45Dc95AB69Ea5Ce3b58578c63a0d9b";

// CrotchPresaleDeployment#Cro - 0xb849c48c48a331eB8d2e58FD0585B3478C06e74e
// CrotchPresaleDeployment#Crotch - 0x2BA09Ea53F45Dc95AB69Ea5Ce3b58578c63a0d9b
// CrotchPresaleDeployment#USDC - 0x162f5944c1D33BAe6fC8e9a6b3641C69e852D59a
// CrotchPresaleDeployment#CrotchPresaleRewards - 0x3071D63c1445eDCbbB59cd27b077147C8b6a0d80

const Home = () => {
  const stripePromise = loadStripe(
    "pk_test_51QDpl8Clmd0ulklqIp55jFbdSCX2gbOD8yggJejLtJYwbLOIcT8bhDfzai72sjE6AYotXa0gBYvGduCZs6KILFxw00pwzsrbzR"
  );
  const { open, close } = useAppKit();
  const { disconnect } = useDisconnect();
  const { walletProvider } = useAppKitProvider("eip155");
  // const { address } = useAccount();
  const { address, isConnected, caipAddress, status } = useAppKitAccount();
  // const [address, setaddress] = useState("");
  const [userAddress, setUserAddress] = useState(null);
  const [contract, setcontract] = useState("");
  const [showbalance, setshowbalance] = useState(0);

  const [endTime, setendTime] = useState(0);
  const [TotalForsale, setTotalForsale] = useState(0);
  const [totalsold, settotalsold] = useState(0);
  const [TokenRatewei, setTokenRatewei] = useState(0);
  const [loading, setLoading] = useState(false);
  const [BuyLoading, setBuyLoading] = useState(false);
  const [totalbalnce, settotalbalnce] = useState(0);
  const [Crotchtoken, setCrotchtoken] = useState(0);
  const [CRObalnce, setCRObalnce] = useState(0);
  const [USDCbalnce, setUSDCbalnce] = useState(0);
  const [Ethbalance, setEthbalance] = useState(0);

  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  const [usdcRaised, setUsdcRaised] = useState(100000); // Example: 1,400,000 USDC raised
  const totalUsdcGoal = 2000000; // 2,000,000 USDC goal

  // Payment method state
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("ETH");
  // Input and balance state
  const [usdcInput, setUsdcInput] = useState("");
  const [tokenReceived, setTokenReceived] = useState("");
  const [usdcBalance, setUsdcBalance] = useState(0);
  const [croBalance, setCroBalance] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");
  const [provider, setProvider] = useState(null);
  const [showPlaceholder, setShowPlaceholder] = useState(true);

  const weiToUsd = async (weiValue) => {
    const etherValue = weiValue / Math.pow(10, 18);

    // Fetch the current ETH to USD exchange rate from CoinGecko API
    const response = await fetch(
      "https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd"
    );
    const data = await response.json();
    const ethUsdRate = data.ethereum.usd;

    // Convert Ether to USD
    const usdValue = etherValue * ethUsdRate;

    return usdValue;
  };

  const handlePaymentCard = async (amount) => {
    console.log("Done");

    // const stripe = await stripePromise;
    // const response = await fetch(
    //   "https://crotchbackend.onrender.com/create-checkout-session",
    //   {
    //     method: "POST",
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    //     body: JSON.stringify({ amount }),
    //   }
    // );
    // const session = await response.json();
    // await stripe.redirectToCheckout({ sessionId: session.id });
  };

  // const tokenRate = weiToUsd(TokenRatewei); // 1 SCROTCH = 0.000075 USDC
  // const tokenRate = 1 // 1 SCROTCH = 0.000075 USDC
  const tokenRate = 0.000075; // 1 SCROTCH = 0.000075 USDC

  //   try {
  //     let tx;
  //     if (selectedPaymentMethod === "ETH") {
  //       const requiredETH = tokenReceived * tokenRate; // Calculate ETH required
  //       tx = await contract.buyTokens(tokenReceived, selectedPaymentMethod, {
  //         value: ethers.parseEther(requiredETH.toString())
  //       });
  //     } else {
  //       // Handle CRO and USDC purchases (assuming ERC20 transfers)
  //       const tokenContract = new ethers.Contract(
  //         selectedPaymentMethod === "CRO" ? croAddress : usdcAddress,
  //         selectedPaymentMethod === "CRO" ? CroAbi : Usdcabi,
  //         provider.getSigner()
  //       );

  //       const amountInWei = ethers.parseUnits(
  //         (tokenReceived * tokenRate).toString(),
  //         selectedPaymentMethod === "CRO" ? 18 : 6 // Adjust for respective token decimals
  //       );

  //       // Approve the presale contract to spend tokens
  //       let approveTx = await tokenContract.approve(contractAddress, amountInWei);
  //       await approveTx.wait();

  //       // Now buy tokens
  //       tx = await contract.buyTokens(tokenReceived, selectedPaymentMethod);
  //     }

  //     await tx.wait();
  //     alert("Purchase successful!");
  //     // Refresh balances after purchase
  //     fetchBalances(address);
  //   } catch (error) {
  //     console.error("Error buying tokens:", error);
  //     alert("Transaction failed!");
  //   }
  // };

  const buyTokens = async () => {
    if (!contract) return;

    try {
      let tx;
      let requiredAmountInUsdc; // Variable to hold the amount in USDC
      setBuyLoading(true);
      if (selectedPaymentMethod === "ETH") {
        const requiredETH = tokenReceived * tokenRate; // Calculate the required ETH for the $CROTCH tokens
        console.log(ethers.parseEther(usdcInput.toString()));
        const tokenreciver = ethers.parseUnits(tokenReceived.toString(), 18);
        console.log(selectedPaymentMethod);

        const value = ethers.parseEther(usdcInput.toString());
        // tx = await contract.buyTokens(tokenreciver, value,selectedPaymentMethod, {
        //   value: value,
        //   gasLimit: 1000000,
        // });
        //  28000000000
        tx = await contract.buyTokens(
          tokenreciver,
          value,
          selectedPaymentMethod,
          {
            value: value,
            gasLimit: 1000000,
          }
        );
      } else if (selectedPaymentMethod === "CRO") {
        // const tokenreciver1=tokenReceived *1000000000000000000;
        // console.log("------------",usdcInput);

        // return;

        // Fetch current CRO to USDC rate
        // const croToUsdcRate = await fetchCROtoUSDC(); // Function to fetch conversion rate
        requiredAmountInUsdc = tokenReceived * tokenRate; // Required USDC for the tokens
        // const amountInCro = requiredAmountInUsdc / croToUsdcRate; // Convert required USDC to CRO
        const signer = await provider.getSigner();
        const tokenContract = new ethers.Contract(croAddress, CroAbi, signer);

        // Approve the presale contract to spend CRO tokens
        let approveTx = await tokenContract.approve(
          contractAddress,
          ethers.parseUnits(usdcInput.toString(), 18)
        ); // Assuming CRO has 18 decimals
        await approveTx.wait();
        // const tokenreciver=tokenReceived *1000000000000000000;
        const tokenreciver = ethers.parseUnits(tokenReceived.toString(), 18); // Use 18 for ETH
        const tokenpayed = ethers.parseUnits(usdcInput.toString(), 18);

        const allowance = await tokenContract.allowance(
          address,
          contractAddress
        );
        // if (allowance.lt(ethers.parseUnits(usdcInput.toString(), 18))) {
        //   console.log("Insufficient allowance. Please approve the contract.");
        //   return;
        // }
        if (Number(allowance) < ethers.parseUnits(usdcInput.toString(), 18)) {
          console.log("Insufficient allowance. Please approve the contract.");
          return;
        }
        // Now buy tokens
        // console.log(tokenreciver.toString(), (ethers.parseUnits(usdcInput.toString(), 18)).toString(),selectedPaymentMethod);

        tx = await contract.buyTokens(
          tokenreciver,
          tokenpayed,
          selectedPaymentMethod,
          { gasLimit: 1000000 }
        );
      } else if (selectedPaymentMethod === "USDC") {
        // Handle USDC payments
        const signer = await provider.getSigner();
        const tokenContract = new ethers.Contract(usdcAddress, Usdcabi, signer);
        const amountInUsdc = tokenReceived * tokenRate; // Calculate USDC required

        // Approve the presale contract to spend USDC tokens
        let approveTx = await tokenContract.approve(
          contractAddress,
          ethers.parseUnits(usdcInput.toString(), 6)
        ); // Assuming USDC has 6 decimals
        await approveTx.wait();

        // const tokenreciver=tokenReceived *1000000;
        const tokenreciver = ethers.parseUnits(tokenReceived.toString(), 18);

        const allowance = await tokenContract.allowance(
          address,
          contractAddress
        );

        // const allowanceBigNumber = ethers.BigNumber.from(allowance.toString());

        console.log(
          allowance,
          ethers.parseUnits(usdcInput.toString(), 6).toString()
        );

        if (Number(allowance) < ethers.parseUnits(usdcInput.toString(), 6)) {
          console.log("Insufficient allowance. Please approve the contract.");
          return;
        }
        // Now buy tokens
        tx = await contract.buyTokens(
          tokenreciver,
          ethers.parseUnits(usdcInput.toString(), 6),
          selectedPaymentMethod,
          { gasLimit: 1000000 }
        );
      } else if (selectedPaymentMethod === "CARD") {
        const card = await handlePaymentCard(usdcInput);
        console.log("card", card);

        return;
      }

      await tx.wait();
      setBuyLoading(false);
      alert("Purchase successful!");
      getallvalue();
      fetchBalances(address);
    } catch (error) {
      console.log("Error buying tokens:", error);
      setBuyLoading(false);
      let errorMessage = "An unknown error occurred.";

      // Extracting the specific error message
      if (error.data && error.data.message) {
        const reasonMatch = error.data.message.match(
          /execution reverted: (.*)/
        );
        if (reasonMatch) {
          errorMessage = `Error buying tokens: ${reasonMatch[1]}`;
        }
      }
      alert(errorMessage);
    }
  };

  const fetchBalances = async (account) => {
    await fetchUsdcBalance(account);
    await fetchCroBalance(account);
  };

  const fetchUsdcBalance = async (account) => {
    if (!account || !provider) return;

    const usdcContract = new ethers.Contract(usdcAddress, Usdcabi, provider);
    const balance = await usdcContract.balanceOf(account);
    setUsdcBalance(ethers.formatUnits(balance, 6)); // Adjust for USDC decimals (6)
  };

  const fetchCroBalance = async (account) => {
    if (!account || !provider) return;

    const croContract = new ethers.Contract(croAddress, CroAbi, provider);
    const balance = await croContract.balanceOf(account);
    setCroBalance(ethers.formatUnits(balance, 18)); // Adjust for CRO decimals (18)
  };
  const getallvalue = async () => {
    try {
      let provider;
      // console.log(window.ethereum);
      // console.log(isConnected);

      if (window.ethereum == undefined) {
        console.log(1);

        provider = new BrowserProvider(walletProvider);
      } else {
        console.log(0);
        provider = new BrowserProvider(window.ethereum);
      }

      setProvider(provider);

      const signer = await provider.getSigner();
      // const address = await signer.getAddress();
      // setaddress(address)
      console.log("account", address);
      
      const contract1 = new Contract(contractAddress, contractABI, signer);
      const contract = new Contract(contractAddress, contractABI, provider);
      const contractcrotch = new Contract(cortchToken, Usdcabi, provider);

      console.log(contractcrotch);
      let userbalnce;
      try {
        userbalnce = await contractcrotch.balanceOf(address);
        console.log(userbalnce);
      } catch (error) {
        console.log(error);
      }

      console.log(userbalnce);
      setCrotchtoken(Number(userbalnce) / 1000000000000000000);
      setcontract(contract1);
      const balance = await provider.getBalance(address);
      const balanceInEth = ethers.formatEther(balance);
      console.log("balance", balanceInEth.toString());
      setEthbalance(Number(balanceInEth.toString()).toFixed(3));

      const contractCRO = new ethers.Contract(croAddress, CroAbi, signer);
      const balanceCRO = await contractCRO.balanceOf(address);
      const weiinbalance = balanceCRO.toString() / 1000000000000000000;
      setCRObalnce(weiinbalance);

      const USDCcontract = new ethers.Contract(usdcAddress, Usdcabi, signer);
      const USDCbalance = await USDCcontract.balanceOf(address);
      const USDCweiinbalance = USDCbalance.toString() / 1000000;
      setUSDCbalnce(USDCweiinbalance);
      if (selectedPaymentMethod === "ETH") {
        settotalbalnce(Number(balanceInEth.toString()).toFixed(3));
      } else if (selectedPaymentMethod === "CRO") {
        settotalbalnce(weiinbalance);
      } else if (selectedPaymentMethod === "USDC") {
        settotalbalnce(USDCweiinbalance);
      }
      setLoading(false);
      const totalTokensForPresale = await contract.totalTokensForPresale();
      setTotalForsale(Number(totalTokensForPresale));
      console.log(totalTokensForPresale.toString());
      const totalRaised = await contract.tokensSold();
      const getendTime = await contract.presaleEnd();
      console.log(getendTime);
      setendTime(Number(getendTime));
      settotalsold(Number(totalRaised) / 1000000000000000000);
      // console.log(Number(totalRaised)/100000000000000000);

      const Tokenrate = await contract.tokenPrice();
      setTokenRatewei(Tokenrate.toString());
      setLoading(false);
      console.log(
        "-----",
        totalTokensForPresale.toString(),
        totalRaised.toString()
      );
      // console.log("endpresale",);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (isConnected) {
      getallvalue();
    }
  }, [isConnected]);

  useEffect(() => {
    const timefetcher=async()=>{
      try {
        let provider;
        if (window.ethereum == undefined) {
          console.log(1);
          provider = new BrowserProvider(walletProvider);
        } else {
          console.log(0);
          provider = new BrowserProvider(window.ethereum);
        }
        // console.log("account", address);
        const contract = new Contract(contractAddress, contractABI, provider);
        const totalRaised = await contract.tokensSold();
        const getendTime = await contract.presaleEnd();
        setendTime(Number(getendTime));
        settotalsold(Number(totalRaised) / 1000000000000000000);
        const totalTokensForPresale = await contract.totalTokensForPresale();
        console.log(Number(getendTime),Number(totalRaised)/1000000000000000000,totalTokensForPresale.toString());

        setTotalForsale(Number(totalTokensForPresale));
      } catch (error) {
        console.error(error)
      }
    }

    timefetcher()
  }, [])
  

  const maxsendtoken = async () => {
    try {
      console.log(isConnected);

      if (isConnected) {
        if (selectedPaymentMethod === "ETH") {
          const balance = await provider.getBalance(address);
          const balanceInEth = ethers.formatEther(balance);
          console.log("balance", balanceInEth.toString());
          setUsdcInput(Number(balanceInEth.toString()).toFixed(3));

          // setshowbalance((balanceInEth.toString()))
        } else if (selectedPaymentMethod === "CRO") {
          const signer = await provider.getSigner();
          const contract = new ethers.Contract(croAddress, CroAbi, signer);
          const balance = await contract.balanceOf(address);
          const weiinbalance = balance.toString() / 1000000000000000000;
          console.log(weiinbalance);
          setUsdcInput(weiinbalance);
          // usdcInput(weiinbalance);
          // setshowbalance(weiinbalance)
        } else if (selectedPaymentMethod === "USDC") {
          console.log(provider);
          console.log(provider.getSigner());

          const signer = await provider.getSigner();
          const contract = new Contract(usdcAddress, Usdcabi, signer);
          const balance = await contract.balanceOf(address);
          const weiinbalance = balance.toString() / 1000000;
          console.log("---weibalance", weiinbalance);
          setUsdcInput(weiinbalance);
          // usdcInput(weiinbalance);
          // setshowbalance(weiinbalance);
        }
      } else {
        setErrorMessage(
          "Please connect your wallet to proceed with the transaction"
        );
        setShowModal(true);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Timer logic
  useEffect(() => {
    const calculateTimeLeft = async () => {
      const now = Math.floor(Date.now() / 1000); // Get current Unix timestamp in seconds
      const timeDiff = endTime - now; // Time left in seconds
      if (timeDiff <= 0) {
        return {
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
        };
      }
      const days = Math.floor(timeDiff / (3600 * 24));
      const hours = Math.floor((timeDiff % (3600 * 24)) / 3600);
      const minutes = Math.floor((timeDiff % 3600) / 60);
      const seconds = timeDiff % 60;
      return { days, hours, minutes, seconds };
    };

    const interval = setInterval(async () => {
      setTimeLeft(await calculateTimeLeft());
    }, 1000);

    return () => clearInterval(interval);
  }, [endTime]);

  // Calculate tokens received based on USDC input
  // useEffect(() => {
  //   setTokenReceived(usdcInput / tokenRate);
  // }, [usdcInput]);
  const calculateTokenAmount = async () => {
    try {
      if (selectedPaymentMethod === "ETH") {
        settotalbalnce(Ethbalance);
        // const ethToUsdcRate = await fetchETHtoUSDC();
        // setTokenReceived((usdcInput / ethToUsdcRate) / tokenRate); // Convert USDC to token amount
        setTokenReceived(usdcInput * 1000); // Convert USDC to token amount
      } else if (selectedPaymentMethod === "CRO") {
        settotalbalnce(CRObalnce);
        // const croToUsdcRate = await fetchCROtoUSDC();
        // setTokenReceived((usdcInput / croToUsdcRate) / tokenRate); // Convert USDC to token amount
        setTokenReceived(usdcInput * 2); // Convert USDC to token amount
      } else if (selectedPaymentMethod === "USDC") {
        settotalbalnce(USDCbalnce);
        // setTokenReceived(usdcInput / tokenRate); // For USDC, directly divide by token rate

        setTokenReceived(usdcInput * 1); // For USDC, directly divide by token rate
      } else if (selectedPaymentMethod === "CARD") {
        settotalbalnce(0);
        setTokenReceived(usdcInput * 1);
      } else {
        settotalbalnce(0);
        setTokenReceived(0);
      }
    } catch (error) {}
  };

  useEffect(() => {
    calculateTokenAmount();
  }, [usdcInput, selectedPaymentMethod, address, isConnected]);

  const conversionRates = {
    ETH: 1000, // For example: 1 ETH = 3 $CROTCH
    CRO: 2, // For example: 1 CRO = 2 $CROTCH
    USDC: 1, // For example: 1 USDC = 4 $CROTCH
    CARD: 1,
  };

  useEffect(() => {
    setUsdcInput(0);
  }, [selectedPaymentMethod]);

  const handleDisconnect = async () => {
    try {
      disconnect();
      // Additional logic to update UI or state after disconnecting
    } catch (error) {
      console.error("Failed to disconnect:", error);
    }
  };

  const fetchETHtoUSDC = async () => {
    const response = await fetch(
      "https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd"
    );
    const data = await response.json();
    return data.ethereum.usd; // Get the ETH to USD rate
  };

  const fetchCROtoUSDC = async () => {
    const response = await fetch(
      "https://api.coingecko.com/api/v3/simple/price?ids=cronos&vs_currencies=usd"
    );
    const data = await response.json();
    return data.cronos.usd; // Assuming CRO is named 'cronos' in CoinGecko
  };

  const imageMapping = {
    ETH: eth,
    CRO: crothc,
    USDC: usdt,
    CARD: card,
  };

  const maxAmount = totalbalnce;
  const [showModal, setShowModal] = useState(false);

  const handleInputChange = (e) => {
    const value = e.target.value;
    if (value === "" || !isNaN(value)) {
      const numericValue = value;
      if (selectedPaymentMethod === "CARD") {
        setUsdcInput(numericValue);
      } else {
        if (isConnected) {
          if (numericValue !== "" && numericValue > maxAmount) {
            setErrorMessage(
              `You do not have enough funds for this transaction, please top up your source currency or use another payment method`
            );
            setShowModal(true);
          } else {
            setErrorMessage(""); // Clear error message if the input is valid
            setShowModal(false); // Close modal if input is valid
            setUsdcInput(numericValue);
          }
          // Show modal when there's an error
        } else {
          setErrorMessage(""); // Clear error message if the input is valid
          setShowModal(false); // Close modal if input is valid
          setUsdcInput(numericValue);
        }
      }
    }
  };

  const handleCrotchInputChange = (e) => {
    const value = e.target.value;
    if (value === "" || !isNaN(value)) {
      const numericValue = value;
      // setCrotchInput(numericValue);

      setTokenReceived(numericValue); // Set corresponding currency value
      const rate = conversionRates[selectedPaymentMethod];
      setUsdcInput(value / rate);
    }
  };

  // const handleInputChange = (e) => {
  //   const value = e.target.value;

  //   // Allow empty input for backspace
  //   if (value === "" || !isNaN(value)) {
  //     const numericValue = value === "" ? "" : parseFloat(value);

  //     if (numericValue !== "" && numericValue > maxAmount) {
  //       setErrorMessage(
  //         `You do not have enough funds for this transaction, please top up your source currency or use another payment method `
  //       );
  //     } else {
  //       setErrorMessage(""); // Clear error message if the input is valid
  //       setUsdcInput(numericValue);
  //     }
  //   }
  // };

  const ErrorModal = ({ message, onClose }) => {
    if (!message) return null; // Do not render if there's no message

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-11/12 sm:w-2/3 lg:w-1/3 shadow-lg">
          <h3 className="text-lg font-bold text-red-500 mb-4">Message</h3>
          <p className="text-gray-800 mb-6">{message}</p>
          <button
            onClick={onClose}
            className="bg-gradient-to-r from-[#6DE922] to-[#C1F126] text-black font-semibold py-2 px-4 rounded hover:bg-red-600 focus:outline-none transition duration-200"
          >
            Close
          </button>
        </div>
      </div>
    );
  };

  // Dynamic progress bar width
  const progressPercentage = (totalsold / TotalForsale) * 100;

  const [placeholder, setPlaceholder] = useState("0");
  const handleFocus = () => {
    setPlaceholder("");
  };

  const handleBlur = () => {
    if (usdcInput === "") {
      setPlaceholder("0");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center  p-4 sm:p-6 md:p-10">
      {showModal && (
        <ErrorModal
          message={errorMessage}
          onClose={() => {
            setShowModal(false); // Close the modal
            setErrorMessage(""); // Clear error message
          }}
        />
      )}
      <div
        className="relative bg-cover bg-center rounded-[30px]  shadow-2xl w-full sm:w-[90%] max-w-3xl"
        style={{ backgroundImage: `url(${background})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-[#1c45f2]  to-[#7f0599] opacity-90 rounded-[30px]"></div>

        <div className="relative  p-6 sm:p-8 md:p-10 text-white rounded-[30px]  shadow-lg ">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center font-sans mb-6 text-shadow ">
            🚀 Time until presale ends
          </h1>

          <div className="flex flex-wrap justify-center gap-4 sm:gap-6 mb-6 sm:mb-8">
            {loading ? (
              <div className="">
                <div className="spinner"></div>
              </div>
            ) : (
              Object.keys(timeLeft).map((unit) => (
                <div
                  key={unit}
                  className="bg-white text-black font-thin element rounded-2xl py-2 sm:py-4 px-2 sm:px-4 text-center shadow-[0_10px_30px_rgba(0,0,0,0.6)] w-20 sm:w-24 md:w-34 h-12 sm:h-14 md:h-16 flex flex-col items-center justify-center transform transition-transform duration-300 hover:scale-105"
                >
                  <p className="text-2xl sm:text-3xl md:text-4xl font-bold font-sansman">
                    {timeLeft[unit]}
                    {unit.charAt(0).toLowerCase() + unit.slice(7)}
                  </p>
                </div>
              ))
            )}
          </div>

          <div className="mb-4 sm:mb-6 flex flex-col items-center">
            {" "}
            {/* Changed to flex-col and centered items */}
            <h2 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3 font-sans text-center">
              Total Crotch Raised in Presale:
            </h2>
            <div className="relative w-full sm:w-4/5 bg-gray-300 h-8 sm:h-10 rounded-full  shadow-[0_10px_30px_rgba(0,0,0,0.6)] overflow-hidden">
              {" "}
              {/* Set width to 80% */}
              <div
                className="bg-gradient-to-r from-[#6DE922] to-[#C1F126]   h-full transition-all duration-1000 ease-linear"
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
            <p className="text-lg sm:text-xl mt-2 font-semibold font-sans text-center mb-3">
              You purchased $CROTCH = {Crotchtoken.toLocaleString()}
            </p>
          </div>

          <h3 className="text-xl font-semibold font-sans text-center mb-3">
            Choose your payment method
          </h3>

          <div className="flex flex-wrap justify-center gap-4 sm:gap-6 mb-6 sm:mb-8">
            {["ETH", "CRO", "USDC", "CARD"].map((method) => (
              <div
                key={method}
                className={`bg-white p-3 sm:p-4 md:p-6 w-24 sm:w-28 element h-10 sm:h-12 md:h-14 rounded-2xl cursor-pointer transition-transform duration-200 transform hover:scale-105 ${
                  selectedPaymentMethod === method
                    ? "bg-gradient-to-br from-[#C1F126] to-[#C1F126]"
                    : ""
                } flex items-center justify-center space-x-2`} // Adjusted alignment
                onClick={() => setSelectedPaymentMethod(method)}
              >
                <img
                  src={imageMapping[method]}
                  alt={method}
                  className="w-5 sm:w-6 md:w-7 h-5 sm:h-6 md:h-7" // Ensure uniform size
                />
                <p className="text-center font-sans text-xs sm:text-sm md:text-base text-black font-bold">
                  {method}
                </p>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-center my-4">
            <hr className="w-28 sm:w-36 border-white" />
            <p className="text-center text-xs sm:text-sm font-sans mx-2 sm:mx-4 ">
              1 $CROTCH = $0.003
            </p>
            <hr className="w-28 sm:w-36 border-white" />
          </div>

          <div className="flex flex-col lg:flex-row items-center justify-center space-y-4 lg:space-y-0 lg:space-x-16 mb-8">
            {/* USDC Input Field */}
            <div className="w-full md:w-2/3 lg:w-1/3 relative bg-transparent md:mb-4 lg:mb-0">
              <div className="flex flex-row justify-between mb-2 font-sans font-medium text-xs">
                <p>Amount you pay in {selectedPaymentMethod}</p>
                <p
                  className="underline font-sans cursor-pointer"
                  onClick={maxsendtoken}
                >
                  {" "}
                  MAX{" "}
                </p>
              </div>

              <div className="relative">
                <input
                  type="text" // Changed to text for compatibility
                  placeholder={"0"}
                  value={usdcInput=="" ? "":usdcInput}
                  onChange={handleInputChange}
                  // onFocus={handleFocus}
                  // onBlur={handleBlur}
                  className="w-full py-4 sm:py-5 px-4 sm:px-5 font-extrabold bg-transparent block remove-arrow element rounded-lg text-xl sm:text-2xl bg-slate-100 text-black text-left transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                  style={{ backgroundColor: "rgba(241, 245 ,249, 0.8)" }}
                  // onWheel={(e) => e.preventDefault()} // Prevent scrolling on number input
                />
                <img
                  src={imageMapping[selectedPaymentMethod]}
                  alt={selectedPaymentMethod}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 w-7 h-7 sm:w-9 sm:h-9 pointer-events-none"
                />
              </div>
            </div>

            {/* $CROTCH Input Field */}
            <div className="w-full md:w-2/3 lg:w-1/3 relative">
              <div className="flex flex-row justify-between mb-2 font-medium font-sans text-xs ">
                <p>Amount Received in $CROTCH</p>
                <p className="underline font-sans cursor-pointer">MAX</p>
              </div>

              <div className="relative">
                <input
                  type="text" // Changed to text for compatibility
                  placeholder="0"
                  value={tokenReceived==""? "":tokenReceived }
                  onChange={handleCrotchInputChange}
                  className="w-full py-4 sm:py-5 px-4 sm:px-5 rounded-lg remove-arrow element text-black font-extrabold shadow-lg text-2xl transition-colors block text-left focus:outline-none focus:ring-2 focus:ring-blue-500"
                  style={{ backgroundColor: "rgba(241, 245 ,249, 0.8)" }}
                />
                <img
                  src={bgcover}
                  alt={selectedPaymentMethod}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 w-7 h-7 sm:w-9 sm:h-9 pointer-events-none"
                />
              </div>
            </div>
          </div>

          <p className="text-center font-sans text-sm sm:text-lg mb-4 sm:mb-6">
            Your {selectedPaymentMethod} Balance: ${totalbalnce}{" "}
            {selectedPaymentMethod}
          </p>

          <div className="text-center">
            {isConnected ? (
              // <div className="flex flex-col items-center">
              //   {BuyLoading ? (
              //     <button className="px-16 sm:px-20 font-sans py-3 bg-gradient-to-r from-[#6DE922] to-[#C1F126] text-black font-extrabold rounded-full shadow-lg hover:scale-105 transition-transform duration-200">
              //       <div className="spinner-border animate-spin inline-block w-5 h-5 border-4 rounded-full border-t-transparent border-[#000000]"></div>
              //     </button>
              //   ) : (
              //     <button
              //       onClick={buyTokens}
              //       className="px-12 sm:px-14  font-sans py-3 bg-gradient-to-r from-[#6DE922] to-[#C1F126] text-black font-extrabold rounded-full shadow-lg hover:scale-105 transition-transform duration-200"
              //     >
              //       Buy Tokens
              //     </button>
              //   )}
              //   <div className="flex flex-raw">
              //   <button className="px-2 mt-2 font-sans py-3 bg-gradient-to-r from-[#29333b] to-[#272921] text-black font-extrabold rounded-full shadow-lg hover:scale-105 transition-transform duration-200">
              //     <w3m-account-button />
              //   </button>
              //   <button
              //       onClick={disconnect}
              //       className="px-7 sm:px-7  font-sans py-3 bg-gradient-to-r from-[#6DE922] to-[#C1F126] text-black font-extrabold rounded-full shadow-lg hover:scale-105 transition-transform duration-200"
              //     >
              //       Disconnect Wallet
              //     </button>
              //   </div>
              //   {/* Disconnect Wallet Button */}

              // </div>

              <div className="flex flex-col items-center space-y-4">
                {/* w3m-account-button in Column */}

                {/* Buy Tokens and Disconnect Wallet in Row */}
                <div className="flex flex-row space-x-4">
                  {/* Buy Tokens Button */}
                  {BuyLoading ? (
                    <button className="px-12 sm:px-20 font-sans py-3 bg-gradient-to-r from-[#6DE922] to-[#C1F126] text-black font-extrabold rounded-full shadow-lg hover:scale-105 transition-transform duration-200">
                      <div className="spinner-border animate-spin inline-block w-5 h-5 border-4 rounded-full border-t-transparent border-[#000000]"></div>
                    </button>
                  ) : (
                    <button
                      onClick={buyTokens}
                      className="px-12 sm:px-20 font-sans py-3 bg-gradient-to-r from-[#6DE922] to-[#C1F126] text-black font-extrabold rounded-full shadow-lg hover:scale-105 transition-transform duration-200"
                    >
                      Buy Tokens
                    </button>
                  )}

                  {/* Disconnect Wallet Button */}
                  <button
                    onClick={handleDisconnect}
                    className="px-10 sm:px-16 font-sans py-3 bg-gradient-to-r from-[#6DE922] to-[#C1F126] text-black font-extrabold rounded-full shadow-lg hover:scale-105 transition-transform duration-200"
                  >
                    Disconnect Wallet
                  </button>
                </div>

                <button className="justify-between items-center px-4 sm:px-6 font-sans py-3 bg-gradient-to-r from-[#29333b] to-[#272921] text-white font-extrabold rounded-full shadow-lg hover:scale-105 transition-transform duration-200">
                  <w3m-account-button />
                </button>
              </div>
            ) : (
              <button
                onClick={() => open()}
                className="px-14 font-sans py-3 bg-gradient-to-r from-[#6DE922] to-[#C1F126] text-black font-extrabold rounded-full shadow-lg hover:scale-105 transition-transform duration-200"
              >
                CONNECT WALLET
              </button>
            )}
          </div>

          <p className="text-center font-sans mt-4 text-sm">
            Don't have a wallet?{" "}
            <a href="#" className="underline font-sans">
              Instructional video
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Home;
