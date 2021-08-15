<template>
  <div class="main">
    <table id="batting-table">
      <thead>
        <!-- four sub-rows in the heading row -->
        <tr>
          <th :colspan="headings.fielding.length" rowspan="3">
            Fielding
          </th>
          <th colspan="2">
            Batting Order
          </th>
          <th />
          <!-- Innings Numbers, set width -->
          <th
            v-for="(inning, i) in innings"
            :key="'innings-index'+i"
            class="innings-heading"
          >
            {{ i+1 }}
          </th>
          <th :colspan="headings.batting.length" rowspan="3">
            Batting
          </th>
        </tr>
        <tr>
          <th rowspan="3" class="team-heading">
            <span class="label">
              Team:
            </span><br>
            <span class="value">{{ team.name }}</span>
          </th>
          <th rowspan="2" />
          <th>A</th>
          <!-- Innings A (Empty) -->
          <th v-for="(inning, i) in innings" :key="'innings-A'+i" />
        </tr>
        <tr>
          <th>PO</th>
          <!-- Innings PO (Empty) -->
          <th v-for="(inning, i) in innings" :key="'innings-PO'+i" />
        </tr>
        <tr>
          <!-- fielding stats -->
          <th
            v-for="(fielding, f) in headings.fielding"
            :key="'fielding'+f"
            class="fielding-cols"
          >
            {{ fielding.label }}
          </th>
          <th>Uni</th>
          <th>E</th>
          <!-- Innings E (Empty) -->
          <th v-for="(inning, i) in innings" :key="'innings-E'+i" />
          <!-- batting stats -->
          <th
            v-for="(batting, f) in headings.batting"
            :key="'batting'+f"
            class="batting-cols"
          >
            {{ batting.label }}
          </th>
        </tr>
      </thead>
      <!-- End heading rows, start body rows -->
      <tbody>
        <tr v-for="(player, p) in [...teamlist]" :key="'player'+p">
          <td
            v-for="(col,c) in columns"
            :key="`cell-${p}${c}`"
          >
            <!-- conditionally display things in the cells -->
            <!-- player name - extra wide -->
            <div v-if="c===6" class="player-name" />
            <!-- player number -->
            <div
              v-if="c===8"
              class="player-number"
            >
              {{ p+1 }}
            </div>
            <!-- innings diamonds -->
            <div
              v-else-if="(c>=9 && c<(9+innings.length))"
              class="innings-diamond"
            >
              <InningsCross />
            </div>
            <!-- else split row in two vertically -->
            <div v-else class="intra-cell-table">
              <table><tr><td /></tr><tr><td /></tr></table>
            </div>
          </td>
        </tr>
        <!-- spacing row -->
        <tr class="spacing-row">
          <td :colspan="columns.length" />
        </tr>
        <!-- lower half of table -->
        <!-- runs row - extends across entire table -->
        <tr class="lower-table">
          <td
            v-for="(col,c) in columns"
            :key="`cell-pitchcount-${0}${c}`"
          >
            <!-- runs label -->
            <div v-if="c===8" class="pitch-count-vert-headings">
              {{ headings.runs[0].label }}
            </div>
            <!-- runs innings/total cell decoration -->
            <div
              v-else-if="(c>=9 && c<(9+innings.length))"
              class="innings-diamond"
            >
              /
            </div>
          </td>
        </tr>
        <!-- pitch count rows -->
        <tr
          v-for="(opt,o) in headings.pitchCount"
          :key="'pitchCount-rows'+o"
          class="lower-table"
        >
          <!-- last two columns are wider -->
          <td
            v-for="(col,c) in columnsLower"
            :key="`cell-pitchcount-${o}${c}`"
            :colspan="c === 23 ? (headings.batting.length - 2) : 1"
            :rowspan="c === 23 && o===0 ? headings.pitchCount.length : 1"
          >
            <div
              v-if="[8, 9 + innings.length].includes(c)"
              class="pitch-count-vert-headings"
            >
              {{ headings.pitchCount[o].label }}
            </div>
            <!-- runs innings/total slashes -->
            <div
              v-else-if="(c>=9 && c<(9+innings.length))"
              class="innings-diamond"
            >
              |
            </div>
          </td>
          <!-- results box to add on the end of first row-->
          <td
            v-if="o===0"
            :colspan="headings.batting.length - 2"
            :rowspan="headings.pitchCount.length"
          >
            <div class="results-box">
              <div
                v-for="result in results"
                :key="'result-'+result"
                class="results-item"
              >
                {{ result }}
              </div>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
    <!-- new table  -->
    <table id="pitching-table" class="pitching-table">
      <!-- pitcher/catcher tables -->
      <tr
        v-for="(pitcher, p) in pitchers"
        :key="'pitcher-row-'+p"
        class="pitching-table"
      >
        <td
          v-for="(col, c) in columnsPitcher"
          :key="`pitcher-cell-${p}-${c}`"
        >
          <!-- pitching headings -->
          <div v-if="p===0 && c===0" class="player-name">
            Pitcher
          </div>
          <div
            v-else-if="p===0 && c < headings.pitching.length"
            class="player-stats"
          >
            {{ headings.pitching[c-1].label }}
          </div>
          <!-- last column, extra wide -->
          <div
            v-else-if="p===0 && c === headings.pitching.length"
            class="pitching-heading"
          >
            {{ headings.pitching[c-1].label }}
          </div>

          <!-- catching headings -->
          <div
            v-else-if="p===0 && c ==(headings.pitching.length+1)"
            class="pitching-name"
          >
            Catcher
          </div>

          <div
            v-else-if="p===0 &&
              c > headings.pitching.length+1 &&
              c < headings.pitching.length + headings.catching.length + 2"
            class="player-stats"
          >
            {{ headings.catching[c-headings.pitching.length-2].label }}
          </div>
          <!-- sign-off -->
          <div
            v-else-if="p===0 &&
              c ==(headings.pitching.length + headings.catching.length + 2)"
            class="pitching-name"
          >
            Signatures:
          </div>
          <div
            v-else-if="c ==(headings.pitching.length + headings.catching.length + 2)"
            class="signature"
          >
            {{ signatories[p-1] }}
          </div>
          <!-- Bench -->
          <div
            v-else-if="p===0 && c ==(headings.pitching.length + headings.catching.length + 3)"
            class="pitching-name"
          >
            On Bench:
          </div>
          <div
            v-else-if="p===0 && c ==(headings.pitching.length + headings.catching.length + 4)"
            class="player-stats"
          >
            Uni
          </div>
        </td>
        <!-- Checksum -->
        <td v-if="p===0" :rowspan="5">
          <div class="score-check">
            <span>Score Check:</span>
            <div class="check-row">
              <span class="check-item">AB</span>+
              <span class="check-item">BB</span>+
              <span class="check-item">HBP</span>+
              <span class="check-item">SAC</span>+
              <span class="check-item">CI</span>=
              <span class="check-item">SUM</span>
            </div>
            <div class="check-row">
              <span class="check-item">R</span>+
              <span class="check-item">LOB</span>+
              <span class="check-item">PO</span>=
              <span class="check-item">SUM</span>
            </div>
          </div>
        </td>
      </tr>
    </table>
    <div class="score-table">
      <div class="fielding-stats" />
      <div class="batting-order" />
      <div class="innings" />
      <div class="batting-stats" />
    </div>
  </div>
