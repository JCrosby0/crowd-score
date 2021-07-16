<template>
  <div class="game-info w-full flex flex-row justify-between p-4">
    <span>
      Date: {{ gameInfo.date }}
    </span>
    <span>
      Venue: {{ gameInfo.venue }}
    </span>
    <span>
      At: {{ gameInfo.weather }}
    </span>
    <span>
      Scorer: {{ gameInfo.scorer }}
    </span>
  </div>
</template>

<script>
export default {
  props: {
    gameInfo: {
      required: false,
      type: Object,
      default: () => {
        return {
          date: 'today',
          venue: 'here',
          weather: 'fine',
          scorer: 'me'
        }
      }
    }
  }

}
</script>

<style scoped>
span {
  text-transform: capitalize;
}
</style>
