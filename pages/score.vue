<template>
  <div class="main relative flex flex-col">
    <GameInfo />
    <ScoreCard
      v-for="(team, t) in teams"
      :key="'team-score-card-'+t"
      :team="team"
      :ind="t"
      @showDiamond="obj => handleShowDiamond(obj, t)"
    />
    <InputDiamond
      v-if="showInput"
      class="absolute top-0 left-0"
      :indices="diamondInput"
      :game-data="teams"
      @closeWindow="toggleShowInputDiamond"
      @updateData="payload => handleUpdateData(payload)"
    />
  </div>
</template>

<script>
import GameInfo from '@/components/GameInfo'
import ScoreCard from '@/components/ScoreCard'
import InputDiamond from '@/components/InputDiamond'

/**
  * Routine to generate dummy score card
  * TODO: modify existing runners on base during at-bat
 */
function createScoreObj (outs) {
  const baseObj = {
    diamondObj: {
      strikes: 0,
      balls: 0,
      base: 0,
      rbi: 0,
      howOut: null,
      howBase: null,
      AB: 0,
      outNo: 0
    }
  }
  // if already 3 outs, return empty object for the rest of the innings
  if (outs >= 3) {
    return baseObj
  }

  // if at bat, there can be balls and strikes
  baseObj.diamondObj.AB = 1
  baseObj.diamondObj.balls = Math.floor(Math.random() * 4)
  baseObj.diamondObj.strikes = Math.floor(Math.random() * 3)

  // handle out logic
  const out = Math.random() < 0.7
  if (out) {
    const howOut = ['F8', '6-3', 'K', 'ꓘ', '1-3FC'][Math.floor(Math.random() * 5)]
    baseObj.diamondObj.howOut = howOut
    baseObj.diamondObj.outNo = outs + 1
    // make sure we dont' strike out with less than 2 outs drawn in
    if (['K', 'ꓘ'].includes(howOut)) {
      baseObj.diamondObj.strikes = 2
    }
    return baseObj
  }
  // if not out, determine how got on base
  const howBase = ['1B', '2B', '3B', 'HR', 'BB', 'HP', 'FC', 'E', 'WP', 'PB', 'CI', 'GRD'][Math.floor(Math.random() * 12)]
  // make sure we don't have a base on balls with less than 3 balls drawn in
  if (howBase === 'BB') {
    baseObj.diamondObj.balls = 3
  }
  // if fielder's choice, increase the outs
  // TODO: assign out to a different player
  if (howBase === 'FC') {
    baseObj.diamondObj.outNo = outs + 1
  }
  const base = ['2B', 'GRD'].includes(howBase)
    ? 2
    : howBase === '3B'
      ? 3
      : howBase === 'HR'
        ? 4
        : 1
  baseObj.diamondObj.howBase = howBase
  baseObj.diamondObj.base = base
  return baseObj
}
export default {
  components: {
    GameInfo,
    ScoreCard,
    InputDiamond
  },
  provide () {
    return {
      teams: this.teams,
      indices: this.diamondInput
    }
  },
  data () {
    return {
      demo: true,
      showInput: false,
      diamondInput: { team: 0, inning: 0, player: 0 },
      teams: [
        {
          name: 'Hometown Homers',
          lineup: [
            'Alpha',
            'Bravo',
            'Charlie',
            'Delta',
            'Echo',
            'Foxtrot',
            'Golf',
            'Hotel',
            'India'
          ],
          scoreObj: [[{ diamondObj: {} }]]
        },
        {
          name: 'Awayville Wayfinders',
          lineup: [
            'Romeo',
            'Sierra',
            'Tango',
            'Uniform',
            'Viktor',
            'Whiskey',
            'X-Ray',
            'Yankee',
            'Zulu'
          ]
        }
      ]
    }
  },
  created () {
    // for the purposes of the demo, create dummy scorecards
    if (this.demo) {
      this.prepareScoreObj(0)
      this.prepareScoreObj(1)
    }
  },
  methods: {
    handleUpdateData (payload) {
      console.log('handleUpdateData (payload): ', payload)
      this.$set(this.teams[payload.team].scoreObj[payload.inning][payload.player].diamondObj, payload.key, payload.value)
      console.log(this.teams[payload.team].scoreObj[payload.inning][payload.player].diamondObj)
    },
    toggleShowInputDiamond () {
      this.showInput = !this.showInput
    },
    handleShowDiamond (obj, teamNo) {
      obj.team = teamNo
      this.diamondInput = obj
      this.toggleShowInputDiamond()
    },
    prepareScoreObj (t = 0) {
      const innings = new Array(11).fill(null)
      this.teams[t].scoreObj = innings
      // get the batter when third out occurs
      let lastAtBat = 0
      // starting batter for the innings
      let firstBatter = 0
      innings.forEach((inn, i) => {
      // start outs at 0 each innings
        let outs = 0
        // cycle 9 players each innings
        // TODO: update this to go until 3 outs,
        // TODO: moving to next innings when needed
        const players = new Array(9).fill(null)
        // add array of 9 players to the current innings
        this.teams[t].scoreObj[i] = players
        // iterate 9 players
        players.forEach((player, p) => {
        // generate score Obj
          const scoreObj = createScoreObj(outs)
          // if there was an out on that at bat, increment outs
          // TODO: double-play? triple play?
          if (scoreObj.diamondObj.howOut || scoreObj.diamondObj.howBase === 'FC') {
            outs = outs + 1
            // if we finish the innings, record the last at bat for next innings
            if (scoreObj.diamondObj.outNo >= 3) {
            // last at bat was first batter + how many indices we went through,
              lastAtBat = (p + firstBatter) % 9
            }
          }
          // set this scoreObj against the appropriate player in the lineup
          this.teams[t].scoreObj[i][(p + firstBatter) % 9] = scoreObj
        })
        //   set first batter for next innings
        firstBatter = lastAtBat + 1
      })
    }
  }
}
</script>

<style>

</style>
