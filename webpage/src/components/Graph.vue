<template>
  <span>{{msg}}</span>
</template>

<script>
  export default {
    name: 'Graph',
    props: {
      mustang: Object,
      merlin: Object,
      osprey: Object
    },
    data() {
      return {
        msg: 'This is a Graph Vue component'
      }
    },
  }
</script>

<style>

</style>
