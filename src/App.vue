<script setup></script>

<template>
  <div class="app">
    <header class="container">
      <h1 class="brand">Teen Health App</h1>
      <nav class="nav">
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/for-students">For Students</RouterLink>
        <RouterLink to="/get-help-now">Get Help Now</RouterLink>
        <RouterLink to="/anxiety-management">Anxiety</RouterLink>
        <RouterLink to="/study-support">Study Support</RouterLink>
        <RouterLink to="/peer-community">Peer Community</RouterLink>
        <RouterLink to="/my-account">My Account</RouterLink>
        <RouterLink to="/for-parents">For Parents</RouterLink>
        <RouterLink to="/for-educators">For Educators</RouterLink>
        <RouterLink to="/news-updates">News & Updates</RouterLink>
        <RouterLink to="/resources">Resources</RouterLink>
        <RouterLink to="/about-us">About Us</RouterLink>
      </nav>
    </header>

    <main class="container">
      <RouterView />
    </main>
  </div>
</template>

<script setup>
import { RouterLink, RouterView } from 'vue-router'
</script>

<style scoped>
.container {
  max-width: 1040px;
  margin: 0 auto;
  padding: 16px;
}
.brand {
  margin: 0 0 8px;
}
.nav {
  display: flex;
  flex-wrap: wrap;
  gap: 8px 12px;
  margin-bottom: 12px;
}
.nav a {
  text-decoration: none;
  padding: 6px 10px;
  border-radius: 6px;
  border: 1px solid #e5e7eb;
}
.nav a.router-link-active {
  background: #eef2ff;
  border-color: #6366f1;
}
</style>
