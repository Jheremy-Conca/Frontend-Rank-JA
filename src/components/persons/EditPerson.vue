<template>
  <div class="container my-4">
    <h3>Editar Persona</h3>

    <!-- Loading -->
    <div v-if="loading" class="d-flex justify-content-center my-5">
      <div class="spinner-border text-primary"></div>
    </div>

    <!-- Formulario -->
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
          Guardar cambios
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
import { useRoute, useRouter } from "vue-router";
import Swal from "sweetalert2";
import { getGroups, getPersonById, updatePerson } from "../../services/api.js";

const route = useRoute();
const router = useRouter();

const fullName = ref("");
const group = ref("");
const type = ref("MIEMBRO");
const groups = ref([]);

const loading = ref(false);
const loadingSubmit = ref(false);

/* =======================
   CARGAR GRUPOS
======================= */
const fetchGroups = async () => {
  const res = await getGroups();
  groups.value = res.data;
};

/* =======================
   CARGAR PERSONA
======================= */
const fetchPerson = async () => {
  try {
    loading.value = true;

    const res = await getPersonById(route.params.id);

    fullName.value = res.data.fullName;
    group.value = res.data.group?._id || "";
    type.value = res.data.type || "MIEMBRO";
  } catch (error) {
    Swal.fire("Error", "No se pudo cargar la persona", "error");
    router.push("/persons");
  } finally {
    loading.value = false;
  }
};

onMounted(async () => {
  await fetchGroups();
  await fetchPerson();
});

/* =======================
   GUARDAR CAMBIOS
======================= */
const handleSubmit = async () => {
  try {
    loadingSubmit.value = true;

    await updatePerson(route.params.id, {
      fullName: fullName.value,
      group: group.value,
      type: type.value,
    });

    Swal.fire("Éxito", "Persona actualizada correctamente", "success");
    router.push("/persons");
  } catch (error) {
    Swal.fire("Error", "No se pudo actualizar la persona", "error");
  } finally {
    loadingSubmit.value = false;
  }
};

/* =======================
   CANCELAR
======================= */
const handleCancel = () => {
  router.push("/persons");
};
</script>
