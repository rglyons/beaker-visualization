<template>
<div id="testresults">
  <!-- display spinner while waiting for query results -->
  <v-progress-linear
    id="querySpinner"
    v-bind:indeterminate="true"
    v-if="querying_labStatus">
  </v-progress-linear>
  <br>
  <v-expansion-panel popout>
    <v-expansion-panel-content v-model="queryExpanded">
      <div slot="header">Query</div>
      <v-card>
        <!-- step 1 -->
        <div id="step1" class="step">
          <div style="max-width: 2.5%">
            <img src="../assets/1.png" alt="number 1" align="left">
          </div>
          <div class="instruction">Select the system(s) you'd like to know more about</div>
          <br>
          <!-- board data -->
          <div style="width: 90%; display: table; margin:auto">
            <div style="display: table-row">
              <!-- mustang picker -->
              <div class="picker">
                <h3>Mustang</h3>
                <v-select style="width: 90%"
                  cache-items
                  multiple
                  chips
                  :items="labDataFlat.mustang"
                  v-model="eMustang"
                  label="Mustang Systems"
                  item-value="fqdn"
                >
                  <!-- custom chip for keeping the removal 'X' in view -->
                  <template slot="selection" scope="data">
                    <v-chip
                      close
                      @input="data.parent.selectItem(data.item)"
                      :selected="data.selected"
                      class="chip--select-multi customChip"
                      :key="data.item"
                    >
                      <div class="chipText">
                        {{ data.item  }}
                      </div>
                    </v-chip>
                  </template>
                </v-select>
              </div>
              <!-- merlin picker -->
              <div class="picker">
                <h3>Merlin</h3>
                <v-select style="width: 90%"
                  cache-items
                  multiple
                  chips
                  :items="labDataFlat.merlin"
                  v-model="eMerlin"
                  label="Merlin Systems"
                >
                  <!-- custom chip for keeping the removal 'X' in view -->
                  <template slot="selection" scope="data">
                    <v-chip
                      close
                      @input="data.parent.selectItem(data.item)"
                      :selected="data.selected"
                      class="chip--select-multi customChip"
                      :key="data.item"
                    >
                      <div class="chipText">
                        {{ data.item  }}
                      </div>
                    </v-chip>
                  </template>
                </v-select>
              </div>
              <!-- osprey picker -->
              <div class="picker">
                <h3>Osprey</h3>
                <v-select style="width: 90%"
                  cache-items
                  multiple
                  chips
                  :items="labDataFlat.osprey"
                  v-model="eOsprey"
                  label="Osprey Systems"
                  item-value="fqdn"
                >
                  <!-- custom chip for keeping the removal 'X' in view -->
                  <template slot="selection" scope="data">
                    <v-chip
                      close
                      @input="data.parent.selectItem(data.item)"
                      :selected="data.selected"
                      class="chip--select-multi customChip"
                      :key="data.item"
                    >
                      <div class="chipText">
                        {{ data.item  }}
                      </div>
                    </v-chip>
                  </template>
                </v-select>
              </div>
            </div>
          </div>
        </div>
        <!-- step 2 -->
        <div id="step2" class="step">
          <div style="max-width: 2.5%">
            <img src="../assets/2.png" alt="number 1" width="50" height="50" align="left">
          </div>
          <div class="instruction">Select the operating system(s) for the search</div>
          <br>
          <div style="width: 90%; display: table; margin:auto">
            <div style="display: table-row">
              <!-- os picker -->
              <div class="picker" style="float: left">
                <h3>Operating System</h3>
                <v-select style="width: 90%"
                  cache-items
                  multiple
                  chips
                  :items="labDataFlat.distros"
                  v-model="eDistro"
                  label="Operating Systems"
                  item-value="name"
                  :rules="[validate]"
                >
                  <!-- custom chip for keeping the removal 'X' in view -->
                  <template slot="selection" scope="data">
                    <v-chip
                      close
                      @input="data.parent.selectItem(data.item)"
                      :selected="data.selected"
                      class="chip--select-multi customChip"
                      :key="data.item"
                    >
                      <div class="chipText">
                        {{ data.item  }}
                      </div>
                    </v-chip>
                  </template>
                </v-select>
              </div>
            </div>
          </div>
        </div>
        <div style="width: 90%; margin: auto">
          <v-btn primary style="float: left; margin-bottom: 15px" @click="execQuery">Search</v-btn>
          <v-btn flat error @click="clearQueryForm">Clear</v-btn>
          <div id="queryLoadingSpinner" v-if="executingQuery">
            <v-progress-circular
              indeterminate v-bind:size="50" v-bind:width="5" class="red--text">
            </v-progress-circular>
          </div>
        </div>
      </v-card>
    </v-expansion-panel-content>
    <v-expansion-panel-content v-model="resultExpanded">
      <div slot="header">Results</div>
      <v-card>
        <v-card-title class="title">Job Statistics</v-card-title>
        <!-- <div style="width: 90%; margin: auto"> -->
        <v-card-title>
          <!-- boards that were queried -->
          <v-select
            id="queriedBoardSelect"
            :items="queriedBoards"
            v-model="etableFilter"
            label="Select a Board"
            bottom
          ></v-select>
          <v-spacer></v-spacer>
          <v-btn
            fab dark primary
            v-tooltip:left="{ html: 'Edit Display Filter' }"
            style="float: right"
            @click.native.stop="tableConfigDialog = true"
            >
            <v-icon dark>edit</v-icon>
          </v-btn>
        </v-card-title>
        <!-- </div> -->
        <v-data-table
          v-bind:headers="queryRes.headers"
          :items="queryRes.data[etableFilter]"
          hide-actions
          :no-data-text="'No Data Available!'"
          v-bind:pagination.sync="pagination"
          class="elevation-1"
          style="padding: 20px"
        >
          <!-- custom header for table filtering -->
          <template slot="headers" scope="props">
            <tr>
              <th v-for="(header, i) in props.headers" :key="i"
                :class="['column sortable', pagination.descending ? 'desc' : 'asc', header.value === pagination.sortBy ? 'active' : '']"
                @click="changeSort(header.value)"
                v-if="showHeaders.includes(header.text)">
                <v-icon>arrow_upward</v-icon>
                {{ header.text }}
              </th>
            </tr>
          </template>
          <template slot="items" scope="props">
            <td class="text-xs-left" v-for="(prop, key) in props.item"
              v-if="showHeaders.includes(key)">
              {{ prop }}
            </td>
          </template>
        </v-data-table>
      </v-card>
    </v-expansion-panel-content>
  </v-expansion-panel>
  <!-- edit table fields dialog -->
  <v-dialog v-model="tableConfigDialog"
            lazy
            absolute
            width="40%">
    <v-card>
      <v-card-title>
        <div class="headline">Display Filter</div>
      </v-card-title>
      <v-card-text>
        <v-layout row wrap>
          <v-flex xs12
                  md6
                  v-for="(el, i) in queryRes.headers"
                  :key="i">
            <v-switch :label="el.text"
                      v-model="showHeaders"
                      color="red darken-3"
                      :value="el.text"
                      hide-details></v-switch>
          </v-flex>
        </v-layout>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn class="purple--text darken-1"
               flat="flat"
               @click.native="setTableConfigDefault">Set As Default</v-btn>
        <v-btn class="green--text darken-1"
               flat="flat"
               @click.native="tableConfigDialog = false">Close</v-btn>
      </v-card-actions>
      <!-- snackbar for altering user of successful
      update of default table config -->
      <v-snackbar
        :timeout="3000"
        bottom left
        v-model="cfgSnackbar"
      >
        Update Successful
        <v-btn flat class="pink--text" @click.native="cfgSnackbar = false">Close</v-btn>
      </v-snackbar>
    </v-card>
  </v-dialog>
