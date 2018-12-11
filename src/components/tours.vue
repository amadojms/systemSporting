<template>
  <v-container grid-list-md text-xs-center>
    <v-layout row>
      <v-flex sm12>
        <v-text-field id="search_tour" name="in_tour" label="Busca un tour" single-line prepend-icon="search" solo v-model="filter"></v-text-field>
      </v-flex>
    </v-layout>
    <v-layout justify-center>
      <v-flex class="xs12 sm12 pad-15">
        <div class="display-1 font-weight-thin">Los mejores Tours de Cancun y CDMX</div>
      </v-flex>
    </v-layout>
    <!-- <v-container grid-list-md > -->
      <v-layout v-if="spinner">
        <v-flex text-xs-center>
          <div class="justify-center">
            <v-progress-circular indeterminate color="primary"></v-progress-circular>
          </div>
        </v-flex> 
      </v-layout>
      <v-layout row wrap v-else >
        <v-flex v-for="tour in filteredTours" :key="tour.$key" xs12 sm6 md6 lg4>
            <v-card class="xs-0 pointer elevation-0 margin-card" :to="'/detail/'+tour.$key" >
              <v-card-media class="white--text" height="300px" :src="tour.image ? tour.image : ''">
                <v-container fill-height fluid>
                  <v-layout fill-height>
                    <v-flex xs12 align-end flexbox>
                      <span class="headline">{{tour.tour}}</span>
                    </v-flex>
                  </v-layout>
                </v-container>
              </v-card-media>
            </v-card>
        </v-flex>
      </v-layout>
    <!-- </v-container> -->
  </v-container>
</template>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<script>
  import firebase from "firebase";
  export default {
    data() {
      return {
        tours: [],
        db: Object,
        filter: "",
        spinner: false
      };
    },
    computed: {
      filteredTours() {
        var vm = this;
        return vm.tours.filter(item => {
          return item.tour !== undefined ? item.tour.toLowerCase().match(vm.filter.toLowerCase()) :[];
        });
      }
    },
    methods: {
      getTours() {
        var vm = this;
        vm.spinner = true;
        vm.db
          .child("tours")
          .orderByChild("service")
          .equalTo("tour")
          .on("value", function (snapshot) {
            var tours = [];
            var num = snapshot.numChildren();
            console.log(num);
            var cont = 0;
            snapshot.forEach(function (child) {
              if (child.val().image !== "") {
                var obj = child.val();
                if (obj.placeid !== undefined) {
                  vm.db
                    .child("places")
                    .child(obj.placeid)
                    .on("value", function (place) {
                      obj.place = place.val().place;
                      obj.$key = child.key;
                      tours.push(obj);
                      cont++;
                      if (num == cont) {
                        vm.tours = tours;
                        vm.spinner = false;
                      }
                    });
                } else {
                  obj.$key = child.key;
                  tours.push(obj);
                  cont++;
                  if (num == cont) {
                    vm.tours = tours;
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
      vm.db = firebase.database().ref();
      vm.getTours();
    }
  };

</script>

<style>
  .pointer {
    cursor: pointer;
  }

  .pad-15 {
    padding: 15px;
  }

  a {
    text-decoration: none;
  }

  .pad-b{
    padding-bottom: 15px;
  }
  
  .margin-card{
    margin:10px;
  }

</style>
