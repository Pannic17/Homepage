import {createRouter, createWebHashHistory} from "vue-router";

import Home from "../pages/Home.vue"
import About from "../pages/About.vue"

const routes = [
    {
        path: '/',
        name: 'Home',
        component: Home
    },
    {
        path: '/about',
        name: 'About',
        title: 'About',
        component: About
    },
    {
        path: '/game',
        name: 'Game',
        title: 'Game Design',
        component: () => import('../pages/Game.vue')
    },
    {
        path: '/project',
        name: 'Project',
        title: 'Project',
        component: () => import('../pages/Project.vue')
    },
    {
        path: '/artwork',
        name: 'Artwork',
        title: 'Artwork',
        component: () => import('../pages/Artwork.vue')
    },
    {
        path: '/contact',
        name: 'Contact',
        title: 'Contact',
        component: () => import('../pages/Contact.vue')
    }
]

const router = createRouter({
    history: createWebHashHistory(),
    routes
})

export default router