<template>
<div id="labstatus">
  <!-- add in a graph component -->
  <div id="barChart1" ref="barChart1">
    <bar-chart
      :chart-data="barChart1_data"
      :options="barChart1_options"
    >
    </bar-chart>
  </div>
  <br>
  <!-- board data -->
  <div style="width: 90%; display: table; margin:auto">
    <div style="display: table-row">
      <!-- mustang board data -->
      <div class="detail-list">
        <h3>Mustang - {{ mustang.all.length }} systems</h3>
        <v-expansion-panel>
          <v-expansion-panel-content v-for="(item,i) in mustang" :key="i">
            <template v-if="i != 'all'">
              <div slot="header">{{i[0].toUpperCase() + i.slice(1)}} - {{ item.length }}</div>
              <v-card>
                <ul id="mustang-list" class="grey lighten-3">
                  <li v-for="board in item">
                    {{ board.fqdn }}
                  </li>
                </ul>
              </v-card>
            </template>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </div>
      <!-- merlin board data -->
      <br>
      <div class="detail-list">
        <h3>Merlin - {{ merlin.all.length }} systems</h3>
        <v-expansion-panel>
          <v-expansion-panel-content v-for="(item,i) in merlin" :key="i">
            <template v-if="i != 'all'">
              <div slot="header">{{i[0].toUpperCase() + i.slice(1)}} - {{ item.length }}</div>
              <v-card>
                <ul id="merlin-list" class="grey lighten-3">
                  <li v-for="board in item">
                    {{ board.fqdn }}
                  </li>
                </ul>
              </v-card>
            </template>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </div>
      <!-- osprey board data -->
      <br>
      <div class="detail-list">
        <h3>Osprey - {{ osprey.all.length }} systems</h3>
        <v-expansion-panel>
          <v-expansion-panel-content v-for="(item,i) in osprey" :key="i">
            <template v-if="i != 'all'">
              <div slot="header">{{i[0].toUpperCase() + i.slice(1)}} - {{ item.length }}</div>
              <v-card>
                <ul id="osprey-list" class="grey lighten-3">
                  <li v-for="board in item">
                    {{ board.fqdn }}
                  </li>
                </ul>
              </v-card>
            </template>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </div>
    </div>
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
              padding: 30
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
  methods: {},
  created: function() {
    // execute query
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
  },
  mounted: function() {
    // add listener to resize chart when parent div resizes
    console.log(this.$refs.barChart1)
    new ResizeSensor(this.$refs.barChart1, function() {
      //console.log('resizing chart container')
      //$scope.$emit('$resize')
    })
  }
}
</script>

<style lang="sass" scoped>
ul
  list-style-type: none

.detail-list
  width: 33%
  padding: 10px
  display: table-cell

.detail-list h3
  font-size: 35px
  font-size: 2.0vw

#barChart1
  margin: auto
  width: 90%
  padding: 10px

</style>
