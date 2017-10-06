<template>
<div id="labstatus">
  <!-- display spinner while waiting for query results -->
  <v-progress-linear
    id="querySpinner"
    v-bind:indeterminate="true"
    v-if="querying_labStatus">
  </v-progress-linear>
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
        <h3>Mustang - {{ numMustang }} systems</h3>
        <v-expansion-panel>
          <v-expansion-panel-content v-for="(item,i) in labData.mustang" :key="i">
            <template v-if="i != 'all' && i != 'removed'">
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
        <h3>Merlin - {{ numMerlin }} systems</h3>
        <v-expansion-panel>
          <v-expansion-panel-content v-for="(item,i) in labData.merlin" :key="i">
            <template v-if="i != 'all' && i != 'removed'">
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
        <h3>Osprey - {{ numOsprey }} systems</h3>
        <v-expansion-panel>
          <v-expansion-panel-content v-for="(item,i) in labData.osprey" :key="i">
            <template v-if="i != 'all' && i != 'removed'">
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
import {mapState} from 'vuex'
import BarChart from './BarChart'

export default {
  name: 'LabStatus',
  components: {
    BarChart
  },
  data: function () {
    return {
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
    ...mapState([
      'querying_labStatus',
      'labData'
    ]),
    numMustang: function() {
      return this.labData.mustang.all.length - this.labData.mustang.removed.length
    },
    numMerlin: function() {
      return this.labData.merlin.all.length - this.labData.merlin.removed.length
    },
    numOsprey: function() {
      return this.labData.osprey.all.length - this.labData.osprey.removed.length
    },
    // datasets for barChart 1
    barChart1_data: function() {
      return {
        labels: ['Mustang', 'Merlin', 'Osprey'],
        datasets: [
          {
            label: 'Automated',
            borderColor: '#26A65B',
            borderWidth: '1',
            backgroundColor: 'rgba(38, 166, 91, 0.35)',
            data: [
              this.labData.mustang.automated.length,
              this.labData.merlin.automated.length,
              this.labData.osprey.automated.length
              // 220, 8, 50
            ]
          },
          {
            label: 'Broken',
            borderColor: '#F62459',
            borderWidth: '1',
            backgroundColor: 'rgba(246, 30, 150, 0.35)',
            data: [
              this.labData.mustang.broken.length,
              this.labData.merlin.broken.length,
              this.labData.osprey.broken.length
              // 75, 8, 23
            ]
          },
          {
            label: 'Manual',
            borderColor: '#FFA400',
            borderWidth: '1',
            backgroundColor: 'rgba(255, 100, 0, 0.35)',
            data: [
              this.labData.mustang.manual.length,
              this.labData.merlin.manual.length,
              this.labData.osprey.manual.length
              // 8, 7, 3
            ]
          },
        ]
      }
    }
  },
  mounted: function() {
    // add listener to resize chart when parent div resizes
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

#querySpinner
  margin: auto
  width: 90%
  padding: 10px

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
