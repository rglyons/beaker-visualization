<template>
<div id="testresults">
  <!-- display spinner while waiting for query results -->
  <v-progress-linear
    id="querySpinner"
    v-bind:indeterminate="true"
    v-if="querying_labStatus">
  </v-progress-linear>
  <br>
  <!-- step 1 -->
  <div id="step1" class="step">
    <div style="max-width: 2.5%">
      <img src="../assets/1.png" alt="number 1" width="50" height="50" align="left">
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
        <div class="picker">
          <h3>Operating System</h3>
          <v-select style="width: 33%"
            cache-items
            multiple
            chips
            :items="labDataFlat.distros"
            v-model="eDistro"
            label="Operating Systems"
            item-value="name"
          ></v-select>
        </div>
      </div>
    </div>
  </div>
  <div style="width: 90%; margin: auto">
    <v-btn primary style="float: left" @click="execQuery">Search</v-btn>
  </div>
</div>
</template>

<script>
import {mapState} from 'vuex'
import axios from 'axios'

export default {
  name: 'TestResults',
  data() {
    return {
      eMustang: null,
      eMerlin: null,
      eOsprey: null,
      eDistro: null
    }
  },
  computed: {
    ...mapState([
      'querying_labStatus',
      'labData'
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
    execQuery () {
      // gather selections
      console.log(
        'eMustang = ' + typeof this.eMustang + '\n' +
        'eMerlin = ' + typeof this.eMerlin + '\n' +
        'eOsprey = ' + typeof this.eOsprey + '\n' +
        'eDistro = ' + typeof this.eDistro
      )
      // make the ajax request

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

.instruction
  text-align: left
  padding-left: 20px
  margin-bottom: 0.75em
  float: left
  height: 50px
  font-size: 35px
  font-size: 2.0vw
  color: #2394BC

.picker
  padding: 10px
  display: table-cell
  text-align: left
  width: 33%
  max-width: 33%

.step h3
  font-size: 35px
  font-size: 2.0vw

.step
  margin-bottom: 4em

.chipText
  max-width: 91%
  overflow: hidden

.customChip
  max-width: 96%

</style>
