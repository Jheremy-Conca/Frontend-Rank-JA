import { createRouter, createWebHistory } from "vue-router";

// Ranking / Dashboard
import Dashboard from "./components/ranking/Dashboard.vue";

// Grupos
import GroupList from "./components/groups/GroupList.vue";

// Personas
import PersonList from "./components/persons/PersonList.vue";
import AddPerson from "./components/persons/AddPerson.vue";
import EditPerson from "./components/persons/EditPerson.vue";

// Actividades
import ActivityList from "./components/activities/ActivityList.vue";

// Rankings individuales
const RankingGroups = () => import("./components/ranking/RankingGroups.vue");
const RankingPersons = () => import("./components/ranking/RankingPersons.vue");

const routes = [
  {
    path: "/",
    name: "Dashboard",
    component: Dashboard,
  },

  // ===== Grupos =====
  {
    path: "/groups",
    name: "Groups",
    component: GroupList,
  },

  // ===== Personas =====
  {
    path: "/persons",
    name: "Persons",
    component: PersonList,
  },
  {
    path: "/persons/add",
    name: "AddPerson",
    component: AddPerson,
  },
  {
    path: "/persons/edit/:id",
    name: "EditPerson",
    component: EditPerson,
    props: true,
  },

  // ===== Actividades =====
  {
    path: "/activities",
    name: "Activities",
    component: ActivityList,
  },

  // ===== Rankings =====
  {
    path: "/ranking/groups",
    name: "RankingGroups",
    component: RankingGroups,
  },
  {
    path: "/ranking/persons",
    name: "RankingPersons",
    component: RankingPersons,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 };
  },
});

export default router;