</template>

<script>
import headings from '@/components/au/baseballHeadings.json'
import InningsCross from '@/components/au/InningsCross.vue'
export default {
  components: { InningsCross },
  props: {
    team: {
      required: false,
      type: Object,
      default: () => {
        return {
          name: 'Teamy McTeam'
        }
      }
    }
  },
  data () {
    return {
      headings,
      innings: new Array(12).fill({}),
      teamlist: new Array(12).fill({}),
      pitchers: new Array(5).fill({}),
      signatories: ['Official Recorder', 'Scorer Home', 'Scorer Away', 'Umpire Signature'],
      results: ['Winner', 'Score', 'Plate Ump.', '1st', '2nd', '3rd', 'Pitcher: Win', 'Loss', 'Save', 'Coach']
    }
  },
  computed: {
    columns () {
      return this.headings.fielding.length + // fieldling stats columns
        this.headings.batting.length + // batting stats columns
        this.innings.length + // innings cols
        3 // name, uni, player number
    },
    columnsLower () {
      return this.headings.fielding.length + // fieldling stats columns
        // this.headings.batting.length + // batting stats columns
        this.innings.length + // innings cols
        5 // name, uni, player number, pitch count, total
    },
    columnsPitcher () {
      return this.headings.pitching.length + // pitcher columns
            this.headings.catching.length + // catcher columns
            5 // pitcher name, catcher name, sign-off, bench, bench,
    }
  },
  created () {
    window.addEventListener('resize', this.handleWindowResize)
  },
  mounted () {
    this.handleWindowResize()
  },
  destroyed () {
    window.removeEventListener('resize', this.handleWindowResize)
  },
  methods: {
    handleWindowResize () {
      const wb = document.getElementById('batting-table').offsetWidth
      document.getElementById('pitching-table').style.width = wb
    }
  }

}
</script>

