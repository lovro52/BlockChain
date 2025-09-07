<template>
  <div class="p-4 max-w-2xl mx-auto">
    <h2 class="text-2xl font-bold mb-6 text-center text-cyan-400">
      Admin Dashboard
    </h2>

    <section class="mb-10 bg-gray-800 p-4 rounded-xl shadow-md">
      <h3 class="text-xl font-semibold mb-4">Kreiraj novi turnir</h3>
      <form @submit.prevent="createTournament" class="space-y-3">
        <input
          v-model="newName"
          type="text"
          placeholder="Naziv turnira"
          class="input"
        />
        <input
          v-model="competitorsText"
          type="text"
          placeholder="Natjecatelji (odvojeni zarezom)"
          class="input"
        />
        <button type="submit" class="btn-blue w-full">Kreiraj turnir</button>
      </form>
      <p v-if="status" class="text-sm mt-3 text-center">{{ status }}</p>
    </section>

    <section class="bg-gray-800 p-4 rounded-xl shadow-md">
      <h3 class="text-xl font-semibold mb-4">Zatvori turnir</h3>
      <form @submit.prevent="closeTournament" class="space-y-3">
        <input
          v-model="closeId"
          type="number"
          placeholder="ID turnira"
          class="input"
        />
        <input
          v-model="winnerIndex"
          type="number"
          placeholder="Index pobjednika"
          class="input"
        />
        <button type="submit" class="btn-red w-full">Zatvori turnir</button>
      </form>
    </section>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { getContract } from "../contracts/contract";

const newName = ref("");
const competitorsText = ref("");
const status = ref("");

const closeId = ref("");
const winnerIndex = ref("");

const createTournament = async () => {
  try {
    const contract = await getContract();
    const competitors = competitorsText.value.split(",").map((s) => s.trim());

    if (competitors.length < 2) {
      status.value = "Unesi barem 2 natjecatelja.";
      return;
    }

    // Spoji naziv i natjecatelje u jedan string
    const fullName = `${newName.value} | ${competitors.join(", ")}`;
    const tx = await contract.createTournament(fullName, competitors);
    status.value = "Stvaranje turnira...";
    await tx.wait();
    status.value = "Turnir uspješno kreiran!";
    newName.value = "";
    competitorsText.value = "";
  } catch (err) {
    console.error(err);
    status.value = "Greška: " + err.message;
  }
};

const closeTournament = async () => {
  try {
    const contract = await getContract();
    const tx = await contract.closeTournament(closeId.value, winnerIndex.value);
    await tx.wait();
    alert("Turnir zatvoren!");
    closeId.value = "";
    winnerIndex.value = "";
  } catch (err) {
    console.error(err);
    alert("Greška: " + err.message);
  }
};
</script>

<style scoped>
.input {
  display: block;
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #888;
  border-radius: 0.375rem;
  background-color: #1e1e1e;
  color: #fff;
}

.btn-blue {
  background-color: #00bcd4;
  padding: 0.6rem;
  color: white;
  border-radius: 0.375rem;
  border: none;
  font-weight: bold;
  cursor: pointer;
}

.btn-red {
  background-color: #e53935;
  padding: 0.6rem;
  color: white;
  border-radius: 0.375rem;
  border: none;
  font-weight: bold;
  cursor: pointer;
}
</style>