</div>
</template>

<script>
import {mapState} from 'vuex'
import axios from 'axios'

export default {
  name: 'TestResults',
  data() {
    return {
      queryExpanded: true,  // control the initial state of the accordion
      resultExpanded: false,
      executingQuery: false,
      tableConfigDialog: false,
      cfgSnackbar: false,
      eMustang: [],
      eMerlin: [],
      eOsprey: [],
      eDistro: [],
      etableFilter: null,
      pagination: { sortBy: 'Operating System' },
      showHeaders: (localStorage.showHeaders) ? localStorage.showHeaders.split(',') :
      [
        'Operating System',
        'Status Completed (ct)',
        'Result Pass (ct)',
        'Result Fail (ct)',
        'Result Pass (%)',
        'Result Fail (%)'
      ],
      queriedBoards: [],
      queryRes: {
        data: {},
        headers: [
          { text: 'Operating System', value: 'Operating System' },
          // statuses
          { text: 'Status New (ct)', value: 'Status New (ct)' },
          { text: 'Status Processed (ct)', value: 'Status Processed (ct)' },
          { text: 'Status Queued (ct)', value: 'Status Queued (ct)' },
          { text: 'Status Scheduled (ct)', value: 'Status Scheduled (ct)' },
          { text: 'Status Waiting (ct)', value: 'Status Waiting (ct)' },
          { text: 'Status Installing (ct)', value: 'Status Installing (ct)' },
          { text: 'Status Running (ct)', value: 'Status Running (ct)' },
          { text: 'Status Reserved (ct)', value: 'Status Reserved (ct)' },
          { text: 'Status Completed (ct)', value: 'Status Completed (ct)' },
          { text: 'Status Cancelled (ct)', value: 'Status Cancelled (ct)' },
          { text: 'Status Aborted (ct)', value: 'Status Aborted (ct)' },
          // results
          { text: 'Result New (ct)', value: 'Result New (ct)' },
          { text: 'Result Pass (ct)', value: 'Result Pass (ct)' },
          { text: 'Result Warn (ct)', value: 'Result Warn (ct)' },
          { text: 'Result Fail (ct)', value: 'Result Fail (ct)' },
          { text: 'Result Panic (ct)', value: 'Result Panic (ct)' },
          { text: 'Result None (ct)', value: 'Result None (ct)' },
          { text: 'Result Skip (ct)', value: 'Result Skip (ct)' },
          // rates
          { text: 'Result New (%)', value: 'Result New (%)' },
          { text: 'Result Pass (%)', value: 'Result Pass (%)' },
          { text: 'Result Warn (%)', value: 'Result Warn (%)' },
          { text: 'Result Fail (%)', value: 'Result Fail (%)' },
          { text: 'Result Panic (%)', value: 'Result Panic (%)' },
          { text: 'Result None (%)', value: 'Result None (%)' },
          { text: 'Result Skip (%)', value: 'Result Skip (%)' }
        ]
      }
    }
  },
  computed: {
    ...mapState([
      'querying_labStatus',
      'labData',
      'host'
    ]),
    labDataFlat: function () {
      var mustang = this.labData.mustang.all.map(function (system) {
        return system.fqdn
      }).sort(function (sys1, sys2) {
        let i = sys1.indexOf('rack') + 4
        let j = sys2.indexOf('rack') + 4
        return parseInt(sys1.substr(i,3)) - parseInt(sys2.substr(j,3))
      });
      var merlin = this.labData.merlin.all.map(function (system) {
        return system.fqdn
      }).sort(function (sys1, sys2) {
        let i = sys1.indexOf('rack') + 4
        let j = sys2.indexOf('rack') + 4
        return parseInt(sys1.substr(i,3)) - parseInt(sys2.substr(j,3))
      });
      var osprey = this.labData.osprey.all.map(function (system) {
        return system.fqdn
      }).sort(function (sys1, sys2) {
        let i = sys1.indexOf('rack') + 4
        let j = sys2.indexOf('rack') + 4
        return parseInt(sys1.substr(i,3)) - parseInt(sys2.substr(j,3))
      });
      var distros = this.labData.distros.map(function (distro) {
        return distro.name
      }).sort();
      return {
        mustang: mustang,
        merlin: merlin,
        osprey: osprey,
        distros: distros
      }
    }
  },
  methods: {
    changeSort (column) {
      if (this.pagination.sortBy === column) {
        this.pagination.descending = !this.pagination.descending
      } else {
        this.pagination.sortBy = column
        this.pagination.descending = false
      }
    },
    validate() {
      if (this.eDistro.length == 0) return 'Required'
      return true
    },
    clearQueryForm () {
      this.eMustang = []
      this.eMerlin = []
      this.eOsprey = []
      this.eDistro = []
    },
    setTableConfigDefault () {
      console.log('updating default table config settings to\n' + this.showHeaders)
      localStorage.showHeaders = this.showHeaders
      // show snackbar alerting user of successful update
      this.cfgSnackbar = true
    },
    execQuery () {
      // check if an OS has been selected for the search
      if (this.validate() == 'Required') return
      this.executingQuery = true
      // gather queried boards for results dropdown
      this.queriedBoards = this.eMustang.concat(this.eMerlin, this.eOsprey)
      // make the ajax request
      axios.get(this.host + '/api/query/test_history?boards='
                 + this.queriedBoards + '&distros=' + this.eDistro)
      .then((res) => {
        // handle response data
        this.queryRes.data = res.data
        // update UI
        this.executingQuery = false
        this.queryExpanded = false
        this.resultExpanded = true
        // pre-fill data table
        this.etableFilter = this.queriedBoards[0]
      })
      .catch((err) => {
        console.log(err)
        //display error message somewhere

        // update UI
        this.executingQuery = false
      })
    }
  }
}
</script>

<style lang="sass" scoped>

#querySpinner
  margin: auto
  width: 90%
  padding: 10px

img
  float: left
  max-width: 100%
  height: auto
  width: auto
  margin-left: 5px

.instruction
  text-align: left
  padding-left: 20px
  margin-bottom: 0.75em
  float: left
  height: 50px
  font-size: 35px
  font-size: 1.75vw
  color: #2394BC

.picker
  padding: 10px
  display: inline-block
  text-align: left
  width: 33%
  max-width: 33%

.step h3
  font-size: 35px
  font-size: 1.5vw

.step
  margin-bottom: 4em

.chipText
  max-width: 91%
  overflow: hidden

.customChip
  max-width: 96%

#queryLoadingSpinner
  text-align: center
  display: inline-block
  margin-left: 10px

#queriedBoardSelect
  width: 30%
  margin: 10px
  display: inline-block
  float: left

</style>
