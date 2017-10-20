<template>
<div id="labstatus">
  <!-- display spinner while waiting for query results -->
  <v-progress-linear
    id="querySpinner"
    v-bind:indeterminate="true"
    v-if="querying_labStatus">
  </v-progress-linear>
  <!-- add in a graph component -->
  <div id="barChart1" ref="barChart1" :key="barChart1_data.datasets[0].label">
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
      sensor: null,
      destroying: false,
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

  },
  mounted: function() {
    // add listener to resize chart when parent div resizes
    this.sensor = new ResizeSensor(this.$refs.barChart1, function() { })
  },
  updated: function() {
    /* replace resize sensor when changing graph
    * since graph parent div loses sensor when
    * changing graph data (on route navigation)
    */
    this.$nextTick(function() {
      /* this function executes after every UI update after
      * DOM elements are finished rendering -
      *
      * add listener to resize chart when parent div resizes
      * use a bool to indicate when a new resize sensor should and
      * should not be created. If we're destroying the component,
      * a new resize sensor should not be created (bc the HTML element
      * isn't there anymore and it throws errors)
      */
      if (!this.destroying) {
        this.sensor = new ResizeSensor(this.$refs.barChart1, function() { })
      }
    })
  },
  beforeDestroy: function() {
    /* remove resize sensor so it's not trying
    * to execute on something that no longer exists
    * (after router leaves this component)
    */
    ResizeSensor.detach(this.$refs.barChart1);
    this.destroying = true
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
