<template>
  <div class="container my-4">
    <h3>Agregar Persona</h3>

    <!-- Loading inicial -->
    <div v-if="loadingGroups" class="d-flex justify-content-center my-5">
      <div class="spinner-border text-primary"></div>
    </div>

    <!-- Form -->
    <form v-else @submit.prevent="handleSubmit">
      <div class="mb-3">
        <label class="form-label">Nombre Completo</label>
        <input type="text" v-model="fullName" class="form-control" required />
      </div>

      <div class="mb-3">
        <label class="form-label">Grupo</label>
        <select v-model="group" class="form-select" required>
          <option value="" disabled>Seleccione un grupo</option>
          <option v-for="g in groups" :key="g._id" :value="g._id">
            {{ g.name }}
          </option>
        </select>
      </div>

      <div class="mb-3">
        <label class="form-label">Tipo</label>
        <select v-model="type" class="form-select">
          <option value="MIEMBRO">Miembro</option>
          <option value="VISITA">Visita</option>
        </select>
      </div>

      <div class="d-flex gap-2">
        <button type="submit" class="btn btn-primary" :disabled="loadingSubmit">
          <span
            v-if="loadingSubmit"
            class="spinner-border spinner-border-sm me-2"
          ></span>
          Agregar
        </button>

        <button
          type="button"
          class="btn btn-outline-secondary"
          :disabled="loadingSubmit"
          @click="handleCancel"
        >
          Cancelar
        </button>
      </div>
    </form>
  </div>
</template>
<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import Swal from "sweetalert2";
import { getGroups, addPerson } from "../../services/api.js";

const router = useRouter();

// State
const fullName = ref("");
const group = ref("");
const type = ref("MIEMBRO");
const groups = ref([]);

const loadingGroups = ref(false);
const loadingSubmit = ref(false);

// Cargar grupos
const fetchGroups = async () => {
  try {
    loadingGroups.value = true;
    const res = await getGroups();
    groups.value = res.data;
  } catch (err) {
    Swal.fire("Error", "No se pudieron cargar los grupos", "error");
  } finally {
    loadingGroups.value = false;
  }
};

onMounted(fetchGroups);

// Enviar formulario
const handleSubmit = async () => {
  try {
    loadingSubmit.value = true;

    await addPerson({
      fullName: fullName.value,
      group: group.value,
      type: type.value,
    });

    Swal.fire("Éxito", "Persona agregada", "success");

    router.push("/persons"); // 👈 volver al listado
  } catch (err) {
    Swal.fire("Error", "No se pudo agregar la persona", "error");
  } finally {
    loadingSubmit.value = false;
  }
};

// Cancelar
const handleCancel = () => {
  router.push("/persons"); // 👈 volver al listado
};
</script>
