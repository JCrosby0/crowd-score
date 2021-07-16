<template>
  <div class="main flex flex-col">
    <GameInfo />
    <ScoreCard
      :lineup="teams[0].lineup"
      :score-obj="teams[0].scoreObj"
    />
  </div>
</template>

<script>
import GameInfo from '@/components/GameInfo'
import ScoreCard from '@/components/ScoreCard'
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
  // if at bat, ther ecan be balls and strikes
  baseObj.diamondObj.balls = Math.floor(Math.random() * 4)
  baseObj.diamondObj.strikes = Math.floor(Math.random() * 3)

  // if an out, no on base
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
  console.log('baseObj.diamondObj.base: ', baseObj.diamondObj.base)
  return baseObj
//   return {
//     diamondObj: {
//       strikes: Math.floor(Math.random() * 3),
//       balls: Math.floor(Math.random() * 4),
//       base: Math.floor(Math.random() * 5),
//       rbi: Math.floor(Math.random() * 5),
//       howOut: ['F8', '6-3', 'K', 'ꓘ', '1-3FC'][Math.floor(Math.random() * 5)],
//       howBase: ['1B', '2B', '3B', 'HR', 'BB', 'HP', 'FC', 'E', 'WP', 'PB', 'CI', 'GRD'][Math.floor(Math.random() * 12)],
//       AB: Math.random() > 0.5,
//       outNo: Math.floor(Math.random() * 4)
//     }
//   }
}
export default {
  components: {
    GameInfo,
    ScoreCard
  },
  data () {
    return {
      teams: [
        {
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
          scoreObj: null
        },
        {
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
    const innings = new Array(11).fill(null)
    this.teams[0].scoreObj = innings
    // get the batter when third out occurs
    let lastAtBat = 0
    // starting batter for the innings
    let firstBatter = 0
    innings.forEach((inn, i) => {
      console.log('new innings: ', i)
      // start outs at 0 each innings
      let outs = 0
      // cycle 9 players each innings
      // TODO: update this to go until 3 outs,
      // TODO: moving to next innings when needed
      const players = new Array(9).fill(null)
      // add array of 9 players to the current innings
      this.teams[0].scoreObj[i] = players
      // iterate 9 players
      console.log('firstBatter: ', firstBatter)
      players.forEach((player, p) => {
        // generate score Obj
        const scoreObj = createScoreObj(outs)
        // if there was an out on that at bat, increment outs
        // TODO: double-play? triple play?
        if (scoreObj.diamondObj.howOut || scoreObj.diamondObj.howBase === 'FC') {
          outs = outs + 1
          // if we finish the innings, record the last at bat for next innings
          console.log('scoreObj.diamondObj.outNo: ', scoreObj.diamondObj.outNo)
          if (scoreObj.diamondObj.outNo >= 3) {
            // last at bat was first batter + how many indices we went through,
            lastAtBat = (p + firstBatter) % 9
            console.log('lastAtBat: ', lastAtBat)
            console.log('lastAtBat: ', lastAtBat)
          }
          console.log('outs: ', outs)
        }
        // set this scoreObj against the appropriate player in the lineup
        this.teams[0].scoreObj[i][(p + firstBatter) % 9] = scoreObj
        console.log('write to batter: ', (p + firstBatter) % 9)
      })
      //   set first batter for next innings
      firstBatter = lastAtBat + 1
    })
  }
}
</script>

<style>

</style>
