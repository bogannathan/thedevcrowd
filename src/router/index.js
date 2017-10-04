import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home'
import Categories from '@/components/Forum/Categories'
import AddThread from '@/components/Forum/AddThread'
import Sampleforum from '@/components/Forum/Sampleforum'
import Signup from '@/components/User/Signup'
import Signin from '@/components/User/Signin'
import Profile from '@/components/User/Profile'
import AuthGuard from './auth-guard'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/categories',
      name: 'Categories',
      component: Categories
    },
    {
      path: '/category/new',
      name: 'AddThread',
      component: AddThread,
      beforeEnter: AuthGuard
    },
    {
      path: '/categories/:id',
      name: 'Sampleforum',
      props: true,
      component: Sampleforum
    },
    {
      path: '/profile',
      name: 'Profile',
      component: Profile,
      beforeEnter: AuthGuard
    },
    {
      path: '/signup',
      name: 'Signup',
      component: Signup
    },
    {
      path: '/signin',
      name: 'Signin',
      component: Signin
    }
  ],
  mode: 'history'
})
