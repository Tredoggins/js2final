<template>
  <v-container>
    <v-row>
      <v-col>
        <v-btn><v-icon>mdi-chevron-left</v-icon>Change Colors</v-btn>
      </v-col>
      <v-col>
        <v-btn>Finish<v-icon>mdi-chevron-right</v-icon></v-btn>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-text-field append-icon="mdi-magnify" label="search" v-model="search" @click:append="getCards"></v-text-field>
        <card-viewer :cards="allCards" :colors="colors"></card-viewer>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <card-viewer :cards="deckCards" :colors="colors"></card-viewer>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import CardViewer from "@/components/CardViewer";
import {db} from "@/config/config";
import axios from "axios";
export default {
  name: "BuildDeck",
  props:{
    id:{
      type:String,
      required:true,
    },
    user:{
      type:Object,
      required:true,
    }
  },
  data:()=>({
    allCards:[],
    deckCards:[],
    deck:{},
    colors:["black",'blue'],
    search:"",
  }),
  firestore(){
    return {
      deckCards: db.collection("users").doc(this.user.uid).collection("decks").doc(this.id).collection("cards"),
      deck:db.collection('users').doc(this.user.uid).collection("decks").doc(this.id),
    }
  },
  methods:{
    getCards(){
      axios
          .get('https://api.scryfall.com/cards/search?q='+(this.search.length>0?this.search:"*"))
          .then((r)=>{
            this.allCards=r.data.data;
          })
          .catch((e)=>{
            console.error(e);
          })
    }
  },
  components:{
    CardViewer,
  },
  mounted() {
    this.getCards();
  }
}
</script>

<style scoped>

</style>