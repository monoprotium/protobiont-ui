import {
  createRouter,
  createWebHistory,
  type RouteRecordRaw,
} from 'vue-router'
import registry from '../../cli/src/registry.json'

export interface GalleryEntry {
  name: string
  folder: string
  category: string
  description: string
  demoLoader: (() => Promise<unknown>) | null
}

// auto-discovery: a component folder with a .demo.vue appears with zero registration
const demoModules = import.meta.glob('../../templates/components/*/*.demo.vue')

function demoLoaderFor(folder: string) {
  const key = Object.keys(demoModules).find((k) =>
    k.includes(`/components/${folder}/`),
  )
  return key ? demoModules[key] : null
}

export const gallery: GalleryEntry[] = Object.values(registry)
  .map((entry) => ({
    name: entry.name,
    folder: entry.folder,
    category: entry.category,
    description: entry.description,
    demoLoader: demoLoaderFor(entry.folder),
  }))
  .sort((a, b) => a.name.localeCompare(b.name))

const routes: RouteRecordRaw[] = [
  { path: '/', component: () => import('./pages/HomeView.vue') },
  { path: '/seeds', component: () => import('./pages/SeedsView.vue') },
  { path: '/ink', component: () => import('./pages/InkView.vue') },
  { path: '/arbitrary', component: () => import('./pages/ArbitraryView.vue') },
  { path: '/forms', component: () => import('./pages/FormsView.vue') },
  { path: '/theming', component: () => import('./pages/ThemingView.vue') },
  { path: '/icons', component: () => import('./pages/IconsView.vue') },
  { path: '/scrollbar', component: () => import('./pages/ScrollbarView.vue') },
  { path: '/elevation', component: () => import('./pages/ElevationView.vue') },
  { path: '/splash', component: () => import('./pages/SplashView.vue') },
  { path: '/checkout', component: () => import('./pages/CheckoutView.vue') },
  {
    path: '/c/:folder',
    component: () => import('./pages/ComponentView.vue'),
    props: true,
  },
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
})
