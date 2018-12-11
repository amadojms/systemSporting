<template>
  <v-layout id="parallax" justify-center style="padding-top:50px">
    <v-flex xs11 sm11 md11 lg10>
      <v-card class="opacity elevation-7 border_radius_10">
        <v-toolbar dark color="info">
          <template v-if="tour.service == 'hotel'" >
            <v-btn class="elevation-7" color="grey lighten-5" icon dark to="/hotels">
              <v-icon color="blue">keyboard_arrow_left</v-icon>
            </v-btn>
          </template>
          <template v-else>
            <v-btn class="elevation-7" color="grey lighten-5" icon dark to="/">
              <v-icon color="blue">keyboard_arrow_left</v-icon>
            </v-btn>
          </template>
          <v-toolbar-title>{{tour.tour}}</v-toolbar-title>
          <v-spacer></v-spacer>
          <!-- <v-btn color="grey lighten-5" dark small absolute bottom right fab @click="dialog = true"> -->
          <v-btn color="grey lighten-5" icon dark right absolute @click="dialog = true">
            <v-icon color="blue">email</v-icon>
          </v-btn>
          <v-spacer></v-spacer>
        </v-toolbar>
        <v-card-text class="font-weight-light subheading" style="padding-top:30px; position: relative">
          <v-flex v-if="lang == 'es'">{{tour.description}}</v-flex>
          <v-flex v-else>{{tour.description_en}}</v-flex>
          <v-flex v-if="lang == 'es'">
            <div v-html="tour.content"></div>
          </v-flex>
          <v-flex v-else>
            <div v-html="tour.content_en"></div>
          </v-flex>
        </v-card-text>
      </v-card>
    </v-flex>
    <v-dialog v-model="dialog" fullscreen hide-overlay transition="dialog-bottom-transition">
      <v-card >
        <v-toolbar fixed color="white">
          <v-btn flat @click.native="dialog = false">
            <v-icon>close</v-icon>
          </v-btn>
          <v-toolbar-title color="#FFF">Correo</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-toolbar-items>
            <v-btn  flat @click.native="dialog = false">
              Enviar
              <v-icon class="pad-l-10">send</v-icon>
            </v-btn>
          </v-toolbar-items>
        </v-toolbar>
        <v-card-media height="250" :src="tour.image">
          <!-- <v-layout align-center column justify-center pa-3>
            <h3 class="headline">Me interesa, deseo mas informacion del tour/hotel {{tour.tour}}.</h3>
            <span class="grey--text text--lighten-1">Para armar el mejor paquete, al mejor precio.</span>
          </v-layout> -->
        </v-card-media>
        <v-form>
          <v-container>
            <v-layout wrap>
              <v-flex text-xs-center>
                <h3 class="headline">Me interesa, deseo mas informacion de {{tour.tour}}.</h3>
                <h4 class="">Para armar el mejor paquete, al mejor precio.</h4>
              </v-flex>
              <v-flex xs12 sm12 md12>
                <v-text-field v-model="name" box color="blue-grey lighten-2" label="Nombre *"></v-text-field>
              </v-flex>
              <v-flex xs12 sm12 md12>
                <v-text-field v-model="email" box color="blue-grey lighten-2" label="Email *"></v-text-field>
              </v-flex>
              <v-flex xs12 sm12 md12>
                <v-text-field v-model="phone" box color="blue-grey lighten-2" label="Telefono (opcional)"></v-text-field>
              </v-flex>
              <!-- <v-flex>
                <div class="text-xs-right">
                  <v-btn round color="primary" dark @click="sendEmail">Enviar</v-btn>
                </div>
              </v-flex> -->
            </v-layout>
          </v-container>
        </v-form>
        <v-divider></v-divider>
      </v-card>
    </v-dialog>
  </v-layout>
</template>
<script>
  import firebase from "firebase";
  export default {
    computed:{
      lang(){
        return this.$store.state.lang
      }
    },
    data: () => ({
      drawer: null,
      tour: {},
      show: false,
      dialog: false, //dialog
      notifications: false,
      sound: true,
      widgets: false,
      direction: "top", //buton float
      fab: false,
      fling: false,
      hover: false,
      tabs: null,
      top: true,
      right: false,
      bottom: false,
      left: false,
      transition: "slide-y-reverse-transition",
      name: '',
      email: '',
      phone: '',
      image: 'https://cdn.vuetifyjs.com/images/cards/dark-beach.jpg'
    }),
    watch: {
      top(val) {
        this.bottom = !val;
      },
      right(val) {
        this.left = !val;
      },
      bottom(val) {
        this.top = !val;
      },
      left(val) {
        this.right = !val;
      }
    },
    methods: {
      getTour() {
        var vm = this;
        var idtour = this.$route.params.id;
        if (idtour !== "" || idtour !== undefined) {
          firebase
            .database()
            .ref("tours")
            .child(idtour)
            .once("value", function (tour) {
              vm.tour = tour.val();
              console.log(tour.val());
              var image = vm.tour.image;
              document.body.style.backgroundImage = document.getElementById("parallax").style.backgroundImage = "url('" + image + "')";
            });
        } else {
          console.log("sin datos");
        }
      },
      sendEmail() {
        var vm = this;
        this.axios.post("http://localhost:3000/sendEmail", {
            name: vm.name,
            tour: vm.tour.tour,
            email: vm.email,
            phone: vm.phone
          })
          .then(response => {
            console.log(response);
          })
          .catch(e => {
            console.log(e);
            // this.errors.push(e);
          });
      }
    },
    mounted() {
      var vm = this;
      vm.getTour();
    }
  };

</script>

<style>
  .pad-l-10 {
    padding-left: 10px;
  }

  #create .v-speed-dial {
    position: absolute;
  }

  #create .v-btn--floating {
    position: relative;
  }

  .opacity {
    opacity: .9;
  }

  #parallax {
    /* The image used */
    /* Set a specific height */
    height: 100vh;

    /* Create the parallax scrolling effect */
    background-attachment: fixed;
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
  }

  .banner_for_email {
    height: 100vh;
    background-size: cover;
  }

  .border_radius_10 {
    border-radius: 5px;
  }

</style>
