<template>
  <nav class="navbar navbar-expand-lg" style="background-color: #0000ff">
    <div class="container d-flex align-items-center">
      <!-- Logo -->
      <img
        src="../../assets/logoJA.png"
        alt="Logo JA"
        class="me-2"
        style="height: 40px; border: 2px solid #ffff00; border-radius: 5px"
      />

      <!-- Título -->
      <a class="navbar-brand mb-0 h1 text-white" href="/">JA Scoreboard</a>

      <!-- Botón responsive -->
      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNav"
        style="border-color: #ffff00"
      >
        <span
          class="navbar-toggler-icon"
          style="filter: invert(1) sepia(1) saturate(10) hue-rotate(50deg)"
        ></span>
      </button>

      <!-- Menú -->
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav ms-auto">
          <li class="nav-item">
            <router-link
              class="nav-link text-white"
              active-class="active-link"
              to="/"
            >
              Dashboard
            </router-link>
          </li>

          <li class="nav-item">
            <router-link
              class="nav-link text-white"
              active-class="active-link"
              to="/groups"
            >
              Grupos
            </router-link>
          </li>

          <li class="nav-item">
            <router-link
              class="nav-link text-white"
              active-class="active-link"
              to="/persons"
            >
              Personas
            </router-link>
          </li>

          <li class="nav-item">
            <router-link
              class="nav-link text-white"
              active-class="active-link"
              to="/activities"
            >
              Actividades
            </router-link>
          </li>

          <!-- 🔥 Ranking Personas -->
          <li class="nav-item">
            <router-link
              class="nav-link text-white"
              active-class="active-link"
              to="/ranking/persons"
            >
              Ranking Personas
            </router-link>
          </li>

          <!-- 🏆 Ranking Grupos -->
          <li class="nav-item">
            <router-link
              class="nav-link text-white"
              active-class="active-link"
              to="/ranking/groups"
            >
              Ranking Grupos
            </router-link>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>
