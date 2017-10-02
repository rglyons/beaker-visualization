<template>
<div id="labstatus">
  <!-- add in a graph component -->
  <div id="barChart1">
    <bar-chart
      :chart-data="barChart1_data"
      :options="barChart1_options"
    >
    </bar-chart>
  </div>
  <br>
  <div>
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
</div>
</template>

<script>
import axios from 'axios'
import BarChart from './BarChart'

export default {
  name: 'LabStatus',
  components: {
    BarChart
  },
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
      },
      barChart1_options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          xAxes: [{
            gridLines: {
              display: true
            },
            scaleLabel: {
              display: true,
              labelString: 'System Type',
              fontSize: 18,
              fontStyle: 'bold'
            },
            categoryPercentage: 0.75,
            barPercentage: 0.65
          }],
          yAxes: [{
            gridLines: {
              display: true
            },
            scaleLabel: {
              display: true,
              labelString: 'Number of Systems',
              fontSize: 18,
              fontStyle: 'bold',
              padding: 6
            },
            ticks: {
              stepSize: 25
            }
          }]
        }
      }
    }
  },
  computed: {
    // datasets for barChart 1
    barChart1_data: function() {
      console.log('computing barChart1 data')
      return {
        labels: ['Mustang', 'Merlin', 'Osprey'],
        datasets: [
          {
            label: 'Automated',
            borderColor: '#26A65B',
            borderWidth: '1',
            backgroundColor: 'rgba(38, 166, 91, 0.35)',
            data: [
              // this.mustang.automated.length,
              // this.merlin.automated.length,
              // this.osprey.automated.length
              220, 8, 50
            ]
          },
          {
            label: 'Broken',
            borderColor: '#F62459',
            borderWidth: '1',
            backgroundColor: 'rgba(246, 30, 150, 0.35)',
            data: [
              // this.mustang.broken.length,
              // this.merlin.broken.length,
              // this.osprey.broken.length
              75, 8, 23
            ]
          },
          {
            label: 'Manual',
            borderColor: '#FFA400',
            borderWidth: '1',
            backgroundColor: 'rgba(255, 100, 0, 0.35)',
            data: [
              // this.mustang.manual.length,
              // this.merlin.manual.length,
              // this.osprey.manual.length
              8, 7, 3
            ]
          },
        ]
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
