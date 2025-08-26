// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'

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

const routes = [
  { path: '/', name: 'home', component: HomePage },
  { path: '/for-students', name: 'for-students', component: ForStudentsPage },
  { path: '/get-help-now', name: 'get-help-now', component: GetHelpNowPage },
  { path: '/anxiety-management', name: 'anxiety-management', component: AnxietyManagementPage },
  { path: '/study-support', name: 'study-support', component: StudySupportPage },
  { path: '/peer-community', name: 'peer-community', component: PeerCommunityPage },
  { path: '/my-account', name: 'my-account', component: MyAccountPage },
  { path: '/for-parents', name: 'for-parents', component: ForParentsPage },
  { path: '/for-educators', name: 'for-educators', component: ForEducatorsPage },
  { path: '/news-updates', name: 'news-updates', component: NewsUpdatesPage },
  { path: '/resources', name: 'resources', component: ResourcesPage },
  { path: '/about-us', name: 'about-us', component: AboutUsPage },

  { path: '/:pathMatch(.*)*', redirect: '/' },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 }
  },
})

export default router
