<template>
  <v-card>
    <v-card-media height="200" src="../static/img/banner_contacto.jpg">
      <!-- <v-flex xs12>
          <v-progress-linear
            :active="isUpdating"
            class="ma-0"
            color="green lighten-3"
            height="4"
            indeterminate
          ></v-progress-linear>
        </v-flex> -->
      <v-layout align-center column justify-center pa-3>
        <h3 class="display-1 white--text">Contactanos</h3>
        <span class="red--text text--lighten-1 font-weight-medium">Para armar el mejor paquete, al mejor precio.</span>
      </v-layout>
    </v-card-media>
    <v-form>
      <v-container>
        <v-layout wrap>
          <v-flex xs12 sm12 md12>
            <v-text-field v-model="name" box color="blue-grey lighten-2" label="Nombre *"></v-text-field>
          </v-flex>
          <v-flex xs12 sm12 md12>
            <v-text-field v-model="email" box color="blue-grey lighten-2" label="Email *"></v-text-field>
          </v-flex>
          <v-flex xs12 sm12 md12>
            <v-text-field v-model="phone" box color="blue-grey lighten-2" label="Telefono (opcional)"></v-text-field>
          </v-flex>
          <v-flex>
            <div class="text-xs-right">
              <v-btn round color="primary" dark @click="sendEmail">Enviar</v-btn>
            </div>
          </v-flex>
        </v-layout>
      </v-container>
    </v-form>
    <v-divider></v-divider>
    <!-- <v-dialog v-model="dialog" persistent max-width="290">
      <v-card>
        <v-card-title class="headline">{{ error.code }} </v-card-title>
        <v-card-text> {{ error.message }} </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="red darken-1" flat @click.native="dialog = false">Cerrar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog> -->
  </v-card>
</template>
<script>
  import firebase from "firebase";
  export default {
    data() {
      return {
        name: "",
        email: "",
        phone: "",
        dialog: false,
        error:{}
        // isUpdating:false
      };
    },
    methods: {
      // sendEmail_() {
      //   var vm = this;
      //   this.axios
      //     .post("http://localhost:3000/sendEmail", {
      //       name: vm.name,
      //       email: vm.email,
      //       phone: vm.phone
      //     })
      //     .then(response => {
      //       if (response.error) {
      //         vm.error = response.error;
      //         vm.$swal("Algo ocurrio!",response.message,"error");
      //       }else{
      //         vm.error = response.error;
      //         vm.$swal("Bien hecho!",response.message,"warning");
      //       }
      //     })
      //     .catch(e => {
      //       vm.$swal("Algo ocurrio!","Contacta a un administrador","error");//response.error;
      //     });
      // },
      sendEmail(){
        var vm = this;
        this.axios.post("http://localhost:80/sendmail.php",{email:vm.email}).
          then(response=>{ console.log(response)}).
            catch(e=>{console.log(e)})
      }
    },
    mounted() {
      var vm = this;
    }
  };
</script>