<template>
  <svg
    version="1.1"
    baseProfile="full"
    :width="size"
    :height="size"
    viewBox="0 0 200 200"
    xmlns="http://www.w3.org/2000/svg"
    :style="pitchCountStyles"
  >
    <defs>
      <rect id="box" width="20" height="20" stroke="black" fill="currentColor" />
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
      <path v-if="diamondScore.base===4" d="M 0,0 L0, 50 50,50 50,0 0,0" fill="black" />
    </g>
    <g class="pitch-count">
      <!-- balls -->
      <use id="ball1" href="#box" x="180" y="180" />
      <use id="ball2" href="#box" x="160" y="180" />
      <use id="ball3" href="#box" x="140" y="180" />
      <!-- strikes -->
      <use id="strike1" href="#box" x="180" y="160" />
      <use id="strike2" href="#box" x="160" y="160" />
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
</template>

<script>
export default {
  props: {
    size: {
      required: false,
      type: String,
      default: () => '125'
    },
    diamondScore: {
      required: true,
      type: Object
    }
  },
  data () {
    return {
      rows: Array(9).fill([]),
      cols: Array(11).fill([])
    }
  },
  computed: {
    pitchCountStyles () {
      return {
        '--ball1': this.diamondScore.balls >= 1 ? 'grey' : 'white',
        '--ball2': this.diamondScore.balls >= 2 ? 'grey' : 'white',
        '--ball3': this.diamondScore.balls >= 3 ? 'grey' : 'white',
        '--strike1': this.diamondScore.strikes >= 1 ? 'grey' : 'white',
        '--strike2': this.diamondScore.strikes >= 2 ? 'grey' : 'white'
      }
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
  color: white;
}
svg use:nth-of-type(1) {
  color: var(--ball1);
}
svg use:nth-of-type(2) {
  color: var(--ball2);
}
svg use:nth-of-type(3) {
  color: var(--ball3);
}
svg use:nth-of-type(4) {
  color: var(--strike1);
}
svg use:nth-of-type(5) {
  color: var(--strike2);
}

</style>
