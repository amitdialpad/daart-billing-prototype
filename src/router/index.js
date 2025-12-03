import { createRouter, createWebHashHistory } from 'vue-router'
import ScenarioA from '../pages/ScenarioA.vue'
import ScenarioB from '../pages/ScenarioB.vue'

const routes = [
  {
    path: '/',
    redirect: '/scenario-a'
  },
  {
    path: '/scenario-a',
    name: 'ScenarioA',
    component: ScenarioA,
    meta: {
      title: 'Scenario A: Upfront Credits',
      breadcrumb: 'ADMIN / DIALPADBETA / BILLING / CREDITS (SCENARIO A)'
    }
  },
  {
    path: '/scenario-b',
    name: 'ScenarioB',
    component: ScenarioB,
    meta: {
      title: 'Scenario B: Tiered Rates',
      breadcrumb: 'ADMIN / DIALPADBETA / BILLING / CREDITS (SCENARIO B)'
    }
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
