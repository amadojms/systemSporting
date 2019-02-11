<template>
  <v-app>
    <v-navigation-drawer v-model="drawer" fixed app id="menu">
      <v-list dense>
        <v-list-tile v-for="(tab, index) in tabs" :key="index" :to="tab.url">
          <v-list-tile-action>
            <v-icon>{{tab.icon}}</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>{{tab.title}}</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
        <template v-if="auth">
          <v-list-tile @click="signOut">
            <v-list-tile-action>
              <v-icon>power_settings_new</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title>Logout</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
        </template>
      </v-list>
    </v-navigation-drawer>
    <v-toolbar color="gray" fixed app dark height="50">
      <!-- dense dark tabs  -->
      <v-toolbar-side-icon class="hidden-xl-only hidden-md-and-up" @click.stop="drawer = !drawer"></v-toolbar-side-icon>
      <v-toolbar-title v-text="title"></v-toolbar-title>
      <v-spacer></v-spacer>
      <v-toolbar-items class="hidden-sm-and-down hidden-xs-only">
        <v-btn v-for="tab in tabs" :key="tab.url" flat :to="tab.url">
          <div class="font-weight-thin">{{tab.title}}</div>
          <v-icon right dark>{{tab.icon}}</v-icon>
        </v-btn>
        <template v-if="auth">
          <!-- <v-btn flat to="/admin">
            <v-icon dark>settings</v-icon>
          </v-btn>-->
          <v-btn @click="signOut" flat>
            <v-icon dark>power_settings_new</v-icon>
          </v-btn>
        </template>
      </v-toolbar-items>
      <v-toolbar-items>
        <v-btn @click="notification_sidebar = true" flat>
          <v-badge color="red">
            <span slot="badge">6</span>
            <v-icon>notifications</v-icon>
          </v-badge>
        </v-btn>
      </v-toolbar-items>
    </v-toolbar>
    <v-navigation-drawer
      right
      fixed
      temporary
      floating
      v-model="notification_sidebar"
      id="notifications"
    >
      <v-list two-line dense>
        <v-list-tile>
          <v-list-tile-content>
            <v-list-tile-title class="title">Notificaciones</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
        <template v-for="(item, index) in notifications">
          <v-list-tile :key="item.title" avatar ripple @click="toggle(index)">
            <v-list-tile-action avatar ripple>
              <v-icon>{{item.icon}}</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title>{{item.title}}</v-list-tile-title>
              <v-list-tile-sub-title class="text--primary">{{ item.description }}</v-list-tile-sub-title>
            </v-list-tile-content>
            <v-list-tile-action>
              <v-list-tile-action-text>{{ item.date }}</v-list-tile-action-text>
              <v-icon color="grey lighten-1">eyes</v-icon>
            </v-list-tile-action>
          </v-list-tile>
          <v-divider v-if="index + 1 < notifications.length" :key="index"></v-divider>
        </template>
      </v-list>
    </v-navigation-drawer>
    <v-content>
      <v-container fluid fill-height>
        <transition name="fade" mode="out-in">
          <router-view/>
        </transition>
      </v-container>
    </v-content>
    <v-footer dark height="auto">
      <v-card class="flex" flat tile>
        <v-card-actions class="grey darken-3 justify-center">
          &copy;{{year}} —
          <strong>{{title}}</strong>
        </v-card-actions>
      </v-card>
    </v-footer>
  </v-app>
</template>

<script>
import { mapState } from "vuex";
import firebase from "firebase";
export default {
  name: "App",
  data() {
    return {
      active: 1,
      clipped: false,
      drawer: false,
      fixed: false,
      uid: "",
      icons: [
        "fab fa-facebook",
        "fab fa-twitter",
        "fab fa-google-plus",
        "fab fa-linkedin",
        "fab fa-instagram"
      ],
      notification_sidebar: true,
      tabs: [
        {
          url: "/members",
          title: "Miembros",
          icon: "group_work"
        },
        {
          url: "/users",
          title: "Usuarios",
          icon: "supervised_user_circle"
        }
        // {
        //   url: "/contacto",
        //   title: "Contacto",
        //   icon: "person"
        // },
      ],
      notifications: [
        {
          // priority:"pay",
          icon: "payment",
          title: "Pago",
          date: "Hoy",
          description: "Pago de Miguel Martin vence en 5 di�s"
        },
        {
          // priority:"pay",
          icon: "payment",
          title: "Pago2",
          date: "Ayer",
          description: "Pago de Miguel Martin vence en 5 di�s"
        }
      ],
      miniVariant: false,
      right: true,
      rightDrawer: false,
      title: "CrossFit Admin",
      auth: false,
      year: new Date().getFullYear()
    };
  },
  computed: {
    lang() {
      return this.$store.state.lang;
    }
  },
  methods: {
    OnAuth() {
      var vm = this;
      firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
          vm.auth = true;
        } else {
          vm.auth = false;
        }
      });
    },
    changeLang(lang) {
      var vm = this;
      // if(lang == 'es'){
      //   var lang = 'en';
      // }
      this.$store.commit("changeLang", { lang: lang });
    },
    signOut() {
      var vm = this;
      firebase
        .auth()
        .signOut()
        .then(function() {
          console.log("sesion cerrada");
          localStorage.removeItem("Uid");
          vm.$router.push({ path: "/" });
          vm.logout = true;
          vm.uid = "";
        })
        .catch(function(error) {
          vm.$swal(error);
        });
    }
  },
  mounted() {
    var vm = this;
    vm.OnAuth();
    console.log(this.$store.state.count);
    console.log("mapState ", mapState);
    vm.year = new Date().getFullYear();
  }
};
</script>
<style>
.fade-enter-active,
.fade-leave-active {
  transition-duration: 0.4s;
  transition-property: opacity;
  transition-timing-function: ease;
}

.fade-enter,
.fade-leave-active {
  opacity: 0;
}
</style>
