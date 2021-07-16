import Vue from 'vue'
import { wrapFunctional } from './utils'

const components = {
  GameInfo: () => import('../../components/GameInfo.vue' /* webpackChunkName: "components/game-info" */).then(c => wrapFunctional(c.default || c)),
  InningsDiamond: () => import('../../components/InningsDiamond.vue' /* webpackChunkName: "components/innings-diamond" */).then(c => wrapFunctional(c.default || c)),
  NuxtLogo: () => import('../../components/NuxtLogo.vue' /* webpackChunkName: "components/nuxt-logo" */).then(c => wrapFunctional(c.default || c)),
  ScoreCard: () => import('../../components/ScoreCard.vue' /* webpackChunkName: "components/score-card" */).then(c => wrapFunctional(c.default || c)),
  Stats: () => import('../../components/Stats.vue' /* webpackChunkName: "components/stats" */).then(c => wrapFunctional(c.default || c)),
  Tutorial: () => import('../../components/Tutorial.vue' /* webpackChunkName: "components/tutorial" */).then(c => wrapFunctional(c.default || c))
}

for (const name in components) {
  Vue.component(name, components[name])
  Vue.component('Lazy' + name, components[name])
}
