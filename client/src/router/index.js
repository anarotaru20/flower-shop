import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import LoginView from '@/views/LoginView.vue'
import RegisterView from '@/views/RegisterView.vue'
import ForgotPasswordView from '@/views/ForgotPasswordView.vue'
import ResetPasswordView from '@/views/ResetPasswordView.vue'
import ProductsView from '@/views/ProductsView.vue'
import ProductDetailView from '@/views/ProductDetailView.vue'
import CartView from '@/views/CartView.vue'
import CheckoutView from '@/views/CheckoutView.vue'
import OrdersView from '@/views/OrdersView.vue'
import ProfileView from '@/views/ProfileView.vue'
import QrView from '@/views/QrView.vue'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import AdminDashboardView from '@/views/admin/AdminDashboardView.vue'
import AdminProductsView from '@/views/admin/AdminProductsView.vue'
import AdminOrdersView from '@/views/admin/AdminOrdersView.vue'
import AdminReportsView from '@/views/admin/AdminReportsView.vue'
import AdminUsersView from '@/views/admin/AdminUsersView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterView,
    },
    {
      path: '/forgot-password',
      name: 'forgot-password',
      component: ForgotPasswordView,
    },
    {
      path: '/reset-password',
      name: 'reset-password',
      component: ResetPasswordView,
    },
    {
      path: '/products',
      name: 'products',
      component: ProductsView,
    },
    {
      path: '/products/:slug',
      name: 'product-detail',
      component: ProductDetailView,
    },
    {
      path: '/cart',
      name: 'cart',
      component: CartView,
    },
    {
      path: '/checkout',
      name: 'checkout',
      component: CheckoutView,
    },
    {
      path: '/orders',
      name: 'orders',
      component: OrdersView,
    },
    {
      path: '/profile',
      name: 'profile',
      component: ProfileView,
      meta: { requiresAuth: true },
    },
    {
      path: '/qr/:token',
      name: 'qr',
      component: QrView,
    },
    {
      path: '/admin',
      component: AdminLayout,
      children: [
        {
          path: '',
          name: 'admin-dashboard',
          component: AdminDashboardView,
        },
        {
          path: 'products',
          name: 'admin-products',
          component: AdminProductsView,
        },
        {
          path: 'orders',
          name: 'admin-orders',
          component: AdminOrdersView,
        },
        {
          path: 'reports',
          name: 'admin-reports',
          component: AdminReportsView,
        },
        {
          path: 'users',
          name: 'admin-users',
          component: AdminUsersView,
        },
      ],
    },
  ],
})

export default router
