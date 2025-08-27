<!-- src/App.vue -->
<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-light">
    <div class="container">
      <RouterLink to="/" class="navbar-brand">Teen Health</RouterLink>

      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navMain"
      >
        <span class="navbar-toggler-icon"></span>
      </button>

      <div id="navMain" class="collapse navbar-collapse">
        <ul class="navbar-nav me-auto">
          <li class="nav-item">
            <RouterLink class="nav-link" to="/students">For Students</RouterLink>
          </li>
          <li class="nav-item">
            <RouterLink class="nav-link" to="/get-help-now">Get Help Now</RouterLink>
          </li>
          <li class="nav-item"><RouterLink class="nav-link" to="/anxiety">Anxiety</RouterLink></li>
          <li class="nav-item">
            <RouterLink class="nav-link" to="/study">Study Support</RouterLink>
          </li>
          <li class="nav-item">
            <RouterLink class="nav-link" to="/community">Peer Community</RouterLink>
          </li>
          <li class="nav-item"><RouterLink class="nav-link" to="/news">News</RouterLink></li>
          <li class="nav-item">
            <RouterLink class="nav-link" to="/resources">Resources</RouterLink>
          </li>
          <li class="nav-item"><RouterLink class="nav-link" to="/about">About</RouterLink></li>
        </ul>

        <ul class="navbar-nav">
          <li class="nav-item"><RouterLink class="nav-link" to="/signup">Sign Up</RouterLink></li>
          <li class="nav-item">
            <RouterLink class="nav-link" to="/wellness-check">Wellness Check</RouterLink>
          </li>
        </ul>
      </div>
    </div>
  </nav>

  <main class="container py-4">
    <RouterView />
  </main>
</template>

<script setup>
import { RouterLink, RouterView } from 'vue-router'
</script>
