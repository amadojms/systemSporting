<template>
  <v-container fluid>
    <v-layout row wrap>
      <v-flex xs12 sm12 md12>
        <v-card>
          <v-toolbar flat color="white">
            <v-toolbar-title>
              <h3 class="display-1">Usuarios</h3>
            </v-toolbar-title>
            <v-divider class="mx-3" inset vertical></v-divider>
            <div class="subheading">Administra tus usuarios</div>
            <v-spacer></v-spacer>
            <v-btn color="primary" small dark @click="addUser">Agregar</v-btn>
          </v-toolbar>
          <v-toolbar flat color="white">
            <v-flex sm12>
              <v-text-field v-model="search" append-icon="search" label="Buscar" class="flex"></v-text-field>
            </v-flex>
          </v-toolbar>
          <v-data-table :headers="usersConfig" :items="users" :search="search">
            <template slot="items" slot-scope="user">
              <td>{{ user.item.name }}</td>
              <td>{{ user.item.lastname}}</td>
              <td>{{ user.item.birthdate }}</td>
              <td>{{ user.item.cellphone }}</td>
              <td>
                <v-chip
                  :color="user.item.status ? 'green' : 'red'"
                  text-color="white"
                >{{user.item.status ? 'Activo': 'Inactivo'}}</v-chip>
              </td>
              <td>
                <img :src="user.item.picture" width="25" height="25">
              </td>
              <td>{{ user.item.age }}</td>
              <td>
                <!-- <v-btn small @click="edituser(user.item)"> -->
                <v-icon small color="orange" @click="edituser(user.item)">edit</v-icon>
                <!-- </v-btn> -->
                <!-- <v-btn small @click="removeuser(user.item)"> -->
                <v-icon small color="red" @click="removeuser(user.item)">delete</v-icon>
                <!-- </v-btn>  -->
              </td>
              <!-- <td><v-btn @click="edituser(user.item)"> Edit</v-btn></td> -->
            </template>
            <v-alert
              slot="no-results"
              :value="true"
              color="error"
              icon="warning"
            >Tu busqueda "{{ search }}", no encontro ningun resultado.</v-alert>
          </v-data-table>
        </v-card>
      </v-flex>
    </v-layout>
    <v-layout row>
      <v-dialog
        v-model="dialog"
        fullscreen
        hide-overlay
        transition="dialog-bottom-transition"
        scrollable
      >
        <v-card tile>
          <v-toolbar card dark color="primary">
            <v-btn icon dark @click.native="dialog = false">
              <v-icon>close</v-icon>
            </v-btn>
            <v-toolbar-title
              v-if="userSelected.$key && userSelected.$key.length> 0"
            >Edita un tour</v-toolbar-title>
            <v-toolbar-title v-else>Agrega un tour</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-toolbar-items>
              <v-btn
                dark
                flat
                v-if="userSelected.$key && userSelected.$key.length > 0"
                :disabled="!valid"
                @click="saveUser"
              >Editar</v-btn>
              <v-btn dark flat v-else :disabled="!valid" @click="createUser">Crear</v-btn>
            </v-toolbar-items>
            <!-- <v-menu bottom right offset-y>
              <v-btn slot="activator" dark icon>
                <v-icon>more_vert</v-icon>
              </v-btn>
            </v-menu> -->
          </v-toolbar>
          <v-card-text>
            <v-form v-model="valid">
              <v-container fluid>
                <v-layout row wrap>
                  <v-flex xs6 sm6 md4>
                    <v-text-field
                      v-model="userSelected.name"
                      :rules="nameRules"
                      :counter="50"
                      label="Nombre"
                      required
                      solo
                    ></v-text-field>
                  </v-flex>
                  <v-flex xs6 sm6 md4>
                    <v-text-field
                      v-model="userSelected.role"
                      :counter="50"
                      label="Rol"
                      required
                      solo
                    ></v-text-field>
                  </v-flex>
                  <v-flex xs6 sm6 md4>
                    <v-text-field
                      v-model="userSelected.username"
                      label="Usuario"
                      required
                      solo
                      append-icon="mail"
                    ></v-text-field>
                  </v-flex>
                  <v-flex xs6 sm6 md4>
                    <v-text-field
                      v-model="userSelected.status"
                      label="Status"
                      required
                      solo
                      append-icon="mail"
                    ></v-text-field>
                  </v-flex>
                </v-layout>
              </v-container>
            </v-form>
          </v-card-text>
        </v-card>
      </v-dialog>
    </v-layout>
  </v-container>
</template>
<script>
import firebase from "firebase";
export default {
  data() {
    return {
      imageUrl: "",
      dialog: false,
      search: "",
      valid: false,
      birthdate: new Date().toISOString().substr(0, 10),
      inscriptionDate: new Date().toISOString().substr(0, 10),
      modal: false,
      //   tours: [],
      //   places: [],
      //   files: Object,
      //   fb: firebase.database(),
      users: [],
      userSelected: {},
      nameRules: [
        // v => !!v || "Nombre es requerido",
        // v => v.length <= 50 || "No debe ser mayor a 50 carac [
        // v => !!v || "Incluye es requerido",
        // v => v.length <= 50 || "No debe ser mayor a 50 caracteres"
      ],

      usersConfig: [
        {
          text: "Id",
          value: "_id",
          datatable: true
        },
        {
          text: "Nombre",
          value: "name",
          datatable: true
        },
        {
          text: "Rol",
          value: "role",
          datatable: true
        },
        {
          text: "Usuario",
          value: "username",
          datatable: true
        },
        {
          text: "Estatus",
          value: "status",
          datatable: true
        },
        {
          text: "Accion"
          // value: ""
        }
      ],
      editorOption: {
        // some quill options
      }
    };
  },
  computed: {
  },
  props: {
    source: String
  },
  methods: {
    edituser(user) {
      var vm = this;
      console.log(user);
      vm.userSelected = user;
      vm.dialog = true;
    },
    addUser() {
      var vm = this;
      vm.dialog = true;
      vm.userSelected = {};
    },
    saveUser() {
      var vm = this;
      console.log(vm.userSelected);
      this.axios
        .put("https://crossappback.herokuapp.com/api/user/", vm.userSelected)
        .then(response => {
          console.log(response);
          // vm.users = response.data.users;
        })
        .catch(e => {
          console.log(e);
        });
    },
    createUser() {
      var vm = this;
      console.log(vm.userSelected);
      this.axios
        .post("https://crossappback.herokuapp.com/api/user", vm.userSelected)
        .then(response => {
          console.log(response);
        })
        .catch(e => {
          console.log(e);
        });
    },
    removeuser(user) {
      console.log(user);
      var vm = this;
      vm.userSelected = user;
      vm.$swal({
        title: "�Estas seguro?",
        text: "Si eliminar!",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Si, eliminar!"
      }).then(result => {
        if (result.value) {
        }
      });
    },
    getusers() {
      var vm = this;
      this.axios
        .get("https://crossappback.herokuapp.com/api/users")
        .then(response => {
          console.log(response);
          vm.users = response.data.users;
        })
        .catch(e => {
          console.log(e);
        });
    },
  },
  mounted() {
    var vm = this;
    console.log("this is current quill instance object", this.editor);
    vm.getusers();
  }
};
</script>
<style>
.hide {
  display: none;
}

.size {
  width: 250px;
  height: 250px;
}
</style>

