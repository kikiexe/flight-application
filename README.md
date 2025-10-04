# 🛡️ INSURANCE DAPP

A decentralized insurance application built on blockchain technology.  
This project combines a **frontend interface** built with React (Vite)  
and a **smart contract layer** developed using Foundry.

---

## ⚙️ Teknologi yang Digunakan

| Layer | Teknologi | Deskripsi |
|-------|------------|-----------|
| **Smart Contract** | Solidity, Foundry | Menyusun dan menguji kontrak pintar |
| **Backend** | Node.js, Express.js | API untuk menghubungkan kontrak dengan frontend |
| **Frontend** | Vite, React/Vue | Antarmuka pengguna interaktif |
| **Blockchain** | Ethereum/Localhost/Anvil | Jaringan untuk eksekusi kontrak pintar |

---

## 🚀 Cara Menjalankan Proyek

### 1️⃣ Setup Smart Contract
```bash
cd sc
forge build
forge test
forge script script/Deploy.s.sol --broadcast --rpc-url <RPC_URL> --private-key <PRIVATE_KEY>


###2️⃣ Setup Backend
cd be
npm install
node server.js

###3️⃣ Setup Frontend
cd fe
npm install
npm run dev



