import React, { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../Home/home.css";
import { ethers } from "ethers";

const HomePage = () => {
  const [value, setValue] = useState();
  const [address, setAddress] = useState(null); // State for the connected address
  const [balance, setBalance] = useState(null); // State for the address's balance
  const navigate = useNavigate();

  const [transactionSubmitted, setTransactionSubmitted] = useState(false);

  const abi= [
    {
        "inputs": [
            {
                "internalType": "address payable",
                "name": "receiver",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            },
            {
                "internalType": "string",
                "name": "message",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "keyword",
                "type": "string"
            }
        ],
        "name": "addToBlockchian",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "internalType": "address",
                "name": "receiver",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "string",
                "name": "message",
                "type": "string"
            },
            {
                "indexed": false,
                "internalType": "string",
                "name": "keyword",
                "type": "string"
            }
        ],
        "name": "Transfer",
        "type": "event"
    },
    {
        "inputs": [],
        "name": "getAllTransactions",
        "outputs": [
            {
                "components": [
                    {
                        "internalType": "address",
                        "name": "receiver",
                        "type": "address"
                    },
                    {
                        "internalType": "uint256",
                        "name": "amount",
                        "type": "uint256"
                    },
                    {
                        "internalType": "string",
                        "name": "message",
                        "type": "string"
                    },
                    {
                        "internalType": "string",
                        "name": "keyword",
                        "type": "string"
                    }
                ],
                "internalType": "struct Transactions.TransaferStruct[]",
                "name": "",
                "type": "tuple[]"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getTransactionCount",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    }
];
  const contractAddress = '0x51be139b286346aa2e5bea2273f5599631d5a8eb';

  const handleConnect = useCallback(async () => {
    try {
      if (!window.ethereum) {
        console.error("Please install MetaMask wallet.");
        // Optional: Provide link or instructions to install MetaMask
        return;
      }

      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
      const walletAddress = accounts[0];
      setAddress(walletAddress);
      console.log("Connected wallet:", walletAddress);

      // Get the connected address's balance (optional)
      if (walletAddress) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const balance = await provider.getBalance(walletAddress);
        const formattedBalance = ethers.utils.formatEther(balance);
        setBalance(formattedBalance);
      }
    } catch (err) {
      console.error("Error connecting wallet:", err);
    }
  }, []);

  const handleJoinRoom = useCallback(() => {

    if (!transactionSubmitted) {
        alert("Please complete the transaction and wait for confirmation before joining the room.");
        return;
      }
    navigate(`/room/${value}`);
  }, [navigate, value,transactionSubmitted]);

  // Fetch balance on address change (optional)
  useEffect(() => {
    const fetchBalance = async () => {
      if (address) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const balance = await provider.getBalance(address);
        const formattedBalance = ethers.utils.formatEther(balance);
        setBalance(formattedBalance);
      }
    };

    fetchBalance();
  }, [address]); // Trigger on address change

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    console.log(provider);
    const signer = provider.getSigner();
    console.log(signer);
    const contract=new ethers.Contract( contractAddress , abi , signer );
    console.log(contract);

    const sendTransaction=async()=>{
        try {
         // Get the values from the form
     const receiver = document.getElementById('receiver').value;
     const amount = document.getElementById('amount').value;
     const message = document.getElementById('message').value;
     const keyword = document.getElementById('keyword').value;

     

     // Convert amount to the required format (in wei)
     const amountInWei = ethers.utils.parseEther(amount);
     const data = ethers.utils.defaultAbiCoder.encode(["string", "string"], [message, keyword]);

     // Send transaction to transfer Ether
     const tx = await signer.sendTransaction({
         to: receiver,
         value: amountInWei,
         data:data
     });

     // Wait for the transaction to be mined
     await tx.wait();

     console.log('Transaction successful');
     alert('Transaction successful');
     alert('Transaction successful');
     setTransactionSubmitted(true);
        } catch (error) {
         console.log(error);
        }
        }

  return (
    <div>
      <div className="metmask">
        <h1>Connect to MetaMask for Joining the Room</h1>
        <img
          src="https://th.bing.com/th?id=OIP.PiV5dSmGw5vekhjd5oq2twAAAA&w=250&h=250&c=8&rs=1&qlt=90&o=6&dpr=1.5&pid=3.1&rm=2"
          height={100}
          className="image"
          alt="MetaMask logo" // Add alt text for accessibility
        />
        <button onClick={handleConnect}>Connect</button>
        {address && (
          <div className="address-info">
            <p>Connected Address: {address}</p>
            {balance && <p>Balance: {balance} ETH</p>}
          </div>
        )}
      </div>
      <div>
        <div>
       
        <input type="text" id="receiver" placeholder="Receiver Address" />
        <input type="text" id="amount" placeholder="Amount (ETH)" />
        <input type="text" id="message" placeholder="Message" />
        <input type="text" id="keyword" placeholder="Keyword" />
        <button onClick={sendTransaction}>Send Transaction</button>
     
        </div>
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Enter Room Code"
        />
        <button disabled={!transactionSubmitted} onClick={handleJoinRoom}>
        Join Room
      </button>

        
      </div>
    </div>
  );
};

export default HomePage;
