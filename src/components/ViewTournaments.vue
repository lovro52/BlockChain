<template>
  <div class="container">
    <h2 class="title">Turniri</h2>

    <div v-if="isLoading" class="loading">Učitavanje turnira...</div>

    <div v-else class="tournament-grid">
      <div v-for="t in tournaments" :key="t.id" class="card">
        <h3 class="card-title">🏆 #{{ t.id }} — {{ t.name }}</h3>
        <p class="status">
          <strong>Status:</strong>
          <span :class="t.isOpen ? 'open' : 'closed'">
            {{ t.isOpen ? "Otvoren" : "Zatvoren" }}
          </span>
        </p>

        <div v-if="t.competitors.length" class="competitors">
          <p><strong>Natjecatelji:</strong></p>
          <ul>
            <li v-for="(comp, idx) in t.competitors" :key="idx">
              #{{ idx }} — {{ comp }}
              <button
                v-if="t.isOpen && !userBets[t.id]"
                @click="openModal(t.id, idx)"
              >
                💰 Kladim se
              </button>
            </li>
          </ul>
        </div>

        <div v-if="userBets[t.id]" class="bet-info">
          <p><strong>Tvoj ulog:</strong></p>
          <p>Natjecatelj: #{{ userBets[t.id].competitorIndex }}</p>
          <p>Iznos: {{ userBets[t.id].amount / 10 ** 18 }} ETH</p>
        </div>

        <div v-if="!t.isOpen" class="result">
          <p><strong>Pobjednik:</strong> #{{ t.winnerIndex }}</p>

          <div
            v-if="
              userBets[t.id] && userBets[t.id].competitorIndex === t.winnerIndex
            "
          >
            <button class="claim-btn" @click="claimReward(t.id)">
              🎉 Preuzmi nagradu
            </button>
            <p v-if="status[t.id]" class="status-message">{{ status[t.id] }}</p>
          </div>

          <div v-else-if="userBets[t.id]" class="wrong">
            Nisi pogodio pobjednika.
          </div>
        </div>
      </div>
    </div>

    <!-- MODAL -->
    <div v-if="modalOpen" class="modal-overlay">
      <div class="modal">
        <h3>Unesi iznos (ETH)</h3>
        <input v-model="modalAmount" type="number" placeholder="npr. 0.01" />
        <div class="modal-actions">
          <button @click="modalOpen = false">Odustani</button>
          <button @click="confirmBet">Potvrdi</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { getContract } from "../contracts/contract";
import { ethers } from "ethers";

const tournaments = ref([]);
const isLoading = ref(true);
const userAddress = ref("");
const userBets = ref({});
const status = ref({});

const modalOpen = ref(false);
const modalAmount = ref("");
const selectedTournament = ref(null);
const selectedCompetitor = ref(null);

const openModal = (tid, cid) => {
  selectedTournament.value = tid;
  selectedCompetitor.value = cid;
  modalAmount.value = "";
  modalOpen.value = true;
};

const confirmBet = async () => {
  const amount = modalAmount.value;
  modalOpen.value = false;

  if (!amount || isNaN(amount)) {
    alert("Neispravan iznos.");
    return;
  }

  if (!amount || isNaN(amount) || Number(amount) <= 0) {
    alert("Neispravan iznos.");
    return;
  }

  try {
    const contract = await getContract();
    const tx = await contract.placeBet(
      selectedTournament.value,
      selectedCompetitor.value,
      {
        value: ethers.parseEther(amount.toString()),
      }
    );
    await tx.wait();
    alert("Uspješno si se kladio!");
    window.location.reload();
  } catch (err) {
    alert("Greška: " + (err.reason || err.message));
  }
};

onMounted(async () => {
  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();
  const address = await signer.getAddress();
  userAddress.value = address;

  const contract = await getContract();
  const count = await contract.tournamentCount();
  const loaded = [];

  for (let i = 0; i < Number(count); i++) {
    const t = await contract.tournaments(i);
    const bet = await contract.getUserBet(i, address);
    const hasBet = bet[0];

    const tournament = {
      id: i,
      name: t.name,
      isOpen: t.isOpen,
      winnerIndex: Number(t.winnerIndex),
      competitors: t.name.includes("|")
        ? t.name
            .split("|")[1]
            .split(",")
            .map((s) => s.trim())
        : [],
    };

    if (hasBet) {
      userBets.value[i] = {
        competitorIndex: Number(bet[1]),
        amount: Number(bet[2]),
        claimed: bet[3],
      };
    }

    loaded.push(tournament);
  }

  tournaments.value = loaded;
  isLoading.value = false;
});

const claimReward = async (id) => {
  try {
    const contract = await getContract();
    const tx = await contract.claimReward(id);
    status.value[id] = "Procesiranje...";
    await tx.wait();
    status.value[id] = "Nagrada preuzeta!";
    alert("Nagrada je preuzeta!");
  } catch (err) {
    const msg = err.reason || err.message;
    status.value[id] = "Greška: " + msg;
    alert("Greška: " + msg);
  }
};
</script>

<style scoped>
.container {
  padding: 2rem;
  background-color: #111;
  color: white;
  min-height: 100vh;
}
.title {
  text-align: center;
  color: #00bcd4;
  font-size: 2rem;
  margin-bottom: 2rem;
}
.loading {
  text-align: center;
  color: gray;
}

.tournament-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
  justify-content: center;
}
.card {
  background: #222;
  border: 1px solid #00bcd4;
  border-radius: 12px;
  padding: 1rem;
  width: 100%;
  max-width: 400px;
}
.card-title {
  font-size: 1.25rem;
  color: #00bcd4;
  margin-bottom: 0.5rem;
}
.status {
  margin-bottom: 0.5rem;
}
.status .open {
  color: limegreen;
}
.status .closed {
  color: crimson;
}
.competitors ul {
  padding-left: 1rem;
}
.competitors li {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.25rem;
}
.competitors button {
  background: #00bcd4;
  color: black;
  border: none;
  padding: 0.25rem 0.5rem;
  border-radius: 6px;
  cursor: pointer;
}
.bet-info {
  background: #333;
  padding: 0.5rem;
  border-radius: 6px;
  margin-top: 0.5rem;
}
.result {
  margin-top: 1rem;
}
.claim-btn {
  background: green;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  cursor: pointer;
  width: 100%;
}
.status-message {
  margin-top: 0.5rem;
  color: lightgreen;
}
.wrong {
  color: red;
  margin-top: 0.5rem;
}
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.75);
  display: flex;
  align-items: center;
  justify-content: center;
}
.modal {
  background: white;
  color: black;
  padding: 1.5rem;
  border-radius: 12px;
  width: 300px;
}
.modal input {
  width: 100%;
  padding: 0.5rem;
  margin-bottom: 1rem;
}
.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
}
.modal-actions button {
  padding: 0.4rem 0.8rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}
.modal-actions button:last-child {
  background: #00bcd4;
  color: black;
}
</style>
