<template>
<div id="graph">
  <h3>Mustang - {{ mustang.all.length }} systems</h3>
  <p>
    Automated - {{ mustang.automated.length }}&nbsp;&nbsp;
    Broken - {{ mustang.broken.length }}&nbsp;&nbsp;
    Manual - {{ mustang.manual.length }}
  </p>
  <button v-on:click="toggle('mustang')">
    {{(showList.mustang) ? 'Hide': 'Show'}} Mustang systems
  </button>
  <template v-if="showList.mustang">
    <ul id="mustang-list">
      <li v-for="item in mustang.all">
        {{ item.fqdn }}: {{ item.status }}
      </li>
    </ul>
  </template>
  <br>
  <h3>Merlin - {{ merlin.all.length }} systems</h3>
  <p>
    Automated - {{ merlin.automated.length }}&nbsp;&nbsp;
    Broken - {{ merlin.broken.length }}&nbsp;&nbsp;
    Manual - {{ merlin.manual.length }}
  </p>
  <button v-on:click="toggle('merlin')">
    {{(showList.merlin) ? 'Hide': 'Show'}} Merlin systems
  </button>
  <template v-if="showList.merlin">
    <ul id="merlin-list">
      <li v-for="item in merlin.all">
        {{ item.fqdn }}: {{ item.status }}
      </li>
    </ul>
  </template>
  <br>
  <h3>Osprey - {{ osprey.all.length }} systems</h3>
  <p>
    Automated - {{ osprey.automated.length }}&nbsp;&nbsp;
    Broken - {{ osprey.broken.length }}&nbsp;&nbsp;
    Manual - {{ osprey.manual.length }}
  </p>
  <button v-on:click="toggle('osprey')">
    {{(showList.osprey) ? 'Hide': 'Show'}} Osprey systems
  </button>
  <template v-if="showList.osprey">
    <ul id="osprey-list">
      <li v-for="item in osprey.all">
        {{ item.fqdn }}: {{ item.status }}
      </li>
    </ul>
  </template>
</div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'LabStatus',
  data: function () {
    return {
      message: '',
      host: 'http://10.76.144.103:3000',
      mustang: { all: [], automated: [], broken: [], manual: [] },
      merlin: { all: [], automated: [], broken: [], manual: [] },
      osprey: { all: [], automated: [], broken: [], manual: [] },
      showList: {
        mustang: false,
        merlin: false,
        osprey:false
      }
    }
  },
  methods: {
    toggle: function(param) {
      switch (param) {
        case 'mustang':
          this.showList.mustang = !this.showList.mustang;
          break;
        case 'merlin':
          this.showList.merlin = !this.showList.merlin;
          break;
        case 'osprey':
          this.showList.osprey = !this.showList.osprey;
          break;
        default: break;
      }
    }
  },
  created: function() {
    axios.get(this.host + '/api/query/lab_status')
    .then((res) => {
      //console.log(res)
      this.mustang = res.data.mustang
      this.merlin = res.data.merlin
      this.osprey = res.data.osprey
    })
    .catch((err) => {
      this.message = err
      console.log(err)
    })
  }
}
</script>

<style lang="sass" scoped>

ul
  list-style-type: none
  
</style>
