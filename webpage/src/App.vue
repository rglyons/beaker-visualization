<template>
  <v-app id="App" toolbar>
    <!-- drawer -->
    <v-navigation-drawer
      persistent
      v-model="drawer"
      light
      absolute
    >
      <v-list dense>
        <v-list-group
          v-for="(item, i) in sideBarItems"
          :key="i">
          <v-list-tile slot="item" :to="item.path">
            <v-list-tile-action>
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title>{{ item.title }}</v-list-tile-title>
            </v-list-tile-content>
            <!-- expansion list for lab status -->
            <v-list-tile-action v-if="item.items">
              <v-icon>keyboard_arrow_down</v-icon>
            </v-list-tile-action>
          </v-list-tile>
          <!-- expansion list for lab status -->
          <v-list-tile
            v-for="subItem in item.items"
            :key="subItem.title"
            :to="subItem.path"
          >
            <v-list-tile-content>
              <v-list-tile-title>
                {{ subItem.title }}
              </v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
        </v-list-group>
      </v-list>
    </v-navigation-drawer>
    <!-- toolbar -->
    <v-toolbar class="indigo" dark fixed>
      <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
      <v-toolbar-title>{{ activePage }}</v-toolbar-title>
    </v-toolbar>
    <!-- router view -->
    <main>
      <v-container fluid style="margin-top: 0px">
        <transition name="slide-fade" mode="out-in">
          <!-- exclude lab status to prevent canvas disappearing problem -->
          <keep-alive exclude="LabStatus">  
            <router-view></router-view>
          </keep-alive>
        </transition>
      </v-container>
    </main>
    <!-- <v-footer class="indigo">
      <span class="white--text">© 2017</span>
    </v-footer> -->
  </v-app>
</template>

<script>
import {mapState} from 'vuex'
import axios from 'axios'
import store from './store'

export default {
  name: 'App',
  data: function () {
    return {
      drawer: false,
      sideBarItems: [
        {
          title: 'Home',
          icon: 'home',
          path: '/home'
        },
        {
          title: 'Lab Status',
          icon: 'laptop',
          path: '',
          items: [
            {
              title: 'Mustang',
              path: '/lab_status/mustang'
            },
            {
              title: 'Merlin',
              path: '/lab_status/merlin'
            },
            {
              title: 'Osprey',
              path: '/lab_status/osprey'
            },
          ]
        },
        {
          title: 'Test History',
          icon: 'assessment',
          path: '/test_history'
        }
      ]
    }
  },
  computed: {
    ...mapState([
      'activePage',
      'host',
    ]),
  },
  methods: {},
  created: function() {
    // execute query
    axios.get(this.host + '/api/query/lab_status')
    .then((res) => {
      var labData = {
        mustang: res.data.mustang,
        merlin: res.data.merlin,
        osprey: res.data.osprey,
        distros: res.data.distros
      }
      // update state manager
      store.commit('updateLabData', labData)
      store.commit('setQuerying', false)
    })
    .catch((err) => {
      this.message = err
      console.log(err)
    })
  }
}
</script>

<style lang="sass">
#App
  font-family: 'Avenir', Helvetica, Arial, sans-serif
  text-align: center
  color: #2c3e50

.slide-fade-enter
  transform: translateY(1300px)
.slide-fade-enter-active
  transition: all 0.8s ease
.slide-fade-enter-to
  transform: translateY(0px)
.slide-fade-leave
  transform: translateX(0px)
.slide-fade-leave-active
  transition: all 0.2s
.slide-fade-leave-to
  transform: translateX(2500px)
</style>
