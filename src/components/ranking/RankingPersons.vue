<template>
  <div class="container py-4">
    <h2 class="text-center text-success mb-4">⭐ Ranking de Personas</h2>

    <div class="card shadow-sm mb-4">
      <div class="card-body">
        <canvas id="personChart"></canvas>
      </div>
    </div>

    <!-- Tabla -->
    <table class="table table-hover">
      <thead class="table-success">
        <tr>
          <th>#</th>
          <th>Nombre</th>
          <th>Grupo</th>
          <th>Puntos</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(person, index) in pagedPersons" :key="person._id">
          <td>{{ (page - 1) * pageSize + index + 1 }}</td>
          <td>{{ person.fullName }}</td>
          <td>{{ person.group?.name || "—" }}</td>
          <td>{{ person.points }}</td>
        </tr>
      </tbody>
    </table>

    <!-- Paginación -->
    <nav class="mt-3">
      <ul class="pagination justify-content-center">
        <li class="page-item" :class="{ disabled: page === 1 }">
          <a class="page-link" href="#" @click.prevent="page--">Anterior</a>
        </li>
        <li class="page-item disabled">
          <span class="page-link"> Página {{ page }} / {{ totalPages }} </span>
        </li>
        <li class="page-item" :class="{ disabled: page === totalPages }">
          <a class="page-link" href="#" @click.prevent="page++">Siguiente</a>
        </li>
      </ul>
    </nav>
  </div>
</template>
<script setup>
import { ref, computed, onMounted, watch } from "vue";
import Chart from "chart.js/auto";
import { getGroups, getPersons, getActivities } from "../../services/api.js";

const persons = ref([]);
const page = ref(1);
const pageSize = 5;
let chart = null;

// Ordenar por puntos
const sortedPersons = computed(() =>
  persons.value.slice().sort((a, b) => b.points - a.points),
);

const totalPages = computed(() =>
  Math.ceil(sortedPersons.value.length / pageSize),
);

const pagedPersons = computed(() => {
  const start = (page.value - 1) * pageSize;
  return sortedPersons.value.slice(start, start + pageSize);
});

const renderChart = () => {
  if (chart) chart.destroy();

  const ctx = document.getElementById("personChart").getContext("2d");

  chart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: pagedPersons.value.map((p) => p.fullName),
      datasets: [
        {
          data: pagedPersons.value.map((p) => p.points),
          backgroundColor: "#198754",
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

watch(page, renderChart);

onMounted(async () => {
  const res = await getPersons();
  persons.value = res.data;
  renderChart();
});
</script>
