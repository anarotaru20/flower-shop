import { createRouter, createWebHistory } from 'vue-router'

const HomeView = () => import('@/views/HomeView.vue')
const LoginView = () => import('@/views/LoginView.vue')
const RegisterView = () => import('@/views/RegisterView.vue')
const ForgotPasswordView = () => import('@/views/ForgotPasswordView.vue')
const ResetPasswordView = () => import('@/views/ResetPasswordView.vue')
const ProductsView = () => import('@/views/ProductsView.vue')
const ProductDetailView = () => import('@/views/ProductDetailView.vue')
const CartView = () => import('@/views/CartView.vue')
const CheckoutView = () => import('@/views/CheckoutView.vue')
const OrdersView = () => import('@/views/OrdersView.vue')
const ProfileView = () => import('@/views/ProfileView.vue')
const QrView = () => import('@/views/QrView.vue')
const AdminLayout = () => import('@/components/layout/AdminLayout.vue')
const AdminDashboardView = () => import('@/views/admin/AdminDashboardView.vue')
const AdminProductsView = () => import('@/views/admin/AdminProductsView.vue')
const AdminOrdersView = () => import('@/views/admin/AdminOrdersView.vue')
const AdminReportsView = () => import('@/views/admin/AdminReportsView.vue')
const AdminUsersView = () => import('@/views/admin/AdminUsersView.vue')

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