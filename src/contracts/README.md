# Tournament Betting Smart Contract

Pametni ugovor za klađenje na turnire korištenjem Ethereum blockchaina.

## Opis

Omogućuje:

- Kreiranje turnira s imenima natjecatelja
- Klađenje korisnika slanjem ETH-a
- Zatvaranje turnira i određivanje pobjednika (samo owner)
- Preuzimanje nagrade od strane korisnika koji su točno pogodili pobjednika

## Tehnologije

- Solidity ^0.8.20
- Deployment: Sepolia testnet
- Deployment tool: Remix IDE
- Interakcija: Web3 frontend (Vue + ethers.js)

## Adresa ugovora na testnetu

0x656A38e315C3e0A92cC9ABA5D4fD6446EEfE2146

## Funkcije

- `createTournament(name, competitors[])`
- `placeBet(tournamentId, competitorIndex)`
- `closeTournament(tournamentId, winnerIndex)`
- `claimReward(tournamentId)`
- `getUserBet(tournamentId, userAddress)`

## Deployment i testiranje

1. Učitaj `TournamentBetting.sol` u Remix
2. Kompajliraj i deployaj na Sepolia testnet
3. Interagiraj putem Metamask i frontend aplikacije
