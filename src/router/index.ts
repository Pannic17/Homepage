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
        component: () => import('../pages/project/Project.vue'),
    },
    {
        path: '/web-three-js',
        name: 'Three',
        component: () => import('../pages/project/Three.vue'),
        children: [
            {
                path: '/web-three-js/01',
                name: '01',
                component: () => import('../components/three_01.vue')
            },
            {
                path: '/web-three-js/02',
                name: '02',
                component: () => import('../components/three_02.vue')
            },
            {
                path: '/web-three-js/03',
                name: '03',
                component: () => import('../components/three_03.vue')
            },
            {
                path: '/web-three-js/04',
                name: '04',
                component: () => import('../components/three_04.vue')
            },
            {
                path: '/web-three-js/05',
                name: '05',
                component: () => import('../components/three_05.vue')
            }
        ]
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