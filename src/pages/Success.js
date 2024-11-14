import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import { useSearchParams } from "react-router-dom";
import Crotchabi from "../contracts/Abis/CrotchPresaleABI.json";
import { useAppKitProvider } from "@reown/appkit/react";

const Success = () => {
  const [loading, setLoading] = useState(true);
  const [transactionHash, setTransactionHash] = useState("");
  const [error, setError] = useState(null);
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("sessionId");
  const [isProcessing, setIsProcessing] = useState(false);
  const [hasProcessed, setHasProcessed] = useState(false);
  const { walletProvider } = useAppKitProvider("eip155");

  useEffect(() => {
    const fetchall = async () => {
      console.log("-------");

      const storedData =
        JSON.parse(sessionStorage.getItem("paymentData")) || {};
      const storedHash = storedData[sessionId];

      if (storedHash) {
        // If the session ID already has a stored transaction hash, show success message
        setTransactionHash(storedHash);
        setLoading(false);
      } else if (sessionId) {
        console.log("Session ID from URL:", sessionId);
        await fetchPaymentDetails();
      } else {
        setError("Session ID missing or invalid");
        setLoading(false);
      } 
    };
    fetchall();
  }, [sessionId]);

  const fetchPaymentDetails = async () => {
    try {
      const response = await fetch(
        `https://crotchbackend.onrender.com/verify-session/${sessionId}`
      );
      const data = await response.json();
      if (response.ok) {
        await handlePostPaymentSuccess(data.amount);
      } else {
        setError(data.error || "Session verification failed");
        setLoading(false);
      }
    } catch (error) {
      setError("Error verifying session");
      setLoading(false);
    }
  };

  const handlePostPaymentSuccess = async (amount) => {
    if (isProcessing || hasProcessed) return; // Prevent multiple submissions
    setIsProcessing(true); // Set processing to true

    try {
      const hash = await callSmartContract(amount);
    //   const hash = "csddvv";

      console.log(hash);
      
      setTransactionHash(hash);

      // Store the session ID and transaction hash in session storage
      sessionStorage.setItem(
        "paymentData",
        JSON.stringify({
          ...JSON.parse(sessionStorage.getItem("paymentData") || "{}"),
          [sessionId]: hash
        })
      );
      setHasProcessed(true); // Mark as processed to prevent future calls

      // Mark session as used after successful transaction
      await fetch(
        `https://crotchbackend.onrender.com/mark-session-used/${sessionId}`,
        { method: "POST" }
      );
    } catch (error) {
      console.error("Error during post-payment success:", error);
      setError("Transaction failed or could not mark session as used");
    } finally {
      setLoading(false); // Stop loading when done
      setIsProcessing(false); // Reset processing state
    }
  };

  const callSmartContract = async (amount) => {
    console.log("Calll  Smart Contract");
    let provider;

    if (window.ethereum == undefined) {
      console.log(1);
      provider = new ethers.BrowserProvider(walletProvider);
    } else {
      console.log(0);
      provider = new ethers.BrowserProvider(window.ethereum);
    }

    const signer = await provider.getSigner();
    const contractAddress = "0xb17337164c0AC36F43D024208e7296d6ddceA7bc";
    const contract = new ethers.Contract(contractAddress, Crotchabi, signer);
    const tokenReceiver = ethers.parseUnits(amount.toString(), 18);

    try {
      const transaction = await contract.buyTokens(
        tokenReceiver,
        tokenReceiver,
        "CARD",
        { gasLimit: 1000000 }
      );
      const receipt = await transaction.wait(); // Wait for the transaction to be mined
      console.log(receipt);
      
      return receipt.hash;
    } catch (error) {
      console.error("Error calling smart contract:", error);
      throw error;
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-green-100">
      {loading ? (
        <div className="flex flex-col items-center">
          <h1 className="text-2xl font-bold text-green-800">
            Processing Payment...
          </h1>
          <p className="mt-4 text-lg text-gray-700">
            Please wait while we confirm your transaction.
          </p>
        </div>
      ) : error ? (
        <div className="flex flex-col items-center">
          <h1 className="text-2xl font-bold text-red-800">Error</h1>
          <p className="mt-4 text-lg text-gray-700">{error}</p>
          <a href="/" className="mt-6 text-blue-500 hover:underline">
            Go to Home
          </a>
        </div>
      ) : (
        <>
          <h1 className="text-3xl font-bold text-green-800">
            Payment Successful!
          </h1>
          <p className="mt-4 text-lg text-gray-700">
            Thank you for your purchase. Your transaction has been completed.
          </p>
          {transactionHash && (
            <p className="mt-2 text-sm text-gray-600">
              Transaction Hash:{" "}
              <a
                href={`https://etherscan.io/tx/${transactionHash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline"
              >
                {transactionHash}
              </a>
            </p>
          )}
          <a href="/" className="mt-6 text-blue-500 hover:underline">
            Go to Home
          </a>
        </>
      )}
    </div>
  );
};

export default Success;

// Success.js
// import React, { useEffect, useState } from 'react';
// import { ethers } from "ethers";
// import Crotchabi from "../contracts/Abis/CrotchPresaleABI.json";

// const Success = () => {
//   const [loading, setLoading] = useState(true); // State to manage loading
//   const [transactionHash, setTransactionHash] = useState('');

//   useEffect(() => {
//     handlePostPaymentSuccess();
//   }, []);

//   const handlePostPaymentSuccess = async () => {
//     try {
//       const hash = await callSmartContract(); // Call the smart contract function
//       setTransactionHash(hash); // Store the transaction hash
//     } catch (error) {
//       console.error('Error during post-payment success:', error);
//     } finally {
//       setLoading(false); // Set loading to false after trying to call the smart contract
//     }
//   };

//   const callSmartContract = async () => {
//     // Connect to the Ethereum provider
//     const provider = new ethers.providers.Web3Provider(window.ethereum);
//     const signer = provider.getSigner();

//     // Create an instance of your smart contract
//     const contractAddress = '0xc9075A230418a1Ba244e2cDFe35671A768867291'; // Replace with your contract address
//     const contract = new ethers.Contract(contractAddress, Crotchabi, signer);
//     const tokenReceiver = ethers.utils.parseUnits("1", 18);

//     try {
//       // Call your smart contract function here
//       const transaction = await contract.buyTokens(tokenReceiver, tokenReceiver, "CARD", { gasLimit: 1000000 });
//       const receipt = await transaction.wait(); // Wait for the transaction to be mined

//       return receipt.transactionHash; // Return the transaction hash
//     } catch (error) {
//       console.error('Error calling smart contract:', error);
//       throw error; // You might want to handle errors appropriately
//     }
//   };

//   return (
//     <div className="flex flex-col items-center justify-center h-screen bg-green-100">
//       {loading ? ( // Conditional rendering based on loading state
//         <div className="flex flex-col items-center">
//           <h1 className="text-2xl font-bold text-green-800">Processing Payment...</h1>
//           <p className="mt-4 text-lg text-gray-700">Please wait while we confirm your transaction.</p>
//         </div>
//       ) : (
//         <>
//           <h1 className="text-3xl font-bold text-green-800">Payment Successful!</h1>
//           <p className="mt-4 text-lg text-gray-700">Thank you for your purchase. Your transaction has been completed.</p>
//           {transactionHash && ( // Show transaction hash if available
//             <p className="mt-2 text-sm text-gray-600">Transaction Hash: <a href={`https://etherscan.io/tx/${transactionHash}`} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">{transactionHash}</a></p>
//           )}
//           <a href="/" className="mt-6 text-blue-500 hover:underline">Go to Home</a>
//         </>
//       )}
//     </div>
//   );
// };

// export default Success;
