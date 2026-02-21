<template>
  <div class="container py-4">
    <h1 class="mb-2 text-center text-primary">JA Scoreboard</h1>
    <p class="text-center text-muted mb-5">
      Sistema de puntuación y ranking para Jóvenes Adventistas
    </p>

    <!-- Resumen Rankings -->
    <div class="row mb-5">
      <!-- Top Grupos -->
      <div class="col-md-6 mb-4">
        <div class="card shadow-sm h-100">
          <div class="card-header bg-primary text-white">🏆 Top Grupos</div>
          <div class="card-body">
            <ol class="list-group list-group-numbered mb-3">
              <li
                class="list-group-item d-flex justify-content-between"
                v-for="group in topGroups"
                :key="group._id"
              >
                <span>{{ group.name }}</span>
                <strong>{{ group.totalPoints }} pts</strong>
              </li>
            </ol>

            <router-link
              to="/ranking/groups"
              class="btn btn-outline-primary w-100"
            >
              Ver ranking completo
            </router-link>
          </div>
        </div>
      </div>

      <!-- Top Personas -->
      <div class="col-md-6 mb-4">
        <div class="card shadow-sm h-100">
          <div class="card-header bg-success text-white">⭐ Top Personas</div>
          <div class="card-body">
            <ol class="list-group list-group-numbered mb-3">
              <li
                class="list-group-item d-flex justify-content-between"
                v-for="person in topPersons"
                :key="person._id"
              >
                <span>{{ person.fullName }}</span>
                <strong>{{ person.points }} pts</strong>
              </li>
            </ol>

            <router-link
              to="/ranking/persons"
              class="btn btn-outline-success w-100"
            >
              Ver ranking completo
            </router-link>
          </div>
        </div>
      </div>
    </div>

    <!-- Últimas actividades -->
    <h3 class="mb-3 text-center">📌 Últimas Actividades</h3>
    <div class="row">
      <div
        class="col-md-4 mb-3"
        v-for="activity in activities.slice(0, 6)"
        :key="activity._id"
      >
        <div
          class="card h-100"
          :class="{
            'border-success': activity.points > 0,
            'border-danger': activity.points < 0,
          }"
        >
          <div class="card-body">
            <h6 class="card-title">
              {{ activity.person?.fullName || activity.group?.name }}
            </h6>
            <p class="card-text">
              {{ activity.action }} ({{ activity.points }} pts)
            </p>
            <small class="text-muted">
              {{ formatDate(activity.date) }}
            </small>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted, computed } from "vue";
import { getGroups, getPersons, getActivities } from "../../services/api.js";

const groups = ref([]);
const persons = ref([]);
const activities = ref([]);

const formatDate = (value) => new Date(value).toLocaleString();

const topGroups = computed(() =>
  groups.value
    .slice()
    .sort((a, b) => b.totalPoints - a.totalPoints)
    .slice(0, 3),
);

const topPersons = computed(() =>
  persons.value
    .slice()
    .sort((a, b) => b.points - a.points)
    .slice(0, 3),
);

onMounted(async () => {
  const [g, p, a] = await Promise.all([
    getGroups(),
    getPersons(),
    getActivities(),
  ]);
  groups.value = g.data;
  persons.value = p.data;
  activities.value = a.data;
});
</script>
