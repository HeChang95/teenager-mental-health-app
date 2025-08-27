// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'

// Pages
import HomePage from '../pages/HomePage.vue'
import ForStudentsPage from '../pages/ForStudentsPage.vue'
import GetHelpNowPage from '../pages/GetHelpNowPage.vue'
import AnxietyManagementPage from '../pages/AnxietyManagementPage.vue'
import StudySupportPage from '../pages/StudySupportPage.vue'
import PeerCommunityPage from '../pages/PeerCommunityPage.vue'
import MyAccountPage from '../pages/MyAccountPage.vue'
import ForParentsPage from '../pages/ForParentsPage.vue'
import ForEducatorsPage from '../pages/ForEducatorsPage.vue'
import NewsUpdatesPage from '../pages/NewsUpdatesPage.vue'
import ResourcesPage from '../pages/ResourcesPage.vue'
import AboutUsPage from '../pages/AboutUsPage.vue'

// New for A1.2 (validations + dynamic data)
import SignUpPage from '../pages/SignUpPage.vue'
import WellnessCheckPage from '../pages/WellnessCheckPage.vue'

// 404
import NotFoundPage from '../pages/NotFoundPage.vue'

const routes = [
  { path: '/', name: 'home', component: HomePage },
  { path: '/students', component: ForStudentsPage },
  { path: '/get-help-now', component: GetHelpNowPage },
  { path: '/anxiety', component: AnxietyManagementPage },
  { path: '/study', component: StudySupportPage },
  { path: '/community', component: PeerCommunityPage },
  { path: '/account', component: MyAccountPage },
  { path: '/parents', component: ForParentsPage },
  { path: '/educators', component: ForEducatorsPage },
  { path: '/news', component: NewsUpdatesPage },
  { path: '/resources', component: ResourcesPage },
  { path: '/about', component: AboutUsPage },

  // A1.2 new routes
  { path: '/signup', component: SignUpPage },
  { path: '/wellness-check', component: WellnessCheckPage },

  // 404 (must be last)
  { path: '/:pathMatch(.*)*', name: 'not-found', component: NotFoundPage },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
