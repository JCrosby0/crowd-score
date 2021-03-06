import Vue from 'vue'
import Router from 'vue-router'
import { normalizeURL, decode } from 'ufo'
import { interopDefault } from './utils'
import scrollBehavior from './router.scrollBehavior.js'

const _6750085f = () => interopDefault(import('../pages/score.vue' /* webpackChunkName: "pages/score" */))
const _704527fe = () => interopDefault(import('../pages/score-baseball-test.vue' /* webpackChunkName: "pages/score-baseball-test" */))
const _18a51e1a = () => interopDefault(import('../pages/scoreAu.vue' /* webpackChunkName: "pages/scoreAu" */))
const _8f6e5ac2 = () => interopDefault(import('../pages/index.vue' /* webpackChunkName: "pages/index" */))

const emptyFn = () => {}

Vue.use(Router)

export const routerOptions = {
  mode: 'history',
  base: '/',
  linkActiveClass: 'nuxt-link-active',
  linkExactActiveClass: 'nuxt-link-exact-active',
  scrollBehavior,

  routes: [{
    path: "/score",
    component: _6750085f,
    name: "score"
  }, {
    path: "/score-baseball-test",
    component: _704527fe,
    name: "score-baseball-test"
  }, {
    path: "/scoreAu",
    component: _18a51e1a,
    name: "scoreAu"
  }, {
    path: "/",
    component: _8f6e5ac2,
    name: "index"
  }],

  fallback: false
}

export function createRouter (ssrContext, config) {
  const base = (config._app && config._app.basePath) || routerOptions.base
  const router = new Router({ ...routerOptions, base  })

  // TODO: remove in Nuxt 3
  const originalPush = router.push
  router.push = function push (location, onComplete = emptyFn, onAbort) {
    return originalPush.call(this, location, onComplete, onAbort)
  }

  const resolve = router.resolve.bind(router)
  router.resolve = (to, current, append) => {
    if (typeof to === 'string') {
      to = normalizeURL(to)
    }
    return resolve(to, current, append)
  }

  return router
}
