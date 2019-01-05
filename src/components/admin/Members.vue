<template>
  <v-container fluid>
    <v-layout row wrap>
      <v-flex xs12 sm12 md12>
        <v-card>
          <v-toolbar flat color="white">
            <v-toolbar-title>
              <h3 class="display-1">Miembros</h3>
            </v-toolbar-title>
            <v-divider class="mx-3" inset vertical></v-divider>
            <div class="subheading">Administra a tus clientes de forma rapida</div>
            <v-spacer></v-spacer>
            <v-btn color="primary" small dark @click="addTour">Agregar</v-btn>
          </v-toolbar>
          <v-toolbar flat color="white">
            <v-flex sm12>
              <v-text-field v-model="search" append-icon="search" label="Buscar" class="flex"></v-text-field>
            </v-flex>
          </v-toolbar>
          <v-data-table :headers="membersConfig" :items="members" :search="search">
            <template slot="items" slot-scope="member">
              <td>{{ member.item.name }}</td>
              <td>{{ member.item.lastname}}</td>
              <td>{{ member.item.birthdate }}</td>
              <td>{{ member.item.cellphone }}</td>
              <td>
                <v-chip
                  :color="member.item.status ? 'green' : 'red'"
                  text-color="white"
                >{{member.item.status ? 'Activo': 'Inactivo'}}</v-chip>
              </td>
              <td>
                <img :src="member.item.picture" width="25" height="25">
              </td>
              <td>{{ member.item.age }}</td>
              <td>
                <!-- <v-btn small @click="editTour(member.item)"> -->
                <v-icon small color="orange" @click="editTour(member.item)">edit</v-icon>
                <!-- </v-btn> -->
                <!-- <v-btn small @click="removeMember(member.item)"> -->
                <v-icon small color="red" @click="removeMember(member.item)">delete</v-icon>
                <!-- </v-btn>  -->
              </td>
              <!-- <td><v-btn @click="editTour(member.item)"> Edit</v-btn></td> -->
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
              v-if="memberSelected.$key && memberSelected.$key.length> 0"
            >Edita un tour</v-toolbar-title>
            <v-toolbar-title v-else>Agrega un tour</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-toolbar-items>
              <v-btn
                dark
                flat
                v-if="memberSelected.$key && memberSelected.$key.length > 0"
                :disabled="!valid"
                @click="saveTour"
              >Editar</v-btn>
              <v-btn dark flat v-else :disabled="!valid" @click="createMember">Crear</v-btn>
            </v-toolbar-items>
            <v-menu bottom right offset-y>
              <v-btn slot="activator" dark icon>
                <v-icon>more_vert</v-icon>
              </v-btn>
            </v-menu>
          </v-toolbar>
          <v-card-text>
            <v-form v-model="valid">
              <v-flex sm3 md3>
                <v-text-field
                  v-model="memberSelected.tour"
                  :rules="nameRules"
                  :counter="50"
                  label="Nombre"
                  required
                ></v-text-field>
              </v-flex>

              <v-text-field
                v-model="memberSelected.description"
                :rules="descripcionRules"
                :counter="50"
                label="Apellido"
                required
              ></v-text-field>
              <v-text-field
                v-model="memberSelected.description_en"
                :rules="incluyeRules"
                :counter="50"
                label="Fecha de nacimiento"
                required
              ></v-text-field>
              <!-- <v-select
                :items="places"
                v-model="memberSelected.placeid"
                item-value="$key"
                item-text="place"
                label="Selecciona lugar"
                single-line
              ></v-select>-->
              <v-radio-group v-model="memberSelected.service">
                <v-radio label="Hotel" value="hotel"></v-radio>
                <v-radio label="Tour" value="tour"></v-radio>
              </v-radio-group>
              <v-flex class="text-md-center">
                <img
                  class="size"
                  :src="memberSelected.image && memberSelected.image.length > 0 ? memberSelected.image : '/static/img/producto_sin_imagen.png'"
                  alt="Foto subida"
                >
              </v-flex>
              <v-flex class="text-md-center">
                <v-btn raised class="primary text-md-center" @click="inputFileClick">Subir imagen</v-btn>
                <input
                  class="hide"
                  type="file"
                  ref="inputFile"
                  accept="image/*"
                  @change="fileChange"
                >
              </v-flex>
              <v-flex>
                <p>Contenido en español</p>
                <quill-editor
                  v-model="memberSelected.content"
                  ref="myQuillEditor"
                  :options="editorOption"
                  @blur="onEditorBlur($event)"
                  @focus="onEditorFocus($event)"
                  @ready="onEditorReady($event)"
                ></quill-editor>
              </v-flex>
              <v-flex>
                <p>Contenido en ingles</p>
                <quill-editor
                  v-model="memberSelected.content_en"
                  ref="myQuillEditor"
                  :options="editorOption"
                  @blur="onEditorBlur($event)"
                  @focus="onEditorFocus($event)"
                  @ready="onEditorReady($event)"
                ></quill-editor>
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
      imageUrl: "",
      dialog: false,
      search: "",
      valid: false,
      //   tours: [],
      //   places: [],
      //   files: Object,
      //   fb: firebase.database(),
      members: [],
      memberSelected: {},
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

      membersConfig: [
        {
          text: "Nombre",
          // align: "left",
          // sortable: false,
          value: "name",
          datatable: true
        },
        {
          text: "Apellido",
          value: "lastname",
          datatable: true
        },
        {
          text: "Fecha de nacimiento",
          value: "birthdate",
          datatable: true
        },
        // {
        //   text: "Genero",
        //   value: "sex"
        // },
        // {
        //   text: "Comentarios",
        //   value: "comments"
        // },
        // {
        //   text: "Correo",
        //   value: "email"
        // },
        {
          text: "Celular",
          value: "cellphone",
          datatable: true
        },
        // {
        //   text: "Tel. casa",
        //   value: "homephone"
        // },
        // {
        //   text: "Direcci�n",
        //   value: "address"
        // },
        {
          text: "Estatus",
          value: "status",
          datatable: true
        },
        {
          text: "Foto",
          value: "picture",
          datatable: true
        },
        // {
        //   text: "Contacto de emergencia",
        //   value: "emergencyContact"
        // },
        // {
        //   text: "Contacto relacion",
        //   value: "relationship"
        // },
        // {
        //   text: "Email de contacto",
        //   value: "contactEmail"
        // },
        // {
        //   text: "Telefono del contacto",
        //   value: "contactCellPhone"
        // },
        // {
        //   text: "Tel. casa del contacto",
        //   value: "contactHomePhone"
        // },
        // {
        //   text: "Informacion medica",
        //   value: "medicalInformation"
        // },
        {
          text: "Edad",
          value: "age",
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
    editor() {
      return this.$refs.myQuillEditor.quill;
    }
  },
  props: {
    source: String
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
      if (filename.lastIndexOf(".") <= 0) {
        return vm.$swal("Porfavor agrega una imagen valida");
      }
      const fileReader = new FileReader();
      fileReader.addEventListener("load", () => {
        vm.imageUrl = fileReader.result;
        console.log(vm.imageUrl);
      });
      fileReader.readAsDataURL(files[0]);
      vm.image = files[0];
      vm.files = files;
    },
    editTour(member) {
      var vm = this;
      console.log(tour);
      vm.memberSelected = member;
      vm.dialog = true;
    },
    addTour() {
      var vm = this;
      vm.dialog = true;
      vm.memberSelected = {};
    },
    saveTour() {
      var vm = this;
      console.log("savetour", vm.memberSelected);
      vm.dialog = false;
    },
    createMember() {
      var vm = this;
    },
    removeMember(member) {
      console.log(member);
      var vm = this;
      vm.memberSelected = member;
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
          console.log("Eliminado");
          // vm.fb
          //   .ref("/")
          //   .child("tours")
          //   .child(tour.$key)
          //   .remove();
          // vm.$swal("Eliminado!", "Tour eliminado.", "success");
          // vm.places.splice(place,1);
        }
      });
    },
    getMembers() {
      var vm = this;
      var config = {
        headers: { "Content-Type": "application/x-www-form-urlencoded" }
        // crossdomain: true
      };
      this.axios
        .get("https://crossappback.herokuapp.com/api/members", config)
        .then(response => {
          console.log(response);
          vm.members = response.data.members;
        })
        .catch(e => {
          console.log(e);
        });
    },
    onEditorBlur(quill) {
      // console.log('editor blur!', quill)
    },
    onEditorFocus(quill) {
      // console.log('editor focus!', quill)
    },
    onEditorReady(quill) {
      // console.log('editor ready!', quill)
    },
    onEditorChange({ quill, html, text }) {
      // console.log('editor change!', quill, html, text)
      var vm = this;
      vm.memberSelected.content = html;
    }
  },
  mounted() {
    var vm = this;
    console.log("this is current quill instance object", this.editor);
    vm.getMembers();
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

