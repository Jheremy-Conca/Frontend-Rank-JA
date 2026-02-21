<template>
  <div class="container py-4">
    <div class="d-flex justify-content-between mb-3">
      <h3>Grupos</h3>
    </div>

    <!-- Filtro -->
    <div class="row mb-3">
      <div class="col-md-6">
        <input
          v-model="searchGroup"
          type="text"
          class="form-control"
          placeholder="Buscar grupo..."
        />
      </div>
    </div>

    <!-- Loading -->
    <div
      v-if="loading"
      class="d-flex justify-content-center align-items-center my-5"
    >
      <div class="spinner-border text-primary">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>

    <!-- Tabla -->
    <table v-else class="table table-striped table-hover">
      <thead class="table-dark">
        <tr>
          <th>Nombre</th>
          <th>Puntos</th>
          <th>Acciones</th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="group in paginatedGroups" :key="group._id">
          <td>{{ group.name }}</td>
          <td>{{ group.totalPoints }}</td>
          <td>
            <button
              class="btn btn-success btn-sm me-1"
              @click="addPoints(group)"
            >
              + Puntos
            </button>
            <button
              class="btn btn-danger btn-sm me-1"
              @click="subtractPoints(group)"
            >
              - Puntos
            </button>
          </td>
        </tr>

        <tr v-if="paginatedGroups.length === 0">
          <td colspan="3" class="text-center text-muted">
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
<script>
import {
  getGroups,
  addGroupPoints,
  subtractGroupPoints,
} from "../../services/api.js";
import Swal from "sweetalert2";

export default {
  data() {
    return {
      groups: [],
      searchGroup: "",
      loading: false,
      currentPage: 1,
      ITEMS_PER_PAGE: 13,
      filterTimeout: null,
    };
  },

  computed: {
    filteredGroups() {
      return this.groups.filter((group) =>
        group.name.toLowerCase().includes(this.searchGroup.toLowerCase()),
      );
    },

    totalPages() {
      return Math.ceil(this.filteredGroups.length / this.ITEMS_PER_PAGE);
    },

    paginatedGroups() {
      const start = (this.currentPage - 1) * this.ITEMS_PER_PAGE;
      return this.filteredGroups.slice(start, start + this.ITEMS_PER_PAGE);
    },
  },

  watch: {
    searchGroup() {
      this.loading = true;
      this.currentPage = 1;

      clearTimeout(this.filterTimeout);
      this.filterTimeout = setTimeout(() => {
        this.loading = false;
      }, 300);
    },
  },

  methods: {
    async fetchGroups() {
      try {
        this.loading = true;
        const res = await getGroups();
        this.groups = res.data;
      } catch (err) {
        console.error(err);
      } finally {
        this.loading = false;
      }
    },

    nextPage() {
      if (this.currentPage < this.totalPages) this.currentPage++;
    },

    prevPage() {
      if (this.currentPage > 1) this.currentPage--;
    },

    async addPoints(group) {
      const { value: points } = await Swal.fire({
        title: "Agregar puntos",
        input: "number",
        inputLabel: "Puntos",
        showCancelButton: true,
      });
      if (!points) return;

      const { value: description } = await Swal.fire({
        title: "Motivo",
        input: "text",
        showCancelButton: true,
      });

      await addGroupPoints(group._id, {
        points: Number(points),
        description,
      });

      Swal.fire("Hecho", "Puntos agregados", "success");
      this.fetchGroups();
    },

    async subtractPoints(group) {
      const { value: points } = await Swal.fire({
        title: "Restar puntos",
        input: "number",
        inputLabel: "Puntos",
        showCancelButton: true,
      });
      if (!points) return;

      const { value: description } = await Swal.fire({
        title: "Motivo",
        input: "text",
        showCancelButton: true,
      });

      await subtractGroupPoints(group._id, {
        points: Number(points),
        description,
      });

      Swal.fire("Hecho", "Puntos restados", "success");
      this.fetchGroups();
    },
  },

  mounted() {
    this.fetchGroups();
  },
};
</script>
