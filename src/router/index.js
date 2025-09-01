import { createRouter, createWebHistory } from 'vue-router'

//pages i have
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

  // top colume buttoms
  { path: '/students', name: 'ForStudents', component: ForStudentsPage },
  { path: '/parents', name: 'ForParents', component: ForParentsPage },
  { path: '/educators', name: 'ForEducators', component: ForEducatorsPage },
  { path: '/news', name: 'NewsUpdates', component: NewsUpdatesPage },
  { path: '/resources', name: 'Resources', component: ResourcesPage },
  { path: '/about', name: 'AboutUs', component: AboutUsPage },

  { path: '/signup', name: 'SignUp', component: SignUpPage },
  { path: '/login', name: 'Login', component: LoginPage },
  { path: '/account', name: 'MyAccount', component: MyAccountPage },

  // 404
  { path: '/:pathMatch(.*)*', name: 'NotFound', component: NotFoundPage },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 }
  },
})

export default router
