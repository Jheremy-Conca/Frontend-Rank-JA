<template>
  <div class="container py-4">
    <h2 class="text-center text-primary mb-4">🏆 Ranking de Grupos</h2>

    <div class="card shadow-sm">
      <div class="card-body">
        <canvas id="groupChart"></canvas>
      </div>
    </div>

    <!-- Tabla de apoyo -->
    <table class="table table-striped table-hover mt-4">
      <thead class="table-primary">
        <tr>
          <th>#</th>
          <th>Grupo</th>
          <th>Puntos</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(group, index) in sortedGroups" :key="group._id">
          <td>
            <span v-if="index === 0">🥇</span>
            <span v-else-if="index === 1">🥈</span>
            <span v-else-if="index === 2">🥉</span>
            <span v-else>{{ index + 1 }}</span>
          </td>
          <td>{{ group.name }}</td>
          <td>{{ group.totalPoints }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import Chart from "chart.js/auto";
import { getGroups, getPersons, getActivities } from "../../services/api.js";

const groups = ref([]);
let chart = null;

const sortedGroups = computed(() =>
  groups.value.slice().sort((a, b) => b.totalPoints - a.totalPoints),
);

const renderChart = () => {
  if (chart) chart.destroy();

  const ctx = document.getElementById("groupChart").getContext("2d");

  chart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: sortedGroups.value.map((g) => g.name),
      datasets: [
        {
          data: sortedGroups.value.map((g) => g.totalPoints),
          backgroundColor: ["#FF0000", "#0000FF", "#FFFF00", "#FFFFFF"],
          borderColor: "#000",
          borderWidth: 1,
        },
      ],
    },
    options: {
      indexAxis: "y",
      plugins: { legend: { display: false } },
      scales: { x: { beginAtZero: true } },
    },
  });
};

onMounted(async () => {
  const res = await getGroups();
  groups.value = res.data;
  renderChart();
});
</script>
