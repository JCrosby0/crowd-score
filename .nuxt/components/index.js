import { wrapFunctional } from './utils'

export { default as GameInfo } from '../../components/GameInfo.vue'
export { default as InningsDiamond } from '../../components/InningsDiamond.vue'
export { default as InputDiamond } from '../../components/InputDiamond.vue'
export { default as NuxtLogo } from '../../components/NuxtLogo.vue'
export { default as ScoreCard } from '../../components/ScoreCard.vue'
export { default as Stats } from '../../components/Stats.vue'
export { default as Tutorial } from '../../components/Tutorial.vue'
export { default as ScoreBaseball } from '../../components/score-baseball.js'
export { default as Utility } from '../../components/utility.js'
export { default as AuGameInfoAU } from '../../components/au/GameInfoAU.vue'
export { default as AuInningsCross } from '../../components/au/InningsCross.vue'
export { default as AuScoreTable } from '../../components/au/ScoreTable.vue'

export const LazyGameInfo = import('../../components/GameInfo.vue' /* webpackChunkName: "components/game-info" */).then(c => wrapFunctional(c.default || c))
export const LazyInningsDiamond = import('../../components/InningsDiamond.vue' /* webpackChunkName: "components/innings-diamond" */).then(c => wrapFunctional(c.default || c))
export const LazyInputDiamond = import('../../components/InputDiamond.vue' /* webpackChunkName: "components/input-diamond" */).then(c => wrapFunctional(c.default || c))
export const LazyNuxtLogo = import('../../components/NuxtLogo.vue' /* webpackChunkName: "components/nuxt-logo" */).then(c => wrapFunctional(c.default || c))
export const LazyScoreCard = import('../../components/ScoreCard.vue' /* webpackChunkName: "components/score-card" */).then(c => wrapFunctional(c.default || c))
export const LazyStats = import('../../components/Stats.vue' /* webpackChunkName: "components/stats" */).then(c => wrapFunctional(c.default || c))
export const LazyTutorial = import('../../components/Tutorial.vue' /* webpackChunkName: "components/tutorial" */).then(c => wrapFunctional(c.default || c))
export const LazyScoreBaseball = import('../../components/score-baseball.js' /* webpackChunkName: "components/score-baseball" */).then(c => wrapFunctional(c.default || c))
export const LazyUtility = import('../../components/utility.js' /* webpackChunkName: "components/utility" */).then(c => wrapFunctional(c.default || c))
export const LazyAuGameInfoAU = import('../../components/au/GameInfoAU.vue' /* webpackChunkName: "components/au-game-info-a-u" */).then(c => wrapFunctional(c.default || c))
export const LazyAuInningsCross = import('../../components/au/InningsCross.vue' /* webpackChunkName: "components/au-innings-cross" */).then(c => wrapFunctional(c.default || c))
export const LazyAuScoreTable = import('../../components/au/ScoreTable.vue' /* webpackChunkName: "components/au-score-table" */).then(c => wrapFunctional(c.default || c))
