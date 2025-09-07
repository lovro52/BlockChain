import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import "./assets/main.css"; // ili style.css, ali ne oboje istovremeno

const app = createApp(App);
app.use(router);
app.mount("#app");
