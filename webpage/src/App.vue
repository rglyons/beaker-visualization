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
      <v-container fluid>
        <transition name="slide-fade" mode="out-in">
          <keep-alive>
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
          path: '/lab_status'
        }
      ]
    }
  },
  computed: {
    ...mapState([
      'activePage'
    ]),
  }
}
</script>

<style lang="sass">
#App
  font-family: 'Avenir', Helvetica, Arial, sans-serif
  text-align: center
  color: #2c3e50
  margin-top: 60px

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
