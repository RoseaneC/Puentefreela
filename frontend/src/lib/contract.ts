// TODO: Integração com Uniswap V3 para conversão real

// Tipos para os dados do contrato
export interface Job {
  id: bigint;
  client: `0x${string}`;
  freelancer: `0x${string}`;
  amount: bigint;
  token: `0x${string}`;
  status: 0 | 1 | 2 | 3; // Created, Funded, Assigned, Released
}

// ENDEREÇOS DOS CONTRATOS (localhost Hardhat)
export const ESCROW_JOBS_ADDRESS = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";
export const MOCK_USDC_ADDRESS   = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

// (Opcional) exports antigos, caso algum lugar esteja usando ESCROW_ADDRESS / MOCKUSDC_ADDRESS
export const ESCROW_ADDRESS   = ESCROW_JOBS_ADDRESS;
export const MOCKUSDC_ADDRESS = MOCK_USDC_ADDRESS;

// ABI do contrato EscrowJobs
export const ESCROW_JOBS_ABI = [
  {
    "type": "function",
    "name": "createJob",
    "inputs": [
      { "name": "jobId", "type": "uint256", "internalType": "uint256" },
      { "name": "amount", "type": "uint256", "internalType": "uint256" },
      { "name": "token", "type": "address", "internalType": "address" }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "fundJob",
    "inputs": [
      { "name": "jobId", "type": "uint256", "internalType": "uint256" }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "assignFreelancer",
    "inputs": [
      { "name": "jobId", "type": "uint256", "internalType": "uint256" },
      { "name": "freelancer", "type": "address", "internalType": "address" }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "releasePayment",
    "inputs": [
      { "name": "jobId", "type": "uint256", "internalType": "uint256" }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "jobs",
    "inputs": [
      { "name": "", "type": "uint256", "internalType": "uint256" }
    ],
    "outputs": [
      { "name": "id", "type": "uint256", "internalType": "uint256" },
      { "name": "client", "type": "address", "internalType": "address" },
      { "name": "freelancer", "type": "address", "internalType": "address" },
      { "name": "amount", "type": "uint256", "internalType": "uint256" },
      { "name": "token", "type": "address", "internalType": "address" },
      { "name": "status", "type": "uint8", "internalType": "enum EscrowJobs.JobStatus" }
    ],
    "stateMutability": "view"
  },
  {
    "type": "event",
    "name": "JobCreated",
    "inputs": [
      { "name": "jobId", "type": "uint256", "indexed": true },
      { "name": "client", "type": "address", "indexed": true },
      { "name": "amount", "type": "uint256", "indexed": false },
      { "name": "token", "type": "address", "indexed": false }
    ]
  },
  {
    "type": "event",
    "name": "JobFunded",
    "inputs": [
      { "name": "jobId", "type": "uint256", "indexed": true },
      { "name": "client", "type": "address", "indexed": true },
      { "name": "amount", "type": "uint256", "indexed": false }
    ]
  },
  {
    "type": "event",
    "name": "JobAssigned",
    "inputs": [
      { "name": "jobId", "type": "uint256", "indexed": true },
      { "name": "freelancer", "type": "address", "indexed": true }
    ]
  },
  {
    "type": "event",
    "name": "PaymentReleased",
    "inputs": [
      { "name": "jobId", "type": "uint256", "indexed": true },
      { "name": "freelancer", "type": "address", "indexed": true },
      { "name": "amount", "type": "uint256", "indexed": false }
    ]
  }
] as const;

// ABI básica do MockUSDC
export const MOCK_USDC_ABI = [
  {
    "type": "function",
    "name": "approve",
    "inputs": [
      { "name": "spender", "type": "address", "internalType": "address" },
      { "name": "amount", "type": "uint256", "internalType": "uint256" }
    ],
    "outputs": [
      { "name": "", "type": "bool", "internalType": "bool" }
    ],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "balanceOf",
    "inputs": [
      { "name": "account", "type": "address", "internalType": "address" }
    ],
    "outputs": [
      { "name": "", "type": "uint256", "internalType": "uint256" }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "decimals",
    "inputs": [],
    "outputs": [
      { "name": "", "type": "uint8", "internalType": "uint8" }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "symbol",
    "inputs": [],
    "outputs": [
      { "name": "", "type": "string", "internalType": "string" }
    ],
    "stateMutability": "view"
  }
] as const;