<style scoped>

table {
    border: 1px blue solid;
    margin: auto;
    width: 99%;
}

td, th {
    border: 1px black solid;
    font-weight: 400;
    font-size: x-small;
}
td {
    border-top: 2px black solid;
    border-bottom: 2px black solid;
    padding: 0;
    height: 50px;
}
th.innings-heading {
    width: 75px;
    margin: auto;
    font-size: large;
    font-weight: 600;
}
/* th.team-heading .label {
    font-size: small;
} */
.innings-diamond {
    text-align: center;
}
/* innings header: 1-12 */
th.team-heading .value {
    font-size: large;
    font-weight: 600;
}
/* player name - extra wide */
td .player-name {
    width: 200px;
    margin: auto;
    text-align: center;
}
.pitching-name {
    width: 200px;
    margin: auto;
    text-align: center;
}
.signature {
    text-align: left;
    font-size: xx-small;
    margin-left: 0.5rem;
}
/* player lineup number, 1-12 */
td .player-number {
    font-size: large;
    font-weight: 600;
    text-align: center;
}
/* intra cell table */
.intra-cell-table table {
    margin: 0;
    padding: 0;
    border: 0;
    height: 100%;
    width: 100%;
}
.intra-cell-table tr,
.intra-cell-table td {
    height: 50%;
    border: 0;
    margin: 0;
}
/* horizontal divide in player cells */
.intra-cell-table td:first-of-type{
    border-bottom: 0.5px solid;
}
/* standard stats column width */
.player-stats,
.fielding-cols,
.batting-cols {
    width: 25px;
    margin: auto;
    text-align: center;
}
/* double column width */
.pitching-heading {
    width: 40px;
    margin: auto;
    text-align: center;
}
.spacing-row,
.spacing-row td {
    height: 10px;
}
.pitch-count-vert-headings {
    text-align: center;
}
tr.pitching-table td,
tr.lower-table td {
    height: 25px;
}
.score-check {
    width: 275px;
    margin: auto;
    text-align: center;
}
table.pitching-table {
    margin-top: 10px;
}
.check-row {
    display: flex;
    width: 100%;
    flex-direction: row;
    align-items: center;
    justify-content: flex-end;
    margin: 0.5rem 0;
}
.check-row:first-of-type {
    margin-bottom: 0;
}
.check-item {
    flex: 0 0 2rem;
    text-align: center;
    border: 1px grey solid;
    height: 2.5rem;
    margin: 0 0.25rem;
}
.results-box {
    width: 100%;
    height: 100%;
    margin: 0.5rem;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
}
.results-item {
    flex: 1 1 50%;
    margin: auto;
}
</style>
