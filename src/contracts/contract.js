import { ethers } from "ethers";

const contractAddress = "0x656A38e315C3e0A92cC9ABA5D4fD6446EEfE2146";

const contractABI = [
  {
    inputs: [],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "tournamentId",
        type: "uint256",
      },
      { indexed: true, internalType: "address", name: "user", type: "address" },
      {
        indexed: false,
        internalType: "uint256",
        name: "competitorIndex",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "BetPlaced",
    type: "event",
  },
  {
    inputs: [
      { internalType: "uint256", name: "_tournamentId", type: "uint256" },
    ],
    name: "claimReward",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "_tournamentId", type: "uint256" },
      { internalType: "uint256", name: "_winnerIndex", type: "uint256" },
    ],
    name: "closeTournament",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "string", name: "_name", type: "string" },
      { internalType: "string[]", name: "_competitors", type: "string[]" },
    ],
    name: "createTournament",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "_tournamentId", type: "uint256" },
      { internalType: "uint256", name: "_competitorIndex", type: "uint256" },
    ],
    name: "placeBet",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "tournamentId",
        type: "uint256",
      },
      { indexed: true, internalType: "address", name: "user", type: "address" },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "RewardClaimed",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "tournamentId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "winnerIndex",
        type: "uint256",
      },
    ],
    name: "TournamentClosed",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "tournamentId",
        type: "uint256",
      },
      { indexed: false, internalType: "string", name: "name", type: "string" },
    ],
    name: "TournamentCreated",
    type: "event",
  },
  {
    inputs: [
      { internalType: "uint256", name: "_tournamentId", type: "uint256" },
      { internalType: "address", name: "_user", type: "address" },
    ],
    name: "getUserBet",
    outputs: [
      { internalType: "bool", name: "hasBet", type: "bool" },
      { internalType: "uint256", name: "competitorIndex", type: "uint256" },
      { internalType: "uint256", name: "amount", type: "uint256" },
      { internalType: "bool", name: "claimed", type: "bool" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "tournamentCount",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    name: "tournaments",
    outputs: [
      { internalType: "string", name: "name", type: "string" },
      { internalType: "bool", name: "isOpen", type: "bool" },
      { internalType: "uint256", name: "winnerIndex", type: "uint256" },
    ],
    stateMutability: "view",
    type: "function",
  },
];

export const getContract = async () => {
  if (!window.ethereum) throw new Error("MetaMask nije pronađen!");
  await window.ethereum.request({ method: "eth_requestAccounts" });
  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();
  return new ethers.Contract(contractAddress, contractABI, signer);
};
