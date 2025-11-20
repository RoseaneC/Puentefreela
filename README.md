# PuenteFreela - MVP Escrow de Freelancers

MVP ultra simples de um sistema de escrow para freelancers.

## Estrutura

- `/contracts` - Contratos Solidity + Hardhat
- `/frontend` - React + Vite + wagmi/viem

## Setup Rápido

### Contratos

```bash
cd contracts
npm install
npx hardhat compile
npx hardhat node  # Em outro terminal
npx hardhat run scripts/deploy.ts --network localhost
```

Copie os endereços dos contratos e atualize em `frontend/src/lib/contract.ts`

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Acesse http://localhost:3000

## Funcionalidades

- ✅ Criar Jobs
- ✅ Fundar Jobs (depositar tokens)
- ✅ Atribuir Freelancer
- ✅ Liberar Pagamento
- ✅ Visualizar Jobs
- ✅ Conversão fake ARS (1 mUSDC = 1000 ARS)

## TODO

- Integração com Uniswap V3 para conversão real de USDC para ARS

