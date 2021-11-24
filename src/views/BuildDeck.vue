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
      <v-col v-if="!loading">
        <v-text-field append-icon="mdi-magnify" label="search" v-model="search" @click:append="getCards"></v-text-field>
        <card-viewer :cards="allCards" :colors="colors" @clickedCard="addCardToDeck"></card-viewer>
      </v-col>
      <v-progress-circular indeterminate v-else></v-progress-circular>
    </v-row>
    <v-row>
      <v-col>
        <card-viewer :cards="deckCards" :colors="colors" @clickedCard="removeCardFromDeck"></card-viewer>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import CardViewer from "@/components/CardViewer";
import {db} from "@/config/config";
import axios from "axios";
import firebase from "firebase";
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
    loading:true,
  }),
  firestore(){
    return {
      deckCards: db.collection("users").doc(this.user.uid).collection("decks").doc(this.id).collection("cards"),
      deck:db.collection('users').doc(this.user.uid).collection("decks").doc(this.id),
    }
  },
  methods:{
    getCards(){
      this.loading=true
      axios
          .get('https://api.scryfall.com/cards/search?q='+(this.search.length>0?this.search:"*"))
          .then((r)=>{
            this.allCards=r.data.data;
            this.loading=false;
          })
          .catch((e)=>{
            console.error(e);
          })
    },
    addCardToDeck(card){
      console.log(db.collection("users").doc(this.user.uid).collection("decks").doc(this.id).collection("cards").doc(card.id).get().then((r)=>{if(r.exists){
          db.collection("users").doc(this.user.uid).collection("decks").doc(this.id).collection("cards").doc(card.id).update({qty:firebase.firestore.FieldValue.increment(1)}).then(()=>{}).catch((e)=>{console.error(e)})
        }
        else{
          card.qty=1;
          db.collection("users").doc(this.user.uid).collection("decks").doc(this.id).collection("cards").doc(card.id).set(card).then(()=>{}).catch((e)=>{console.error(e)})
        }
      }));

    },
    removeCardFromDeck(card){
      //console.log(card);
      db.collection("users").doc(this.user.uid).collection("decks").doc(this.id).collection("cards").doc(card.id).delete().then(()=>{}).catch((e)=>{console.error(e)})
    }
  },
  components:{
    CardViewer,
  },
  created() {
    this.getCards();
  }
}
</script>

<style scoped>

</style>