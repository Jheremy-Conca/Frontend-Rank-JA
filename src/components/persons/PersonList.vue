<template>
  <div class="container py-4">
    <div class="d-flex justify-content-between mb-3">
      <h3>Personas</h3>
      <router-link class="btn btn-primary" to="/persons/add">
        Agregar Persona
      </router-link>
    </div>

    <!-- Filtros -->
    <div class="row mb-3">
      <div class="col-md-6">
        <input
          v-model="searchPerson"
          type="text"
          class="form-control"
          placeholder="Buscar por nombre..."
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
      <div class="spinner-border text-primary"></div>
    </div>

    <!-- Tabla -->
    <table v-else class="table table-striped table-hover">
      <thead class="table-dark">
        <tr>
          <th>Nombre</th>
          <th>Grupo</th>
          <th>Tipo</th>
          <th>Puntos</th>
          <th>Acciones</th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="person in paginatedPersons" :key="person._id">
          <td>{{ person.fullName }}</td>
          <td>{{ person.group?.name }}</td>
          <td>{{ person.type }}</td>
          <td>{{ person.points }}</td>
          <td>
            <button
              class="btn btn-success btn-sm me-1"
              @click="addPoints(person)"
            >
              + Puntos
            </button>
            <button
              class="btn btn-danger btn-sm me-1"
              @click="subtractPoints(person)"
            >
              - Puntos
            </button>
            <router-link
              :to="`/persons/edit/${person._id}`"
              class="btn btn-warning btn-sm"
            >
              Editar
            </router-link>
          </td>
        </tr>

        <tr v-if="paginatedPersons.length === 0">
          <td colspan="5" class="text-center text-muted">
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
  getPersons,
  addPersonPoints,
  subtractPersonPoints,
} from "../../services/api.js";
import Swal from "sweetalert2";

export default {
  data() {
    return {
      persons: [],
      searchPerson: "",
      searchGroup: "",
      loading: false,
      currentPage: 1,
      ITEMS_PER_PAGE: 13,
      filterTimeout: null,
    };
  },

  computed: {
    filteredPersons() {
      return this.persons.filter((person) => {
        const name = person.fullName.toLowerCase();
        const group = person.group?.name?.toLowerCase() || "";

        return (
          name.includes(this.searchPerson.toLowerCase()) &&
          group.includes(this.searchGroup.toLowerCase())
        );
      });
    },

    totalPages() {
      return Math.ceil(this.filteredPersons.length / this.ITEMS_PER_PAGE);
    },

    paginatedPersons() {
      const start = (this.currentPage - 1) * this.ITEMS_PER_PAGE;
      return this.filteredPersons.slice(start, start + this.ITEMS_PER_PAGE);
    },
  },

  watch: {
    searchPerson() {
      this.handleFilter();
    },
    searchGroup() {
      this.handleFilter();
    },
  },

  methods: {
    handleFilter() {
      this.loading = true;
      this.currentPage = 1;

      clearTimeout(this.filterTimeout);
      this.filterTimeout = setTimeout(() => {
        this.loading = false;
      }, 300);
    },

    async fetchPersons() {
      try {
        this.loading = true;
        const res = await getPersons();
        this.persons = res.data;
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

    async addPoints(person) {
      const { value: points } = await Swal.fire({
        title: "Agregar puntos",
        input: "number",
        showCancelButton: true,
      });
      if (!points) return;

      const { value: description } = await Swal.fire({
        title: "Motivo",
        input: "text",
        showCancelButton: true,
      });

      await addPersonPoints(person._id, {
        points: Number(points),
        description,
      });

      Swal.fire("Hecho", "Puntos agregados", "success");
      this.fetchPersons();
    },

    async subtractPoints(person) {
      const { value: points } = await Swal.fire({
        title: "Restar puntos",
        input: "number",
        showCancelButton: true,
      });
      if (!points) return;

      const { value: description } = await Swal.fire({
        title: "Motivo",
        input: "text",
        showCancelButton: true,
      });

      await subtractPersonPoints(person._id, {
        points: Number(points),
        description,
      });

      Swal.fire("Hecho", "Puntos restados", "success");
      this.fetchPersons();
    },
  },

  mounted() {
    this.fetchPersons();
  },
};
</script>
