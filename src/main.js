import { createApp } from "vue";
import App from "./App.vue";
import router from "./router.js"; // <--- Importar router
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

createApp(App)
  .use(router) // <--- Usar router
  .mount("#app");
