import { createRouter, createWebHistory } from "vue-router";
// Vuex store'u buraya import etmelisiniz!
import store from './../store'; // Varsayılan Vuex store yolu

import Home from "../views/Home.vue";
import ProductDetail from "../views/ProductDetail.vue";
import Cart from "../views/Cart.vue";
import Checkout from "../views/Checkout.vue";
import CategoryProducts from "../views/CategoryProducts.vue";
import About from "../views/About.vue";
import Contact from "../views/Contact .vue";
import Loginapp from "../views/Loginapp.vue";
import Register from "../views/Register.vue";
import ForgotPassword from "../views/ForgotPassword.vue";
import UserProfile from "../userPages/UserProfile.vue"; // Doğru yol: userPages/UserProfile.vue
import ResetPassword from "../views/ResetPassword.vue";

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/about",
    name: "About",
    component: About,
  },
  {
    path: "/contact",
    name: "Contact",
    component: Contact,
  },
  {
    path: "/product/:id",
    name: "ProductDetail",
    component: ProductDetail,
    props: true,
  },
  {
    path: "/cart",
    name: "Cart",
    component: Cart,
  },
  {
    path: "/checkout",
    name: "Checkout",
    component: Checkout,
  },
  {
    path: '/account', 
    name: 'UserProfile',
    component: UserProfile,
    meta: { requiresAuth: true }
  },
  {
    path: "/category/:slug",
    name: "CategoryProducts",
    component: CategoryProducts,
    props: true,
  },
  {
    path: "/login",
    name: "Loginapp",
    component: Loginapp,
  },
  {
    path: "/register",
    name: "Register",
    component: Register,
  },
  {
    path: "/forgot-password",
    name: "ForgotPassword",
    component: ForgotPassword,
  },
  {
    path: "/kvkk-aydinlatma-metni",
    name: "KvkkAydinlatmaMetni",
    component: () => import('../views/KvkkAydinlatmaMetni.vue')
  },
  {
    path: "/reset-password",
    name: "ResetPassword",
    component: ResetPassword
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Global Navigasyon Koruması (Navigation Guard)
router.beforeEach((to, from, next) => {
  // `store` objesi artık import edildiği için burada erişilebilir.
  if (to.meta.requiresAuth && !store.getters.isAuthenticated) {
    next('/login'); // Giriş sayfasına yönlendir
  } else {
    next(); // Devam et
  }
});

export default router;