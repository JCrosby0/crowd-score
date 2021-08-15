<template>
  <div class="score-sheet">
    <GameInfoAu />
    <!--
        Input parameters for game info:
      :home-team="undefined"
      :away-team="undefined"
      :venue="undefined"
      :date="undefined"
      :time-start="undefined"
      :time-finish="undefined"
      :time-total="undefined"
      :game-notes="undefined"
    -->
    <ScoreTable />
  </div>
</template>

<script>
import GameInfoAu from '@/components/au/GameInfoAU.vue'
import ScoreTable from '@/components/au/ScoreTable.vue'

export default {
  name: 'ScoresheetAU',
  components: { GameInfoAu, ScoreTable }
}
</script>

<style scoped>
.score-sheet {
    border: 2px grey solid;
    /* min-width: 100%; */
    min-height: 100vh;
    background: #eee;
}
.game-info {
    /* height: 100px; */
}
</style>
