import { createRouter, createWebHashHistory } from 'vue-router'
import ScenarioA from '../pages/ScenarioA.vue'
import ScenarioBNew from '../pages/ScenarioBNew.vue'
import ScenarioC from '../pages/ScenarioC.vue'
import ScenarioD from '../pages/ScenarioD.vue'
import Notes from '../pages/Notes.vue'

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
      title: 'Scenario A: Recurring Credits',
      breadcrumb: 'ADMIN / DIALPADBETA / BILLING / SCENARIO A'
    }
  },
  {
    path: '/scenario-b',
    name: 'ScenarioB',
    component: ScenarioBNew,
    meta: {
      title: 'Scenario B: Recurring Credits + Committed Packs',
      breadcrumb: 'ADMIN / DIALPADBETA / BILLING / SCENARIO B'
    }
  },
  {
    path: '/scenario-c',
    name: 'ScenarioC',
    component: ScenarioC,
    meta: {
      title: 'Scenario C: Committed Packs Only',
      breadcrumb: 'ADMIN / DIALPADBETA / BILLING / SCENARIO C'
    }
  },
  {
    path: '/scenario-d',
    name: 'ScenarioD',
    component: ScenarioD,
    meta: {
      title: 'Scenario D: Dynamic Tiered Rates',
      breadcrumb: 'ADMIN / DIALPADBETA / BILLING / SCENARIO D'
    }
  },
  {
    path: '/notes',
    name: 'Notes',
    component: Notes,
    meta: {
      title: 'PRD Notes',
      breadcrumb: 'ADMIN / DIALPADBETA / BILLING / NOTES'
    }
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
