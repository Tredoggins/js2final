<template>
  <v-row class="d-flex">
    <v-col v-if="user!=null" class="align-center justify-center flex-column d-flex">
      <template v-if="coverList.length>0">
        <coverflow :cover-list="coverList" :cover-width="options.coverWidth" :cover-height="options.coverHeight" :cover-space="options.coverSpace" :width="options.width"></coverflow>
        <v-btn rounded color="green">Edit</v-btn>
      </template>
      <br>
      <v-btn color="blue" fab><v-icon>mdi-plus</v-icon></v-btn>
    </v-col>
    <v-col v-else>
      <h2>You Have to Log in to view this page</h2>
    </v-col>
  </v-row>
</template>

<script>
import coverflow from "vue-coverflow"
import {db} from "@/config/config";
export default {
  name: "Build",
  firestore(){
    return {
      coverList: db.collection("users").doc(this.user.uid).collection('decks'),
    }
  },
  props:{
    user:{
      type:Object,
      required:true,
    }
  },
  data () {
    return {
      coverList: [
      ],
      options: {
        coverWidth: 300,
        coverSpace: 5,
        width: 920,
        index: 0,
        coverHeight: 300
      }
    }
  },
  components: {
    coverflow
  }
}
</script>

<style scoped>
  h2{
    color: red;
  }
</style>