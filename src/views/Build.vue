<template>
  <v-row class="d-flex">
    <v-col v-if="user!=null" class="align-center justify-center flex-column d-flex">
      <template v-if="coverList.length>0">
        <coverflow :key="Math.random()*100000" :cover-list="coverList" :cover-width="coverWidth" :cover-height="coverHeight" :cover-space="coverSpace" :width="width" :index="index" @change="(inex)=>{this.index=inex}" :coverFalt="false"></coverflow>
        <v-btn rounded color="green" @click="$router.push('/edit/'+coverList[index].id+'/deck')">Edit</v-btn>
      </template>
      <br>
<!--      <v-progress-circular indeterminate></v-progress-circular>-->

      <v-dialog
          v-model="dialog"
          width="500"
      >
        <template v-slot:activator="{ on, attrs }">
          <v-btn color="blue" fab v-bind="attrs" v-on="on"><v-icon>mdi-plus</v-icon></v-btn>
        </template>

        <v-card>
          <v-card-title class="text-h5 grey lighten-2">
            Create A Deck
          </v-card-title>

          <v-card-text>
            <v-text-field label="Deck Name" v-model="newName"></v-text-field>
            <v-file-input v-model="newImage" accept="image/*" label="Cover Image"></v-file-input>
          </v-card-text>

          <v-divider></v-divider>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
                color="primary"
                text
                @click="createDeck"
            >
              Create Deck
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-col>
    <v-col v-else>
      <h2>You Have to Log in to view this page</h2>
    </v-col>

  </v-row>
</template>

<script>
import coverflow from "vue-coverflow"
import {db,storage} from "@/config/config";
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
      coverWidth: 300,
      coverSpace: 5,
      width: 920,
      coverHeight: 300,
      index: 0,
      dialog:false,
      newName:"",
      newImage:null,
    }
  },
  methods:{
    createDeck(){
      if(this.newName.length>0){
        //create deck
        if(this.newImage!==null) {
          //console.log(this.newImage);
          storage.child(this.newImage.name)
              .put(this.newImage)
              .then((r) => {
                return r.ref.getDownloadURL()
              })
              .then((r)=>{
                //console.log(r);
                return db.collection('users').doc(this.user.uid).collection('decks').add({
                  title: this.newName,
                  cover: r,
                  synergy: 0
                })
              })
              .then((r) => {
                //console.log(r);
                this.dialog = false;
                this.newName = "";
                this.$router.push('/edit/' + r.id + '/colors')
              })
        }
        else {
          db.collection('users').doc(this.user.uid).collection('decks').add({
            title: this.newName,
            cover: 'https://firebasestorage.googleapis.com/v0/b/myjs2-ebd59.appspot.com/o/default-image-620x600.jpeg?alt=media&token=28391c90-4ff6-44c2-8fca-5649645c99ef',
            synergy: 0
          })
              .then((r) => {
                //console.log(r);
                this.dialog = false;
                this.newName = "";
                this.$router.push('/edit/' + r.id + '/colors')
              })
        }
      }
    },
  },
  components: {
    coverflow
  },
  mounted() {
    this.$forceUpdate();
  }
}
</script>

<style scoped>
  h2{
    color: red;
  }
</style>