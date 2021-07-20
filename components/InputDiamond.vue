<template>
  <div class="modal" @click.self="handleClickOut">
    <div class="container">
      <div class="header-info p-1">
        <span>
          Team: {{ indices.team }}
        </span>
        <span>
          Innings: {{ indices.inning }}
        </span>
        <span>
          Player: {{ indices.player }}
        </span>
      </div>
      <div class="inputs flex flex-row">
        <div class="diamond-container w-50 mx-auto">
          <InningsDiamond
            key="editDiamond"
            class="m-auto"
            :size="diamondSize"
            :index="{team: indices.team, inning: indices.inning, player:indices.player, }"
          />
        </div>
        <div class="input-form w-1/2">
          <form class="flex flex-col text-left">
            <div class="flex flex-row">
              <label>
                <div class="label-width">
                  Balls:
                </div>
                <input v-model="balls" type="number" min="0" max="4" step="1">
              </label>
              <button @click.prevent="balls = balls+1">
                Ball
              </button>
            </div>
            <div class="flex flex-row">
              <label>
                <div class="label-width">
                  Strikes:
                </div>
                <input v-model="strikes" type="number" min="0" max="3" step="1">
              </label>
              <button @click.prevent="strikes = strikes+1">
                Strike
              </button>
            </div>
            <label>
              <div class="label-width">
                At Bat Result:
              </div>
              <select v-model="atBatResult">
                <option value="null">None</option>
                <option value="out">Out</option>
                <option value="base">Base</option>
              </select></label>
            <label v-if="atBatResult==='base'">
              <div class="label-width">
                Base Result:
              </div>
              <select v-model="howBase">
                <option
                  v-for="option in onBaseOptions"
                  :key="option.value"
                  :value="option.value"
                >
                  {{ option.label }}
                </option></select>
            </label>
            <label v-if="atBatResult==='out'">
              <div class="label-width">
                Out Result:
              </div>
              <select v-model="howOut">
                <option
                  v-for="option in outOptions"
                  :key="option.value"
                  :value="option.value"
                >
                  {{ option.label }}
                </option></select>
            </label>
            <label v-if="(atBatResult==='out' && !['K', 'ꓘ'].includes(howOut)) || (atBatResult==='base' && howBase==='E')">
              <div class="label-width">
                Fielder(s):
              </div>
              <input v-model="outToFielder" type="number" min="1">
            </label>
            <label v-if="atBatResult==='out'">
              <div class="label-width">
                Out Number:
              </div>
              <select v-model="outNo">
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
              </select></label>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import InningsDiamond from '@/components/InningsDiamond.vue'

const onBaseOptions = [
  // ['1B', '2B', '3B', 'HR', 'BB', 'HP', 'FC', 'E', 'WP', 'PB', 'CI', 'GRD']
  { value: '1B', label: 'First Base' },
  { value: '2B', label: 'Second Base' },
  { value: '3B', label: 'Third Base' },
  { value: 'HR', label: 'Home Run' },
  { value: 'BB', label: 'Base on Balls' },
  { value: 'HP', label: 'Hit by Pitch' },
  { value: 'FC', label: "Fielder's Choice" },
  { value: 'E', label: 'Error' },
  { value: 'WP', label: 'Wild Pitch' },
  { value: 'PB', label: 'Passed Ball' },
  { value: 'CI', label: 'Catcher Interference' },
  { value: 'GRD', label: 'Ground Rule Double' }
]
const outOptions = [
  { value: '', label: 'Put Out' },
  { value: 'F', label: 'Fly Ball' },
  { value: 'K', label: 'Strike Out - Swinging' },
  { value: 'ꓘ', label: 'Strike Out - Called' },
  { value: 'RI', label: 'Runner Impeding' },
  { value: 'FC', label: "Fielder's Choice" }
]

export default {
  components: {
    InningsDiamond
  },
  props: {
    indices: {
      required: true,
      type: Object
    }
  },
  data () {
    return {
      diamondSize: '300',
      balls: 0,
      strikes: 0,
      atBatResult: null,
      onBaseOptions,
      howBase: null,
      outOptions,
      howOut: null,
      outToFielder: null,
      outNo: 0
    }
  },
  computed: {
    team () { return this.indices.team },
    inning () { return this.indices.inning },
    player () { return this.indices.player },
    diamondObj () {
      return this.gameData[this.team].scoreObj[this.inning][this.player].diamondObj
    }
  },
  watch: {
    atBatResult (n) {
      if (n === 'out') {
        this.updateData('howBase', null)
      }
      if (n === 'base') {
        this.updateData('howOut', null)
      }
    },
    howOut (n) {
      this.updateData('howOut', n)
      // override strikes if howOut = strike out
      if (['K', 'ꓘ'].includes(n)) {
        this.updateData('strikes', 3)
      }
    },
    outToFielder (n) {
      let nString = n.toString()
      if (nString.length >= 2) {
        nString = nString.split('').join('-')
      }
      if (this.atBatResult === 'out') {
        this.updateData('howOut', this.howOut + nString)
      } else if (this.atBatResult === 'base') {
        this.updateData('howBase', this.howBase + nString)
      }
    },
    balls (n) {
      this.updateData('balls', n)
    },
    strikes (n) {
      this.updateData('strikes', n)
    },
    howBase (n) {
      this.updateData('howBase', n)
      // override balls if howBase == BB
      if (n === 'BB') {
        this.updateData('balls', 4)
      }
    },
    outNo (n) {
      this.updateData('outNo', n)
    }
  },
  methods: {
    handleClickOut () {
      this.$emit('closeWindow')
    },
    updateData (key, value) {
      const payload = {
        team: this.team,
        inning: this.inning,
        player: this.player,
        key,
        value
      }
      console.log('updating data:', payload)
      this.$emit('updateData', payload)
    }
  }
}
</script>

<style scoped>
.modal {
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.7);
    z-index: 10;
}
.container {
    width: 80vw;
    height: 80vh;
    margin: 10vh auto;
    background: white;
    z-index: 11;
    text-align: center;
}
.diamond-container {
    border: 1px grey solid;
}
label {
    line-height: 2rem;
}
button {
    @apply px-1 py-0.5 border border-gray-300 w-20 mx-4;
}
input {
    @apply border border-gray-300 text-right;
}
select {
    @apply pl-4;
}
input,
select,
button {
    @apply py-2 my-2;
}
.label-width {
    @apply inline-block w-28;
}
</style>
