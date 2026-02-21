<template>
  <div class="container py-4">
    <h3 class="mb-3">Historial de Actividades</h3>

    <!-- Filtros -->
    <div class="row mb-3">
      <div class="col-md-6">
        <input
          v-model="searchPerson"
          type="text"
          class="form-control"
          placeholder="Buscar por persona..."
        />
      </div>

      <div class="col-md-6">
        <input
          v-model="searchGroup"
          type="text"
          class="form-control"
          placeholder="Buscar por grupo..."
        />
      </div>
    </div>

    <!-- Loading -->
    <div
      v-if="loading"
      class="d-flex justify-content-center align-items-center my-5"
    >
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>

    <!-- Tabla -->
    <table v-else class="table table-striped">
      <thead>
        <tr>
          <th>Fecha</th>
          <th>Persona</th>
          <th>Grupo</th>
          <th>Acción</th>
          <th>Puntos</th>
          <th>Descripción</th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="activity in paginatedActivities" :key="activity._id">
          <td>{{ formatDate(activity.date) }}</td>
          <td>{{ activity.person?.fullName }}</td>
          <td>{{ activity.group?.name }}</td>
          <td>{{ activity.action }}</td>
          <td>{{ activity.points }}</td>
          <td>{{ activity.description }}</td>
        </tr>

        <tr v-if="paginatedActivities.length === 0">
          <td colspan="6" class="text-center text-muted">
            No se encontraron resultados
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Paginación -->
    <nav v-if="totalPages > 1" class="mt-3">
      <ul class="pagination justify-content-center">
        <li class="page-item" :class="{ disabled: currentPage === 1 }">
          <button class="page-link" @click="prevPage">Anterior</button>
        </li>

        <li class="page-item disabled">
          <span class="page-link">
            Página {{ currentPage }} de {{ totalPages }}
          </span>
        </li>

        <li class="page-item" :class="{ disabled: currentPage === totalPages }">
          <button class="page-link" @click="nextPage">Siguiente</button>
        </li>
      </ul>
    </nav>
  </div>
</template>
<script setup>
import { ref, onMounted, computed, watch } from "vue";
import { getActivities } from "../../services/api.js";

const activities = ref([]);
const searchPerson = ref("");
const searchGroup = ref("");

const loading = ref(false);
const currentPage = ref(1);
const ITEMS_PER_PAGE = 13;

// Fecha
const formatDate = (date) => new Date(date).toLocaleString();

// Obtener data
const fetchActivities = async () => {
  try {
    loading.value = true;
    const res = await getActivities();
    activities.value = res.data.sort(
      (a, b) => new Date(b.date) - new Date(a.date),
    );
  } catch (err) {
    console.error("Error cargando actividades:", err);
  } finally {
    loading.value = false;
  }
};

// Filtro
const filteredActivities = computed(() => {
  return activities.value.filter((activity) => {
    const personName = activity.person?.fullName?.toLowerCase() || "";
    const groupName = activity.group?.name?.toLowerCase() || "";

    return (
      personName.includes(searchPerson.value.toLowerCase()) &&
      groupName.includes(searchGroup.value.toLowerCase())
    );
  });
});

// Total páginas
const totalPages = computed(() =>
  Math.ceil(filteredActivities.value.length / ITEMS_PER_PAGE),
);

// Data paginada
const paginatedActivities = computed(() => {
  const start = (currentPage.value - 1) * ITEMS_PER_PAGE;
  return filteredActivities.value.slice(start, start + ITEMS_PER_PAGE);
});

// Navegación
const nextPage = () => {
  if (currentPage.value < totalPages.value) currentPage.value++;
};

const prevPage = () => {
  if (currentPage.value > 1) currentPage.value--;
};

// Loading suave al filtrar (debounce)
let filterTimeout;
watch([searchPerson, searchGroup], () => {
  loading.value = true;
  currentPage.value = 1;

  clearTimeout(filterTimeout);
  filterTimeout = setTimeout(() => {
    loading.value = false;
  }, 300);
});

onMounted(fetchActivities);
</script>
