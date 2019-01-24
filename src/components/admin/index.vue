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
    </v-navigation-drawer>-->
    <v-toolbar dense>
      <!-- <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon> -->
      <v-toolbar-title>
        <div class=""> <v-icon>settings</v-icon>Configuracion</div>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-toolbar-items>
        <v-btn
          v-for="(item,index) in menu"
          :key="index"
          flat
          @click="currentComponent = item.component"
        >
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
import ComponentMembers from "@/components/admin/Members";
import ComponentUsers from "@/components/admin/Users";
export default {
  data: () => ({
    drawer: null,
    currentComponent: "component-members",
    menu: [
      // {
      //   component: "admin-hotel",
      //   title: "Hotel",
      //   icon: "domain"
      // },
      {
        component: "component-members",
        title: "Miembros",
        icon: "group"
      },
      {
        component: "component-users",
        title: "Usuarios",
        icon: "group"
      }
    ]
  }),
  components: {
    "component-members": ComponentMembers,
    "component-users": ComponentUsers
    // 'c-tour': () => ctour
  },
  props: {
    source: String
  }
};
</script>
