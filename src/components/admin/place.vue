<template>
  <v-container>
    <v-layout>
      <v-spacer></v-spacer>
      <v-btn color="primary" dark @click="addPlace">Agregar</v-btn>
    </v-layout>
    <v-layout justify-center>
      <v-card>
        <v-card-title>
          <h3>Listado de lugares</h3>
          <v-spacer></v-spacer>
          <v-text-field v-model="search" append-icon="search" label="Buscar" single-line hide-details></v-text-field>
        </v-card-title>
        <v-data-table :headers="headers" :items="places" :search="search">
          <template slot="items" slot-scope="place">
            <td>{{ place.item.place }}</td>
            <td>
              <v-btn small @click="editPlace(place.item)">
                <v-icon small color="orange">edit</v-icon>
              </v-btn>
              <v-btn small @click="removePlace(place.item)">
                <v-icon small color="red">delete</v-icon>
              </v-btn>
            </td>
          </template>
          <v-alert slot="no-results" :value="true" color="error" icon="warning">
            Tu busqueda "{{ search }}", no encontro ningun resultado.
          </v-alert>
        </v-data-table>
      </v-card>
    </v-layout>

    <v-layout row>
      <v-dialog v-model="dialog" fullscreen hide-overlay transition="dialog-bottom-transition" scrollable>
        <v-card tile>
          <v-toolbar card dark color="primary">
            <v-btn icon dark @click.native="dialog = false">
              <v-icon>close</v-icon>
            </v-btn>
            <v-toolbar-title v-if="placeSelected.$key">Edita un lugar</v-toolbar-title>
            <v-toolbar-title v-else>Agrega un lugar</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-toolbar-items>
              <v-btn dark flat v-if="placeSelected.$key" :disabled="!valid" @click="savePlace">Editar</v-btn>
              <v-btn dark flat v-else :disabled="!valid" @click="createPlace">Crear</v-btn>
            </v-toolbar-items>
            <v-menu bottom right offset-y>
              <v-btn slot="activator" dark icon>
                <v-icon>more_vert</v-icon>
              </v-btn>
            </v-menu>
          </v-toolbar>
          <v-card-text>
            <v-form v-model="valid">
              <v-text-field v-model="placeSelected.place" :rules="nameRules" :counter="50" label="Nombre del place" required></v-text-field>
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
        dialog: false,
        search: "",
        valid: false,
        places: [],
        fb: firebase.database(),
        placeSelected: {
          place: ""
        },
        nameRules: [
          // v => !!v || "Nombre es requerido",
          // v => v.length <= 50 || "No debe ser mayor a 50 caracteres"
        ],
        headers: [{
          text: "Lugar",
          value: "place"
        }, ]
      };
    },
    methods: {
      editPlace(place) {
        var vm = this;
        vm.placeSelected = place;
        vm.dialog = true;
      },
      addPlace() {
        var vm = this;
        vm.dialog = true;
        vm.placeSelected = {};
      },
      savePlace(place) {
        console.log(place);
        var vm = this;
        vm.fb.ref("/").child("places").child(vm.placeSelected.$key).update({
          place: vm.tourSelected.place
        });
        vm.dialog = false;
      },
      createPlace(place) {
        var vm = this;
        vm.dialog = true;
        vm.fb.ref("/").child("places").push({
          place: vm.placeSelected.place
        });
        vm.dialog = false;
      },
      removePlace(place) {
        var vm = this;
        vm.tourSelected = place;
        vm.$swal({
          title: '¿Estas seguro?',
          text: "Si eliminar!",
          type: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Si, eliminar!'
        }).then((result) => {
          if (result.value) {
            console.log("Eliminado");
            vm.fb.ref("places").child(place.$key).remove();
            vm.$swal('Eliminado!', 'Lugar eliminado.', 'success');
            // vm.places.splice(place,1);
          }
        })
      },
      getPlaces() {
        var vm = this;

        vm.fb.ref("/").child("places").on("value", function (places) {
          var places_ = [];
          places.forEach(function (place) {
            var obj = place.val();
            obj.$key = place.key;
            places_.push(obj);
          });
          vm.places = places_;
        });

      }
    },
    mounted() {
      var vm = this;
      vm.getPlaces();
    },
    props: {
      source: String
    }
  };

</script>
