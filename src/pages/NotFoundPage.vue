<!-- src/pages/NotFoundPage.vue -->
<template>
  <section class="text-center py-5">
    <h1 class="display-5 fw-bold">404 - Page Not Found</h1>
    <p class="lead mt-3">The page you are looking for does not exist.</p>
    <RouterLink to="/" class="btn btn-primary mt-3">Back to Home</RouterLink>

    <div class="mt-4">
      <p class="mb-2">Quick links:</p>
      <RouterLink class="me-3" to="/students">For Students</RouterLink>
      <RouterLink class="me-3" to="/news">News</RouterLink>
      <RouterLink to="/resources">Resources</RouterLink>
    </div>
  </section>
</template>

<script setup>
import { RouterLink } from 'vue-router'
</script>
