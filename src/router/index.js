import { createRouter, createWebHistory } from "vue-router";
import Home from "../views/Home.vue";
import ProductDetail from "../views/ProductDetail.vue";
import Cart from "../views/Cart.vue";
import Checkout from "../views/Checkout.vue";
import CategoryProducts from "../views/CategoryProducts.vue";
import About from "../views/About.vue";
import Contact from "../views/Contact .vue";
import Loginapp from "../views/Loginapp.vue";
import ForgotPassword from "../views/ForgotPassword.vue";
import Register from "../views/Register.vue";

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
    path: "/forgot-password",
    name: "ForgotPassword",
    component: ForgotPassword,
  },
  {
    path: "/register",
    name: "Register",
    component: Register,
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
