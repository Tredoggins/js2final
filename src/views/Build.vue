<template>
  <v-row>
    <v-col v-if="user!=null">
      <coverflow :options="options" :cover-list="options.coverList"></coverflow>
    </v-col>
    <v-col v-else>
      <h2>You Have to Log in to view this page</h2>
    </v-col>
  </v-row>
</template>

<script>
import coverflow from "vue-coverflow"
export default {
  name: "Build",
  props:{
    user:{
      type:Object,
      required:true,
    }
  },
  data () {
    return {
      options: {
        coverList: [
          {cover: 'URL', title: 'Cool Image'},
          {cover: '...', title: 'NaN'},
          {cover: '...', title: 'NaN'},
          {cover: '...', title: 'Batman'}
        ],
        coverWidth: '460px',
        coverSpace: '5px',
        width: 920,
        index: 2,
        coverHeight: '500px'
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