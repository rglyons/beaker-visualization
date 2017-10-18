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
  <div style="width: 60%; margin: auto; margin-top: 70px">
    <h3>{{ $route.params.labStatusSelected | capitalize }} - {{ numSystems }} systems</h3>
    <v-expansion-panel>
      <v-expansion-panel-content
        v-for="(item,i) in labData[$route.params.labStatusSelected]"
        :key="i"
      >
        <template v-if="i != 'all' && i != 'removed'">
          <div slot="header">{{ i | capitalize }} - {{ item.length }}</div>
          <v-card>
            <ul class="grey lighten-3">
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
              labelString: 'System Status',
              fontSize: 18,
              fontStyle: 'bold'
            },
            categoryPercentage: 0.75,
            barPercentage: 0.35
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
            // ticks: {
            //   stepSize: 25
            // }
          }]
        }
      }
    }
  },
  computed: {
    ...mapState([
      'querying_labStatus',
      'labData',
    ]),
    numSystems: function() {
      if (this.$route.params.labStatusSelected) {
        return (this.labData[this.$route.params.labStatusSelected].all.length
          - this.labData[this.$route.params.labStatusSelected].removed.length)
      } else {
        return 0
      }
    },
    // datasets for barChart 1
    barChart1_data: function() {
      return {
        labels: ['Automated', 'Broken', 'Manual'],
        datasets: [
          {
            label: this.$route.params.labStatusSelected,
            borderColor: '#26A65B',
            borderWidth: '1',
            backgroundColor: 'rgba(38, 166, 91, 0.35)',
            data: (this.$route.params.labStatusSelected) ? [
              this.labData[this.$route.params.labStatusSelected].automated.length,
              this.labData[this.$route.params.labStatusSelected].broken.length,
              this.labData[this.$route.params.labStatusSelected].manual.length
            ] : [0, 0, 0]
          }
        ]
      }
    }
  },
  watch: {

  },
  methods: {
    sortBoards (list) {
      return list.sort((sys1, sys2) => {
        let i = sys1.fqdn.indexOf('rack') + 4
        let j = sys2.fqdn.indexOf('rack') + 4
        return parseInt(sys1.fqdn.substr(i,3)) - parseInt(sys2.fqdn.substr(j,3))
      })
    }
  },
  mounted: function() {
    // add listener to resize chart when parent div resizes
    new ResizeSensor(this.$refs.barChart1, function() { })
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
