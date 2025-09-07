import { createRouter, createWebHistory } from "vue-router";
import ViewTournaments from "../components/ViewTournaments.vue";
import BetOnTournament from "../components/BetOnTournament.vue";
import AdminDashboard from "../components/AdminDashboard.vue";
import Home from "../components/Home.vue";
import { isAdmin } from "../App.vue"; // sada će raditi

const routes = [
  { path: "/", component: Home },
  { path: "/tournaments", component: ViewTournaments },
  { path: "/bets", component: BetOnTournament },
  {
    path: "/admin",
    component: AdminDashboard,
    meta: { requiresAdmin: true },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  if (to.meta.requiresAdmin && !isAdmin.value) {
    alert("Pristup dozvoljen samo administratorima!");
    next("/");
  } else {
    next();
  }
});

export default router;
