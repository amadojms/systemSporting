<template>
  <v-app id="inspire">
    <v-layout justify-center class="bg_login">
      <v-dialog v-model="dialog" persistent max-width="290">
        <v-card>
          <v-card-title class="headline">{{ error.code }}</v-card-title>
          <v-card-text>{{ error.message }}</v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="red darken-1" flat @click.native="dialog = false">Cerrar</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-flex xs12 sm8 md4>
        <div class="display-3" color="red">CrossFit.</div>
        <br>
        <v-card class="elevation-3">
          <v-toolbar flat dark color="primary">
            <v-toolbar-title>Iniciar sesion</v-toolbar-title>
            <v-spacer></v-spacer>
          </v-toolbar>
          <v-card-text>
            <v-form>
              <v-text-field
                prepend-icon="person"
                name="login"
                label="Login"
                type="text"
                v-model="email"
              ></v-text-field>
              <v-text-field
                prepend-icon="lock"
                name="password"
                label="Password"
                type="password"
                v-model="password"
              ></v-text-field>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <div v-if="process" class="text-xs-center">
              <v-progress-circular :size="25" color="primary" indeterminate></v-progress-circular>
            </div>
            <v-spacer></v-spacer>
            <v-btn flat color="primary" @click="login">Iniciar sesi�n</v-btn>
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>
  </v-app>
</template>

<script>
import firebase from "firebase";
export default {
  data: () => ({
    drawer: null,
    email: "amadojms@gmail.com",
    password: "123456",
    process: false,
    dialog: false,
    error: {}
  }),
  props: {
    source: String
  },
  methods: {
    login() {
      var vm = this;
      console.log(vm.email, vm.password, window.location);
      vm.process = true;

      firebase
        .auth()
        .signInWithEmailAndPassword(vm.email, vm.password)
        .then(function(firebaseUser) {
          vm.process = false;
          // console.log(firebaseUser);
          localStorage.setItem("User", JSON.stringify(firebaseUser.user));
          localStorage.setItem("Uid", firebaseUser.user.uid);
          // window.location = '/admin';
          vm.$router.push({ path: "/admin" });
        })
        .catch(function(error) {
          vm.process = false;
          vm.error = error;
          vm.dialog = true;
          console.log(error);
        });
    }
  }
};
</script>
<style scoped>
.bg_login {
  background-image: url("../../static/img/bg_login.jpg");
  background-repeat: no-repeat;
	background-position: center center;
	background-size: cover;
	background-attachment: fixed;
}
</style>

