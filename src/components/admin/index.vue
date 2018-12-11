<template>
  <v-app id="inspire">
    <!-- <v-navigation-drawer v-model="drawer" fixed app>
      <v-list dense>
        <v-list-tile @click="currentComponent = 'admin-tour'">
          <v-list-tile-action>
            <v-icon>home</v-icon>
          </v-list-tile-action>
          <v-list-tile-content >
            <v-list-tile-title>Tours</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
        <v-list-tile @click="currentComponent = 'admin-hotel'">
          <v-list-tile-action>
            <v-icon>contact_mail</v-icon>
          </v-list-tile-action>
          <v-list-tile-content >
            <v-list-tile-title>Hoteles</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
        <v-list-tile @click="currentComponent = 'admin-place'">
          <v-list-tile-action>
            <v-icon>contact_mail</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>Lugares</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer> -->
    <v-toolbar color="indigo" dark dense>
      <!-- <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon> -->
      <v-toolbar-title>Configuracion</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-toolbar-items>
        <v-btn v-for="(item,index) in menu" :key="index" flat @click="currentComponent = item.component">
          {{item.title}}
          <v-icon right dark>{{item.icon}}</v-icon>
        </v-btn>
      </v-toolbar-items>
    </v-toolbar>
    <keep-alive>
      <component :is="currentComponent"></component>
    </keep-alive>
  </v-app>
</template>
<script>
  import AdminTour from '@/components/admin/tour'
  import AdminHotel from '@/components/admin/hotel'
  import AdminPlace from '@/components/admin/place'
  export default {
    data: () => ({
      drawer: null,
      currentComponent: 'admin-tour',
      menu: [{
          component: "admin-tour",
          title: "Tour",
          icon: "directions_bus"
        },
        {
          component: "admin-hotel",
          title: "Hotel",
          icon: "domain"
        },
        {
          component: "admin-place",
          title: "Lugares",
          icon: "place"
        }
      ]
    }),
    components: {
      'admin-tour': AdminTour,
      'admin-hotel': AdminHotel,
      'admin-place': AdminPlace,
      // 'c-tour': () => ctour
    },
    props: {
      source: String
    },

  }

</script>
