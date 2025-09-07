<template>
  <div class="claim-container">
    <h2>Claim Reward</h2>

    <form @submit.prevent="claimReward">
      <label>Tournament ID:</label>
      <input v-model="tournamentId" type="number" required />

      <button type="submit">Claim</button>
    </form>

    <p v-if="status">{{ status }}</p>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { getContract } from "../contracts/contract.js";

const tournamentId = ref("");
const status = ref("");

const claimReward = async () => {
  try {
    const contract = await getContract();
    const tx = await contract.claimReward(Number(tournamentId.value));
    status.value = "Claiming reward...";
    await tx.wait();
    status.value = "Reward claimed successfully!";
  } catch (err) {
    console.error(err);
    status.value = "Error: " + (err.reason || err.message || "unknown error");
  }
};
</script>

<style scoped>
.claim-container {
  max-width: 500px;
  margin: 2rem auto;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
</style>
