<template>
  <div class="main">
    {{ score }}
  </div>
</template>

<script>
import { Score } from '@/components/score-baseball'
export default {
  data () {
    return {
      score: new Score()
    }
  }
}
</script>

<style>

</style>
