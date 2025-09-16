<template>
  <div class="container mt-4">
    <!-- titles -->
    <div class="row mb-5">
      <div class="col-12 text-center">
        <h1 class="display-5 mb-2">Youth Mental Health Support</h1>
        <p class="text-muted">Help for VCE students with exam stress and worry</p>
      </div>
    </div>

    <!-- three main cards -->
    <div class="row mb-5">
      <div class="col-12 col-md-6 col-lg-4 mb-3">
        <div class="card h-100 text-center">
          <div class="card-body">
            <h3 class="text-primary">FOR STUDENTS</h3>
            <p class="mb-3">Get help with exam worry and study problems</p>
            <router-link class="btn btn-primary" :to="{ name: 'ForStudents' }">
              Get Help Now
            </router-link>
          </div>
        </div>
      </div>

      <div class="col-12 col-md-6 col-lg-4 mb-3">
        <div class="card h-100 text-center">
          <div class="card-body">
            <h3 class="text-warning">FOR PARENTS</h3>
            <p class="mb-3">Learn how to help your child with exam stress</p>
            <router-link class="btn btn-warning" :to="{ name: 'ForParents' }">
              Parent Help
            </router-link>
          </div>
        </div>
      </div>

      <div class="col-12 col-md-6 col-lg-4 mb-3">
        <div class="card h-100 text-center">
          <div class="card-body">
            <h3 class="text-info">FOR EDUCATORS</h3>
            <p class="mb-3">Tools to help students with mental health</p>
            <router-link class="btn btn-info" :to="{ name: 'ForEducators' }">
              Teacher Tools
            </router-link>
          </div>
        </div>
      </div>
    </div>

    <!-- student cards -->
    <div class="row mb-4">
      <div class="col-12">
        <h3 class="mb-3">Students We Are Helping</h3>
        <div class="row">
          <div class="col-12 col-md-6 col-lg-4 mb-3" v-for="s in studentList" :key="s.id">
            <div class="card h-100">
              <div class="card-header">{{ s.name }} - {{ s.yearLevel }}</div>
              <div class="card-body">
                <p><strong>How worried:</strong> {{ s.anxietyLevel }}</p>
                <p><strong>Main problem:</strong> {{ s.stressType }}</p>
                <p class="mb-1"><strong>School subjects:</strong></p>
                <ul class="mb-2">
                  <li v-for="sub in s.subjects" :key="sub">{{ sub }}</li>
                </ul>
                <p><strong>Needs help with:</strong> {{ s.helpSeeking }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- resource card -->
    <div class="row">
      <div class="col-12">
        <h3 class="mb-3">Quick Help Resources</h3>
        <div class="row">
          <div class="col-12 col-md-6 mb-3" v-for="r in resourceList" :key="r.id">
            <div class="card h-100">
              <div class="card-body">
                <h5 class="card-title">{{ r.title }}</h5>
                <p class="card-text">{{ r.description }}</p>
                <p class="mb-1"><strong>Time needed:</strong> {{ r.duration }}</p>
                <p class="mb-2"><strong>How hard:</strong> {{ r.difficulty }}</p>
                <span class="badge bg-primary">{{ r.category }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- access denied notice (bottom) -->
    <div v-if="denied" class="alert alert-warning mt-4" role="alert">
      You don’t have permission to access that page. Please sign in with the correct role.
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import studentJson from '@/assets/json/students.json'
import resourceJson from '@/assets/json/resources.json'

const studentList = ref(studentJson)
const resourceList = ref(resourceJson)

// handle denied=1, give a singn
const route = useRoute()
const router = useRouter()
const denied = ref(false)

function syncDeniedFromQuery() {
  const v = route.query.denied
  denied.value = v === '1' || v === 1 || v === true
  // clear the query after few second，avoid show it all the time
  if (denied.value) {
    setTimeout(() => {
      const q = { ...route.query }
      delete q.denied
      router.replace({ query: q })
    }, 3500)
  }
}

onMounted(syncDeniedFromQuery)
watch(() => route.query.denied, syncDeniedFromQuery)
</script>
