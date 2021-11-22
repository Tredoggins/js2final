import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import SignIn from "@/views/SignIn";
import SignUp from "@/views/SignUp";
import BuildDeck from "@/views/BuildDeck";

Vue.use(VueRouter)

const routes = [
  {
    path: '/home',
    name: 'Home',
    component: Home
  },
  {
    path: '/build',
    name: 'Build',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/Build.vue')
  },
  {
    path:'/',
    name:'Sign In',
    component: SignIn
  },
  {
    path:'/signup',
    name:'Sign Up',
    component: SignUp
  },
  {
    path:'/build/:id',
    name:'Edit Deck',
    component: BuildDeck,
    props:true
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
