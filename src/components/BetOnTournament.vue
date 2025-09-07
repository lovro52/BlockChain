<template>
  <div class="bet-container">
    <h2 class="text-xl font-semibold">Uloži na turnir</h2>

    <form @submit.prevent="placeBet">
      <label>Tournament ID:</label>
      <input v-model="tournamentId" type="number" required />

      <label>Competitor Index (0, 1, ...):</label>
      <input v-model="competitorIndex" type="number" required />

      <label>Bet Amount (ETH):</label>
      <input v-model="amount" type="number" step="0.01" required />

      <button type="submit">Uloži</button>
    </form>

    <p v-if="status">{{ status }}</p>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { getContract } from "../contracts/contract.js";

const tournamentId = ref("");
const competitorIndex = ref("");
const amount = ref("");
const status = ref("");
const userBets = ref({});

const placeBet = async () => {
  try {
    const contract = await getContract();
    const signer = await contract.signer.getAddress();

    // Provjeri postojeći bet
    const bet = await contract.bets(tournamentId.value, signer);
    if (bet.amount > 0) {
      status.value = "Već si se kladio na ovaj turnir.";
      return;
    }

    const tournament = await contract.tournaments(tournamentId.value);
    if (!tournament.isOpen) {
      status.value = "Ovaj turnir je zatvoren za klađenje.";
      return;
    }

    if (!amount || isNaN(amount) || Number(amount) <= 0) {
      alert("Neispravan iznos.");
      return;
    }

    const tx = await contract.placeBet(
      tournamentId.value,
      competitorIndex.value,
      {
        value: ethers.parseEther(amount.value.toString()),
      }
    );
    status.value = "Obrada transakcije...";
    await tx.wait();
    status.value = "Ulog uspješno postavljen!";
  } catch (err) {
    console.error(err);
    status.value = "Greška: " + (err.message || "nepoznato");
  }
};
</script>

<style scoped>
.bet-container {
  max-width: 500px;
  margin: 2rem auto;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
</style>
