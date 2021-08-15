import Vue from 'vue'
import { wrapFunctional } from './utils'

const components = {
  GameInfo: () => import('../../components/GameInfo.vue' /* webpackChunkName: "components/game-info" */).then(c => wrapFunctional(c.default || c)),
  InningsDiamond: () => import('../../components/InningsDiamond.vue' /* webpackChunkName: "components/innings-diamond" */).then(c => wrapFunctional(c.default || c)),
  InputDiamond: () => import('../../components/InputDiamond.vue' /* webpackChunkName: "components/input-diamond" */).then(c => wrapFunctional(c.default || c)),
  NuxtLogo: () => import('../../components/NuxtLogo.vue' /* webpackChunkName: "components/nuxt-logo" */).then(c => wrapFunctional(c.default || c)),
  ScoreCard: () => import('../../components/ScoreCard.vue' /* webpackChunkName: "components/score-card" */).then(c => wrapFunctional(c.default || c)),
  Stats: () => import('../../components/Stats.vue' /* webpackChunkName: "components/stats" */).then(c => wrapFunctional(c.default || c)),
  Tutorial: () => import('../../components/Tutorial.vue' /* webpackChunkName: "components/tutorial" */).then(c => wrapFunctional(c.default || c)),
  ScoreBaseball: () => import('../../components/score-baseball.js' /* webpackChunkName: "components/score-baseball" */).then(c => wrapFunctional(c.default || c)),
  Utility: () => import('../../components/utility.js' /* webpackChunkName: "components/utility" */).then(c => wrapFunctional(c.default || c)),
  AuGameInfoAU: () => import('../../components/au/GameInfoAU.vue' /* webpackChunkName: "components/au-game-info-a-u" */).then(c => wrapFunctional(c.default || c)),
  AuInningsCross: () => import('../../components/au/InningsCross.vue' /* webpackChunkName: "components/au-innings-cross" */).then(c => wrapFunctional(c.default || c)),
  AuScoreTable: () => import('../../components/au/ScoreTable.vue' /* webpackChunkName: "components/au-score-table" */).then(c => wrapFunctional(c.default || c))
}

for (const name in components) {
  Vue.component(name, components[name])
  Vue.component('Lazy' + name, components[name])
}
