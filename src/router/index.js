import { createRouter, createWebHistory } from 'vue-router'
import { auth } from '@/firebase'

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

const routes = [
  { path: '/', name: 'Home', component: HomePage },

  {
    path: '/students',
    name: 'ForStudents',
    component: ForStudentsPage,
    meta: { requiresAuth: true, roles: ['student'] },
  },
  {
    ppath: '/parents',
    name: 'ForParents',
    component: ForParentsPage,
    meta: { requiresAuth: true, roles: ['parent'] },
  },
  { path: '/educators', name: 'ForEducators', component: ForEducatorsPage },
  { path: '/news', name: 'NewsUpdates', component: NewsUpdatesPage },
  { path: '/resources', name: 'Resources', component: ResourcesPage },
  { path: '/about', name: 'AboutUs', component: AboutUsPage },

  { path: '/signup', name: 'SignUp', component: SignUpPage },
  { path: '/login', name: 'Login', component: LoginPage },

  // Require login & role (e.g. only student/parent are allowed)
  {
    path: '/account',
    name: 'MyAccount',
    component: MyAccountPage,
    meta: { requiresAuth: true, roles: ['student', 'parent'] },
  },

  { path: '/:pathMatch(.*)*', name: 'NotFound', component: NotFoundPage },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 }
  },
})

// guard: 1) Verify if logged in &     2) Verify role
router.beforeEach((to, from, next) => {
  if (!to.meta?.requiresAuth) return next()

  const user = auth.currentUser
  if (!user) {
    return next({ name: 'Login', query: { denied: 1 } })
  }

  if (to.meta.roles && to.meta.roles.length) {
    const role = localStorage.getItem('userRole')
    if (!role || !to.meta.roles.includes(role)) {
      // No permission: Jump back to the account page (or Home) with a prompt
      return next({ name: 'MyAccount', query: { denied: 1 } })
    }
  }

  next()
})

export default router
