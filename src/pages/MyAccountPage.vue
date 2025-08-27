<template>
  <div class="container py-4">
    <h1 class="h3">My Account Page</h1>
    <p>This is the My Account page</p>

    <RouterLink class="btn btn-outline-primary mt-3" :to="{ name: 'MyAccountDashboard' }">
      Go to Dashboard
    </RouterLink>
  </div>
</template>

<script setup></script>

<style scoped>
/* optional */
</style>
