import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import SignIn from "@/views/SignIn";
import SignUp from "@/views/SignUp";
import BuildDeck from "@/views/BuildDeck";
import Build from "../views/Build";

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
    component: Build
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
  routes
})

export default router
