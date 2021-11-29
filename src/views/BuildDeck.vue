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
        <v-select :items="colors" v-if="colors" label="Color" v-model="selectedColor" :disabled="loading" @change="getCards"></v-select>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-text-field append-icon="mdi-magnify" label="search" v-model="search" @click:append="getCards" :disabled="loading"></v-text-field>
        <card-viewer :cards="allCards" :colors="colors" @clickedCard="addCardToDeck" @moreCards="getMoreCards" :startPage="startPage" :loading="loading"></card-viewer>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <card-viewer :cards="deckCards" :colors="colors" @clickedCard="removeCardFromDeck" :show-qty="true"></card-viewer>
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
    colors:[{text:"All",value:"all"},{text:"Black",value: "B"},{text:'Blue',value: "U"}],
    search:"",
    loading:true,
    selectedColor:"",
    nextPageUrl:"",
    startPage:1,
  }),
  firestore(){
    return {
      deckCards: db.collection("users").doc(this.user.uid).collection("decks").doc(this.id).collection("cards"),
      deck:db.collection('users').doc(this.user.uid).collection("decks").doc(this.id),
    }
  },
  methods:{
    getCards(){
      this.loading=true;
      axios
          .get('https://api.scryfall.com/cards/search?q='+(this.search.length>0?this.search:"*")+(this.selectedColor!='all'?'+o%3A"%7B'+this.selectedColor+'%7D"+OR+m%3A%7B'+this.selectedColor.value+'%7D':''))
          .then((r)=>{
            this.startPage=1;
            this.allCards=r.data.data;
            this.loading=false;
            if(r.data.has_more) {
              this.nextPageUrl = r.data.next_page;
            }
            else{
              this.nextPageUrl="";
            }
          })
          .catch((e)=>{
            console.error(e);
          })
    },
    getMoreCards(page){
      if(this.nextPageUrl) {
        this.loading=true;
        axios.get(this.nextPageUrl)
            .then((r) => {
              this.allCards=this.allCards.concat(r.data.data);
              this.loading = false;
              if (r.data.has_more) {
                this.nextPageUrl = r.data.next_page;
              } else {
                this.nextPageUrl = "";
              }
              this.startPage=page;
            })
            .catch((e) => {
              console.error(e);
            })
      }
    },
    addCardToDeck(card){
      db.collection("users").doc(this.user.uid).collection("decks").doc(this.id).collection("cards").doc(card.id).get().then((r)=>{
        if(r.exists){
          db.collection("users").doc(this.user.uid).collection("decks").doc(this.id).collection("cards").doc(card.id).update({qty:firebase.firestore.FieldValue.increment(1)}).then(()=>{}).catch((e)=>{console.error(e)})
        }
        else{
          card.qty=1;
          db.collection("users").doc(this.user.uid).collection("decks").doc(this.id).collection("cards").doc(card.id).set(card).then(()=>{}).catch((e)=>{console.error(e)})
        }
      });

    },
    removeCardFromDeck(card){
      db.collection("users").doc(this.user.uid).collection("decks").doc(this.id).collection("cards").doc(card.id).update({qty:firebase.firestore.FieldValue.increment(-1)}).then(()=>{
        return db.collection("users").doc(this.user.uid).collection("decks").doc(this.id).collection("cards").doc(card.id).get()
      })
      .then((r)=>{
        if(r.data().qty<=0){
          return db.collection("users").doc(this.user.uid).collection("decks").doc(this.id).collection("cards").doc(card.id).delete()
        }
      })
      .catch((e)=>{console.error(e)})

    }
  },
  components:{
    CardViewer,
  },
  created() {
    this.selectedColor=this.colors[0].value;
    this.getCards();
  },
}
</script>

<style scoped>

</style>