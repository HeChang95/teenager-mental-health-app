// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import { auth } from '@/firebase'
import { onAuthStateChanged } from 'firebase/auth'

// pages
import HomePage from '@/pages/HomePage.vue'
import ForStudentsPage from '@/pages/ForStudentsPage.vue'
import ForParentsPage from '@/pages/ForParentsPage.vue'
import ForEducatorsPage from '@/pages/ForEducatorsPage.vue'
import NewsUpdatesPage from '@/pages/NewsUpdatesPage.vue'
import ResourcesPage from '@/pages/ResourcesPage.vue'
import AboutUsPage from '@/pages/AboutUsPage.vue'
import NotFoundPage from '@/pages/NotFoundPage.vue'
import SignUpPage from '@/pages/SignUpPage.vue'
import LoginPage from '@/pages/LoginPage.vue'
import MyAccountPage from '@/pages/MyAccountPage.vue'
import ResourcesTable from '@/pages/ResourcesTable.vue'
import StudyTasksTable from '@/pages/StudyTasksTable.vue'

const routes = [
  { path: '/', name: 'Home', component: HomePage },

  {
    path: '/students',
    name: 'ForStudents',
    component: ForStudentsPage,
    meta: { requiresAuth: true, roles: ['student'] },
  },
  {
    path: '/parents',
    name: 'ForParents',
    component: ForParentsPage,
    meta: { requiresAuth: true, roles: ['parent'] },
  },
  { path: '/educators', name: 'ForEducators', component: ForEducatorsPage },
  { path: '/news', name: 'NewsUpdates', component: NewsUpdatesPage },
  { path: '/resources', name: 'Resources', component: ResourcesPage },
  { path: '/about', name: 'AboutUs', component: AboutUsPage },

  { path: '/signup', name: 'SignUp', component: SignUpPage, meta: { guestOnly: true } },
  { path: '/login', name: 'Login', component: LoginPage, meta: { guestOnly: true } },
  { path: '/resources-table', name: 'ResourcesTable', component: ResourcesTable },

  // Require login & role (e.g. only student/parent are allowed)
  {
    path: '/account',
    name: 'MyAccount',
    component: MyAccountPage,
    meta: { requiresAuth: true, roles: ['student', 'parent'] },
  },

  { path: '/:pathMatch(.*)*', name: 'NotFound', component: NotFoundPage },
  { path: '/resources-table', name: 'ResourcesTable', component: ResourcesTable },
  {
    path: '/my-tasks',
    name: 'StudyTasks',
    component: StudyTasksTable,
    meta: { requiresAuth: true, roles: ['student', 'parent'] },
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 }
  },
})

// Ensure auth is ready before each guard check
let _authReady
function authReady() {
  if (_authReady) return _authReady
  _authReady = new Promise((resolve) => {
    const un = onAuthStateChanged(auth, () => {
      un()
      resolve()
    })
  })
  return _authReady
}

// guard: 1) Verify if logged in  2) Verify role  3) Prevent logged-in users from accessing guest-only pages
router.beforeEach(async (to) => {
  await authReady()

  if (to.meta?.guestOnly && auth.currentUser) {
    return { name: 'MyAccount' }
  }

  if (!to.meta?.requiresAuth) return true

  const user = auth.currentUser
  if (!user) {
    return { name: 'Login', query: { denied: 1 } }
  }

  if (to.meta.roles && to.meta.roles.length) {
    const role = localStorage.getItem('userRole')
    if (!role || !to.meta.roles.includes(role)) {
      // No permission: Jump back to the account page (or Home) with a prompt
      return { name: 'MyAccount', query: { denied: 1 } }
    }
  }

  return true
})

export default router
