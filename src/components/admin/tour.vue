<template>
  <v-container>
    <v-layout>
      <v-spacer></v-spacer>
      <v-btn color="primary" dark @click="addTour">Agregar</v-btn>
    </v-layout>
    <v-layout row wrap >
      <v-card >
        <v-card-title>
          <h3>Listado de tours</h3>
          <v-spacer></v-spacer>
          <v-text-field v-model="search" append-icon="search" label="Buscar" single-line hide-details></v-text-field>
        </v-card-title>
        <v-data-table :headers="headers" :items="tours" :search="search">
          <template slot="items" slot-scope="tour">
            <td>{{ tour.item.tour }}</td>
            <td class="text-xs-right">{{ tour.item.description.substr(0,30)}}...</td>
            <!-- <td class="text-xs-right">{{ tour.item.placeid}}</td> -->
            <td class="text-xs-right">{{ tour.item.service }}</td>
            <td class="text-xs-right">{{ tour.item.description_en }}</td>
            <td class="text-xs-right">
              <img :src="tour.item.image" width="50" height="50">
            </td>
            <!-- <td class="text-xs-right">{{ tour.item.$key }}</td> -->
            <td class="text-xs-right">{{ tour.item.place }}</td>
            <td>
              <v-btn small @click="editTour(tour.item)">
                <v-icon small color="orange">edit</v-icon>
              </v-btn>
              <v-btn small @click="removeTour(tour.item)">
                <v-icon small color="red">delete</v-icon>
              </v-btn>
            </td>
            <!-- <td><v-btn @click="editTour(tour.item)"> Edit</v-btn></td> -->
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
            <v-toolbar-title v-if="tourSelected.$key && tourSelected.$key.length> 0">Edita un tour</v-toolbar-title>
            <v-toolbar-title v-else>Agrega un tour</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-toolbar-items>
              <v-btn dark flat v-if="tourSelected.$key && tourSelected.$key.length > 0" :disabled="!valid" @click="saveTour">Editar</v-btn>
              <v-btn dark flat v-else :disabled="!valid" @click="createTour">Crear</v-btn>
            </v-toolbar-items>
            <v-menu bottom right offset-y>
              <v-btn slot="activator" dark icon>
                <v-icon>more_vert</v-icon>
              </v-btn>
            </v-menu>
          </v-toolbar>
          <v-card-text>
            <v-form v-model="valid">
              <v-text-field v-model="tourSelected.tour" :rules="nameRules" :counter="50" label="Nombre del tour" required></v-text-field>
              <v-text-field v-model="tourSelected.description" :rules="descripcionRules" :counter="50" label="Descripcion" required></v-text-field>
              <v-text-field v-model="tourSelected.description_en" :rules="incluyeRules" :counter="50" label="Descripcion en ingles" required></v-text-field>
              <v-select :items="places" v-model="tourSelected.placeid" item-value="$key" item-text="place" label="Selecciona lugar" single-line></v-select>
              <v-radio-group v-model="tourSelected.service">
                <v-radio label="Hotel" value="hotel"></v-radio>
                <v-radio label="Tour" value="tour"></v-radio>
              </v-radio-group>                
              <v-flex class="text-md-center">
                <img class="size" :src="tourSelected.image && tourSelected.image.length > 0 ? tourSelected.image : '/static/img/producto_sin_imagen.png'" alt="Foto subida">
              </v-flex>
              <v-flex class="text-md-center">
                <v-btn raised class="primary text-md-center" @click="inputFileClick">Subir imagen</v-btn>
                <input class="hide" type="file" ref="inputFile" accept="image/*" @change="fileChange">
              </v-flex>
              <v-flex>
                <p>Contenido en español</p>
                <quill-editor v-model="tourSelected.content"
                ref="myQuillEditor"
                :options="editorOption"
                @blur="onEditorBlur($event)"
                @focus="onEditorFocus($event)"
                @ready="onEditorReady($event)">
                </quill-editor>
              </v-flex>
              <v-flex>
                <p>Contenido en ingles</p>
                <quill-editor v-model="tourSelected.content_en"
                ref="myQuillEditor"
                :options="editorOption"
                @blur="onEditorBlur($event)"
                @focus="onEditorFocus($event)"
                @ready="onEditorReady($event)">
                </quill-editor>
              </v-flex>
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
        imageUrl: '',
        dialog: false,
        search: "",
        valid: false,
        tours: [],
        places: [],
        files: Object,
        fb: firebase.database(),
        tourSelected: {},
        nameRules: [
          // v => !!v || "Nombre es requerido",
          // v => v.length <= 50 || "No debe ser mayor a 50 caracteres"
        ],
        descripcionRules: [
          // v => !!v || "Descripcion es requerido",
          // v => v.length <= 50 || "No debe ser mayor a 50 caracteres"
        ],
        incluyeRules: [
          // v => !!v || "Incluye es requerido",
          // v => v.length <= 50 || "No debe ser mayor a 50 caracteres"
        ],

        headers: [{
            text: "Nombre",
            // align: "left",
            // sortable: false,
            value: "tour"
          },
          {
            text: "Descripcion",
            value: "description"
          },
          {
            text: "Servicio",
            value: "service"
          },
          {
            text: "Descripcion Ingles",
            value: "description_en"
          },
          {
            text: "Imagen",
            value: "image"
          },
          {
            text: "Lugar",
            value: "place"
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
      editor() {
        return this.$refs.myQuillEditor.quill
      }
    },
    methods: {
      inputFileClick() {
        var vm = this;
        vm.$refs.inputFile.click();
      },
      fileChange(event) {
        var vm = this;
        const files = event.target.files;
        let filename = files[0].name;
        if (filename.lastIndexOf('.') <= 0) {
          return vm.$swal('Porfavor agrega una imagen valida');
        }
        const fileReader = new FileReader();
        fileReader.addEventListener('load', () => {
          vm.imageUrl = fileReader.result;
          console.log(vm.imageUrl);
        });
        fileReader.readAsDataURL(files[0]);
        vm.image = files[0];
        vm.files = files;
      },
      editTour(tour) {
        var vm = this;
        console.log(tour);
        vm.tourSelected = tour;
        vm.dialog = true;
      },
      addTour() {
        var vm = this;
        vm.dialog = true;
        vm.tourSelected = {};
      },
      saveTour() {
        var vm = this;
        console.log("savetour",vm.tourSelected);
        vm.fb.ref("/").child("tours").child(vm.tourSelected.$key).update({
          description: vm.tourSelected.description,
          description_en: vm.tourSelected.description_en,
          tour: vm.tourSelected.tour,
          placeid: vm.tourSelected.placeid,
          service: vm.tourSelected.service,
          content: vm.tourSelected.content,
          content_en: vm.tourSelected.content_en,

        });
        vm.dialog = false;
      },
      createTour(tour) {
        var vm = this;
        var file = vm.files[0];
        var metadata = {
          contentType: 'image/jpeg',
        };
        if (file !== undefined) {
          var storageRef = firebase.storage().ref();
          var uploadTask = storageRef.child('tours/' + file.name).put(file, metadata);
          uploadTask.on('state_changed', function (snapshot) {
            var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          }, function (error) {
            // Handle unsuccessful uploads
          }, function () {
            // Handle successful uploads on complete
            uploadTask.snapshot.ref.getDownloadURL().then(function (downloadURL) {
              console.log('File available at', downloadURL);
              // var downloadURL = downloadURL;
              vm.fb.ref("/").child("tours").push({
                image: downloadURL,
                description: vm.tourSelected.description,
                tour: vm.tourSelected.tour,
                description_en: vm.tourSelected.description_en,
                placeid: vm.tourSelected.placeid,
                service: vm.tourSelected.service,
                content: vm.tourSelected.content,
                content_en: vm.tourSelected.content_en
              });
              vm.dialog = false;
            });
          });
        } else {
          vm.fb.ref("/").child("tours").push({
            // image: downloadURL,
            description: vm.tourSelected.description,
            tour: vm.tourSelected.tour,
            description_en: vm.tourSelected.description_en,
            placeid: vm.tourSelected.placeid,
            service: vm.tourSelected.service,
            content: vm.tourSelected.content,
            content_en: vm.tourSelected.content_en
          });
          vm.dialog = false;
        }
      },
      removeTour(tour) {
        console.log(tour);
        var vm = this;
        vm.tourSelected = tour;
        vm.$swal({
          title: '�Estas seguro?',
          text: "Si eliminar!",
          type: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Si, eliminar!'
        }).then((result) => {
          if (result.value) {
            console.log("Eliminado");
            vm.fb.ref("/").child("tours").child(tour.$key).remove();
            vm.$swal('Eliminado!', 'Tour eliminado.', 'success');
            // vm.places.splice(place,1);
          }
        })

      },
      changeTourStatus(tour) {
        console.log(tour);
        var vm = this;
        vm.tourSelected = tour;
        vm.dialog = true;
      },
      getPlaces() {
        var vm = this;
        var places_ = [];
        vm.fb.ref("places").on("value", function (places) {
          // var places = places.val();
          places.forEach(function (place) {
            var obj = place.val();
            obj.$key = place.key;
            places_.push(obj);
          });
          vm.places = places_;
          console.log(vm.places);
        });
      },
      getTours() {
        var vm = this;
        vm.fb.ref("tours").orderByChild("service").equalTo("tour").on("value", function (snapshot) {
          var tours = [];
          var num = snapshot.numChildren();
          var cont = 0;
          snapshot.forEach(function (child) {
            if (child.val().image !== "") {
              var obj = child.val();
              if (obj.placeid !== undefined) {
                firebase.database().ref("places").child(obj.placeid).on("value", function (place) {
                  obj.place = place.val().place;
                  obj.$key = child.key;
                  tours.push(obj);
                  cont++;
                  if (num == cont) {
                    vm.tours = tours;
                  }
                });
              } else {
                obj.$key = child.key;
                tours.push(obj);
                cont++;
                if (num == cont) {
                  vm.tours = tours;
                }
              }
            }
          });
        });
      },
      onEditorBlur(quill) {
        console.log('editor blur!', quill)
      },
      onEditorFocus(quill) {
        console.log('editor focus!', quill)
      },
      onEditorReady(quill) {
        console.log('editor ready!', quill)
      },
      onEditorChange({ quill, html, text }) {
        console.log('editor change!', quill, html, text)
        var vm = this;
        vm.tourSelected.content = html;
      }
    },
    mounted() {
      var vm = this;
      console.log("mounted ok");
      console.log('this is current quill instance object', this.editor)
      vm.getPlaces();
      vm.getTours();
      // this.$swal('Heading', 'this is a Heading', 'success');
    },
    props: {
      source: String
    }
  };

</script>
<style>
.hide{
  display: none;
}

.size{
  width: 250px;
  height: 250px;
}
</style>

