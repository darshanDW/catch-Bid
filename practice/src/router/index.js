import { createRouter, createWebHistory } from 'vue-router'
import Allauction from '../components/Allauction.vue';
import Myauction from '../components/Myauction.vue';
import CreateAuction from '../components/CreateAuction.vue';
import Bid from '../components/Bid.vue';
const routes = [

  {
    path: '/allauction/:x',
    name: 'Allauction',
    component: Allauction,
  },
  {
    path: '/Myauction/:x',
    name: 'Myauction',
    component: Myauction,

  },
  {
    path: '/CreateAuction/:x',
    name: 'CreateAuction',
    component: CreateAuction,
  },
  {
    path: '/Bid',
    name: 'Bid',
    component: Bid,
    props: true
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router
