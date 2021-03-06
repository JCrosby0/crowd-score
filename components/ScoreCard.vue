<template>
  <div class="score-card-table">
    <div class="w-full px-4 text-xl">
      <h1>{{ team.name }} - {{ score }}</h1>
    </div>
    <table class="w-full m-auto">
      <!-- Heading row -->
      <thead>
        <th
          v-for="(col, c) in cols"
          :key="'player-col-head-'+c"
          :class="col"
        >
          <!-- :width="colWidth[c]" -->
          {{ col }}
        </th>
        <th v-for="(inning, i) in innings" :key="'innings-head-'+i">
          {{ i+1 }}
        </th>
        <th v-for="(stat, s) in statsCategories" :key="'stats-head-'+s">
          {{ stat }}
        </th>
      </thead>
      <tbody>
        <tr
          v-for="(player, p) in lineup"
          :key="'player-'+p"
        >
          <!-- Player Info -->
          <td v-for="(col, c) in cols" :key="'player-col-'+c" :class="col" :width="colWidth[c]">
            <table class="table-names" height="100%">
              <tr v-for="row, r in rows" :key="'player-name-rows-'+r">
                <td>{{ r==0 && c===1 ? player : '&nbsp;' }}</td>
              </tr>
            </table>
          </td>
          <!-- Innings -->
          <td v-for="(inning, i) in innings" :key="'innings-'+i" class="td-diamond" @click.prevent="handleDiamondClick(i, p)">
            <InningsDiamond
              :key="'diamond'+i+p"
              :size="diamondSize"
              :class="diamondClasses(scoreObj[i][p].diamondObj)"
              :diamond-score="scoreObj[i][p].diamondObj"
              :index="{team: ind, inning: i, player:p, }"
            />
          </td>
          <!-- Stats -->
          <td v-for="(stat, s) in statsCategories" :key="'stats-'+s" class="td-stats" width="1.5rem">
            {{ stats[p][stat] }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import InningsDiamond from '@/components/InningsDiamond'
export default {
  components: {
    InningsDiamond
  },
  props: {
    team: {
      required: true,
      type: Object
    },
    ind: {
      required: true,
      type: Number
    }
  },
  data () {
    return {
      diamondSize: '125',
      rows: [[], [], []],
      cols: ['No', 'Batter', 'Pos', 'Inn'],
      colWidth: ['10%', '70%', '10%', '10%'],
      numberInnings: 11,
      statsCategories: ['AB', 'R', 'H', 'RBI', 'BB', 'SO']
    }
  },
  computed: {
    lineup () { return this.team.lineup },
    scoreObj () { return this.team.scoreObj },
    innings () {
      return Array(this.numberInnings).fill([])
    },
    score () {
      return this.stats.reduce((acc, cur) => {
        return acc + cur.R
      }, 0)
    },
    stats () {
      const stats = []
      this.lineup.forEach((player, p) => {
        stats[p] = {
          AB: this.scoreObj.reduce((acc, cur) => {
            return cur[p].diamondObj.AB ? acc + 1 : acc
          }, 0),
          R: this.scoreObj.reduce((acc, cur) => {
            return cur[p].diamondObj.base === 4 ? acc + 1 : acc
          }, 0),
          H: this.scoreObj.reduce((acc, cur) => {
            return ['1B', '2B', '3B', 'HR', 'GRD'].includes(cur[p].diamondObj.howBase) ? acc + 1 : acc
          }, 0),
          RBI: this.scoreObj.reduce((acc, cur) => {
            return cur[p].diamondObj.rbi ? acc + cur[p].diamondObj.rbi : acc
          }, 0),
          BB: this.scoreObj.reduce((acc, cur) => {
            return ['BB', 'HBP'].includes(cur[p].diamondObj.howBase) ? acc + 1 : acc
          }, 0),
          SO: this.scoreObj.reduce((acc, cur) => {
            return ['K', 'ꓘ'].includes(cur[p].diamondObj.howOut) ? acc + 1 : acc
          }, 0)
        }
      })
      return stats
    }
  },
  methods: {
    diamondClasses (obj) {
      return {
        inactive: !obj.AB,
        diamondPointer: true
      }
    },
    handleDiamondClick (inning, player) {
      this.$emit('showDiamond', { inning, player })
    }
  }

}
</script>

<style scoped>
table {
  border-spacing: 0;
  border-collapse: collapse;
}
tbody {

  border: 2px black solid;
}
.table-names {
  height: 100%;
  width: 100%;
}
td {
  padding: 0;
  background: white;
}
/* collapse the tr and td so that the contents define the height */
tr,
td {
  height: 1px;
}
.table-names td {
  font-size: 1em;
}
th {
  position: sticky;
  top:0;
  border: 2px black solid;
  background: grey;
  z-index: 1;
  /* padding: 0 0.5rem; */
}
table thead th:nth-child(2),
table tbody td:nth-child(2) {
  position: sticky;
  left: 0;
  z-index: 2;
}
table thead th:nth-child(2) {
  position: sticky;
  top: 0;
  left: 0;
  z-index: 3;
}

.table-names td,
.td-diamond,
.td-stats {
  padding: 0.25rem 0.5rem;
  border: 1px grey solid;
  text-align: center;
}
.td-diamond {
  padding: 0;
}
td span {
    /* display: hidden; */
    line-height: 2rem;
    color: red;
}
tr:first-of-type td.Batter span {
    display: block;
    color: blue;
}
.diamond-pointer {
  pointer-events: none;
}
.inactive {
  background: #cccccc;
}
</style>
