<script>
import { ref, onMounted } from "vue";
import { getContract } from "./contracts/contract.js";
import Navbar from "./components/NavBar.vue";
import { ethers } from "ethers";

export const isAdmin = ref(false);
export const currentAccount = ref("");

export default {
  components: {
    Navbar,
  },
  setup() {
    onMounted(async () => {
      try {
        const hasMetaMask = typeof window !== "undefined" && window.ethereum;
        let signerAddress = null;
        let contract;

        if (hasMetaMask) {
          const provider = new ethers.BrowserProvider(window.ethereum);
          const signer = await provider.getSigner();
          signerAddress = await signer.getAddress();
          contract = await getContract(true);
        } else {
          contract = await getContract(false);
        }

        const owner = await contract.owner();
        currentAccount.value = signerAddress;
        isAdmin.value =
          signerAddress && signerAddress.toLowerCase() === owner.toLowerCase();
      } catch (err) {
        console.error("Greška pri dohvaćanju ugovora:", err);
      }
    });

    return { isAdmin, currentAccount };
  },
};
</script>

<template>
  <div id="app">
    <Navbar />
    <router-view />
  </div>
</template>
