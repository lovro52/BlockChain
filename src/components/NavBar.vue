<template>
  <nav class="navbar">
    <div class="logo">TournamentBetting</div>
    <ul class="nav-links">
      <li>
        <RouterLink to="/tournaments" class="link" exact>Turniri</RouterLink>
      </li>
      <li>
        <RouterLink to="/bets" class="link">Ulozi</RouterLink>
      </li>
      <li v-if="isAdmin">
        <RouterLink to="/admin" class="link">Admin</RouterLink>
      </li>
    </ul>
  </nav>
</template>

<script setup>
import { RouterLink } from "vue-router";
import { isAdmin } from "../App.vue";
</script>

<style scoped>
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #1e1e1e;
  padding: 1rem 2rem;
  border-bottom: 1px solid #333;
}

.logo {
  font-size: 1.5rem;
  font-weight: bold;
  color: #00bcd4;
}

.nav-links {
  display: flex;
  gap: 1.5rem;
  list-style: none;
  margin: 0;
  padding: 0;
}

.link {
  color: #ddd;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.3s;
}

.link:hover {
  color: #00bcd4;
}
</style>
