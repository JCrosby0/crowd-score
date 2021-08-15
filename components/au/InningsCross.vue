<template>
  <div class="main">
    <svg
      version="1.1"
      baseProfile="full"
      :width="75"
      :height="75"
      viewBox="0 0 200 200"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g class="graphic" stroke="black" fill="none">
        <line x1="100" y1="0" x2="100" y2="50" />
        <line x1="100" y1="110" x2="100" y2="160" />
        <line x1="0" y1="80" x2="70" y2="80" />
        <line x1="130" y1="80" x2="200" y2="80" />
        <circle cx="100" cy="80" r="30" />
        <line x1="0" y1="160" x2="200" y2="160" />
      </g>

    </svg>
  </div>
</template>

<script>
export default {

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
