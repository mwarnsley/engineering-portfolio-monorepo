import { createRouter, createWebHistory } from 'vue-router';
import ActivityView from '@/views/ActivityView.vue';
import DashboardView from '@/views/DashboardView.vue';
import MarketsView from '@/views/MarketsView.vue';
import PortfolioView from '@/views/PortfolioView.vue';
import StockDetailView from '@/views/StockDetailView.vue';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'dashboard',
      component: DashboardView,
    },
    {
      path: '/markets',
      name: 'markets',
      component: MarketsView,
    },
    {
      path: '/markets/:symbol',
      name: 'stock-detail',
      component: StockDetailView,
      props: true,
    },
    {
      path: '/portfolio',
      name: 'portfolio',
      component: PortfolioView,
    },
    {
      path: '/activity',
      name: 'activity',
      component: ActivityView,
    },
  ],
  scrollBehavior: () => ({ top: 0 }),
});

export default router;
