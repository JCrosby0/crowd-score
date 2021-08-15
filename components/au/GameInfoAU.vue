<template>
  <div class="game-info">
    <p v-for="info in gameInfo" :key="info.label" :class="info.class">
      <span class="label">
        {{ info.label }}:
      </span><br>
      <span class="value">
        {{ info.prop }}
      </span>
    </p>
  </div>
</template>

<script>
import { camel2title } from '@/components/utility.js'
export default {
  name: 'GameInfoAU',
  props: {
    homeTeam: {
      required: false,
      type: String,
      default: 'Hometown Homers'
    },
    awayTeam: {
      required: false,
      type: String,
      default: 'Awayville Wayfinders'
    },
    venue: {
      required: false,
      type: String,
      default: 'Diamond 1'
    },
    date: {
      required: false,
      type: String,
      default: 'Today'
    },
    timeStart: {
      required: false,
      type: String,
      default: '9am'
    },
    timeFinish: {
      required: false,
      type: String,
      default: '11am'
    },
    timeTotal: {
      required: false,
      type: String,
      default: '2hrs'
    },
    gameNotes: {
      required: false,
      type: String,
      default: ''
    }
  },
  data () {
    return {
    }
  },
  computed: {
    gameInfo () {
      return Object.entries(this.$props)
        .map((entry) => {
          return {
            label: camel2title(entry[0]),
            class: entry[0],
            prop: this[entry[0]]
          }
        })
    }
  }
}
</script>

<style scoped>
.game-info {
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
}
.game-info p {
  max-width: 25%;
}
.label {
  font-size: small;
}
.value {
  font-size: large;
}
</style>
