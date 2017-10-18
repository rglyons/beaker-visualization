<template>
<div>
  <!-- welcome message -->
  <div id="welcomeMessage">
    <p id="welcome">Welcome!</p>
    <p>
      This is the Beaker Visualization Portal -
      Here is a summary of the lab's utilization:</p>
  </div>
  <!-- fail counter -->
  <div id="failCounter">
    <i-odometer :value="failureCount"></i-odometer>
    <p style="font-size: 2vw">failures caught to date</p>
  </div>
  <!-- board utilization cards -->
  <v-container id="container" fluid grid-list-xl>
    <v-layout row wrap>
      <!-- mustang card -->
      <v-flex d-flex xs12 sm6 md4>
        <v-card>
          <v-card-media
            class="white--text lighten-2"
            height="200px"
            src="/webpage/src/assets/mustang.jpg"
          >
            <v-container fill-height fluid>
              <v-layout fill-height>
                <v-flex xs12 align-end flexbox text-xs-left style="padding-top: 0px">
                  <span class="headline">Mustang</span>
                </v-flex>
              </v-layout>
            </v-container>
          </v-card-media>
          <v-card-title primary class="title">
            {{ util.mustang + '% Utilized' }}
          </v-card-title>
          <v-card-actions>
            <v-spacer></v-spacer>   <!-- to right-align buttons -->
            <v-btn class="orange--text darken-1"
                   flat="flat">More</v-btn>
          </v-card-actions>
        </v-card>
      </v-flex>
      <!-- merlin card -->
      <v-flex d-flex xs12 sm6 md4>
        <v-card>
          <v-card-media
            class="white--text"
            height="200px"
            src="/webpage/src/assets/merlin.jpg"
          >
            <v-container fill-height fluid>
              <v-layout fill-height>
                <v-flex xs12 align-end flexbox text-xs-left style="padding-top: 0px">
                  <span class="headline">Merlin</span>
                </v-flex>
              </v-layout>
            </v-container>
          </v-card-media>
          <v-card-title primary class="title">
            {{ util.merlin + '% Utilized' }}
          </v-card-title>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn class="orange--text darken-1"
                   flat="flat">More</v-btn>
          </v-card-actions>
        </v-card>
      </v-flex>
      <!-- osprey card -->
      <v-flex d-flex xs12 sm6 md4>
        <v-card>
          <v-card-media
            class="white--text lighten-2"
            height="200px"
            src="/webpage/src/assets/osprey_1.jpg"
          >
            <v-container fill-height fluid>
              <v-layout fill-height>
                <v-flex xs12 align-end flexbox text-xs-left style="padding-top: 0px">
                  <span class="headline">Osprey</span>
                </v-flex>
              </v-layout>
            </v-container>
          </v-card-media>
          <v-card-title primary class="title">
            {{ util.osprey + '% Utilized' }}
          </v-card-title>
          <v-card-actions>
            <v-spacer></v-spacer>   <!-- to right-align buttons -->
            <v-btn class="orange--text darken-1"
                   flat="flat">More</v-btn>
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</div>
</template>

<script>
import IOdometer from 'vue-odometer'
import {mapState} from 'vuex'
import axios from 'axios'

export default {
  name: 'Home',
  components: {
    IOdometer
  },
  data () {
    return {
      failureCount: 0,
      util: {
        mustang: 0,
        merlin: 0,
        osprey: 0
      }
    }
  },
  computed: {
    ...mapState([
      'querying_labStatus',
      'labData',
      'host'
    ])
  },
  methods: {
    getUtilizationData () {
      // get utilization statisitcs
      axios.get(this.host + '/api/query/utilization')
      .then((res) => {
        this.failureCount = res.data.failureCount
        this.util.mustang = Math.round((res.data.mustang.utilized / res.data.mustang.count) * 100)
        this.util.merlin = Math.round((res.data.merlin.utilized / res.data.merlin.count) * 100)
        this.util.osprey = Math.round((res.data.osprey.utilized / res.data.osprey.count) * 100)
      })
      .catch((err) => {
        this.message = err
        console.log(err)
      })
    }
  },
  mounted () {
    this.getUtilizationData()
    setInterval(() => {
      this.getUtilizationData()
    }, 1800000) // get utilization every 30 min
  }
}
</script>

<style lang="sass">

#welcomeMessage
  margin: auto
  width: 80%
  font-size: 1.25vw

#welcome
  font-size: 2.5vw
  font-family: "Franklin Gothic Medium"

#failCounter
  margin-left: auto
  margin-right: auto
  margin-top: 50px
  font-size: 5vw
  color: #CF000F

#failCounter p
  margin: 1px

#container
  margin-top: 100px
  margin-left: auto
  margin-right: auto
  width: 90%

</style>
