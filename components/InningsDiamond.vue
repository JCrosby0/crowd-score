<template>
  <div class="main">
    <svg
      version="1.1"
      baseProfile="full"
      :width="size"
      :height="size"
      viewBox="0 0 200 200"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <rect id="box" width="20" height="20" stroke="black" />
        <circle id="rbi" r="10" />
      </defs>
      <g class="diamond" transform="translate(100 160) rotate(-135)" stroke="black" fill="none">
        <!-- diamond -->
        <rect width="50" height="50" />
        <!-- outfield -->
        <path d="M 0,0 L100,0 C 125,75 75,125 0,100 L0,0" />
      </g>
      <g
        class="basepaths"
        transform="translate(100 160) rotate(-135)"
        stroke="black"
        fill="none"
        stroke-width="6"
        stroke-linecap="square"
      >
        <!-- first base path -->
        <path v-if="diamondScore.base===1" d="M 0,0 L0, 50" />
        <!-- second base path -->
        <path v-if="diamondScore.base===2" d="M 0,0 L0, 50 50,50" />
        <!-- third base path -->
        <path v-if="diamondScore.base===3" d="M 0,0 L0, 50 50,50 50,0" />
        <!-- home base path -->
        <path v-if="diamondScore.base===4" d="M 0,0 L0, 50 50,50 50,0 0,0" fill="gray" />
      </g>
      <g class="pitch-count">
        <!-- balls -->
        <use id="ball1" href="#box" x="180" y="180" :fill="diamondScore.balls >= 1 ? 'grey' : 'white'" />
        <use id="ball2" href="#box" x="160" y="180" :fill="diamondScore.balls >= 2 ? 'grey' : 'white'" />
        <use id="ball3" href="#box" x="140" y="180" :fill="diamondScore.balls >= 3 ? 'grey' : 'white'" />
        <!-- strikes -->
        <use id="strike1" href="#box" x="180" y="160" :fill="diamondScore.strikes >= 1 ? 'grey' : 'white'" />
        <use id="strike2" href="#box" x="160" y="160" :fill="diamondScore.strikes >= 2 ? 'grey' : 'white'" />
      </g>
      <!-- runners batted in -->
      <g class="rbi">
        <use v-if="diamondScore.rbi >= 1" href="#rbi" x="180" y="20" />
        <use v-if="diamondScore.rbi >= 2" href="#rbi" x="160" y="20" />
        <use v-if="diamondScore.rbi >= 3" href="#rbi" x="180" y="40" />
        <use v-if="diamondScore.rbi >= 4" href="#rbi" x="160" y="40" />
      </g>
      <!-- how out -->
      <text x="100" y="70">{{ diamondScore.howOut }}</text>
      <!-- how to first -->
      <g transform="rotate(-45 140 160)" text-anchor="middle">
        <text v-if="diamondScore.howBase" x="140" y="160">{{ diamondScore.howBase }}</text>
      </g>
      <!-- out number -->
      <g v-if="diamondScore.outNo">
        <circle r="20" cx="30" cy="170" stroke="black" fill="none" />
        <text x="30" y="176">{{ diamondScore.outNo }}</text>
      </g>
    </svg>
  </div>
</template>

<script>
export default {
  inject: [
    'teams',
    'indices'
  ],
  props: {
    size: {
      required: false,
      type: String,
      default: () => '125'
    },
    index: {
      required: false,
      type: Object || null,
      default: () => null
    }
  },
  computed: {
    i () {
      return this.index || this.indices
    },
    diamondScore () {
      // if i is provided directly, use it, else use the one from inject (ie for editing)

      return this.teams[this.i.team].scoreObj[this.i.inning][this.i.player].diamondObj
    }
  }

}
</script>

<style scoped>
svg text {
  font-size: 1.5em;
  text-anchor: middle;
}
svg use {
  color: inherit;
}

</style>
