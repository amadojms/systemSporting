<template>
  <v-container grid-list-md text-xs-center>
    <v-layout row>
      <v-flex sm12>
        <v-text-field id="search_tour" name="in_tour" label="Busca un hotel" single-line prepend-icon="search" solo v-model="filter"></v-text-field>
      </v-flex>
    </v-layout>
    <v-layout justify-center>
      <v-flex class="xs12 sm12 pad-15">
        <div class="display-1 font-weight-thin">Los mejores Hoteles de Cancun y CDMX</div>
      </v-flex>
      <v-flex text-xs-center>
        <div class="justify-center">
          <v-progress-circular v-if="spinner" indeterminate color="primary"></v-progress-circular>
        </div>
      </v-flex>
      <!-- <v-progress-circular v-if="spinner" indeterminate color="primary"></v-progress-circular> -->
    </v-layout>
    <v-layout row wrap>
      <v-flex v-for="hotel in filteredHotels" :key="hotel.key" xs12 sm6 md6 lg4>
        <v-card class="xs-0 pointer" :to="'/detail/'+hotel.$key">
          <v-card-media class="white--text" height="400px" :src="hotel.image">
            <v-container fill-height fluid>
              <v-layout fill-height>
                <v-flex xs12 align-end flexbox>
                  <span class="headline">{{hotel.tour}}</span>
                </v-flex>
              </v-layout>
            </v-container>
          </v-card-media>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<script>
  import firebase from 'firebase'
  export default {
    data() {
      return {
        hotels: [],
        db: Object,
        filter: "",
        spinner: false
      }
    },
    computed: {
      filteredHotels() {
        var vm = this;
        return vm.hotels.filter((item) => {
          return item.tour !== undefined ? item.tour.toLowerCase().match(vm.filter.toLowerCase()) :[];
          // return item.tour !== undefined ? item.tour.toLowerCase().match(vm.filter.toLowerCase()) : [];
        })
      },
    },
    methods: {
      getHotels() {
        var vm = this;
        vm.spinner = true;
        vm.db.child("tours").orderByChild("service").equalTo("hotel").on("value", function (snapshot) {

          var hotels = [];
          var num = snapshot.numChildren();
          console.log(num);
          var cont = 0;
          snapshot.forEach(function (child) {
            if (child.val().image !== "") {
              var obj = child.val();
              if (obj.placeid !== undefined) {
                vm.db.child("places").child(obj.placeid).on("value", function (place) {

                  // if(place.val() !== null)
                  obj.place = place.val().place;
                  obj.$key = child.key;
                  hotels.push(obj);
                  cont++;
                  if (num == cont) {
                    vm.hotels = hotels;
                    vm.spinner = false;
                  }
                });
              } else {
                obj.$key = child.key;
                hotels.push(obj);
                cont++;
                if (num == cont) {
                  vm.hotels = hotels;
                  vm.spinner = false;
                }
              }
            }

          });
        });
      }
    },
    mounted() {
      var vm = this;
      vm.db = firebase.database().ref()
      vm.getHotels();
    },
    // name: 'Tours'
  }

</script>

<style>
  .pointer {
    cursor: pointer;
  }

  .pad-15 {
    padding: 15px;
  }

</style>
