<template>
  <v-container>
    <v-row>
      <v-col>
        <v-btn @click="$router.push('/edit/'+id+'/colors')"><v-icon>mdi-chevron-left</v-icon>Change Colors</v-btn>
      </v-col>
      <v-col>
        <v-progress-linear :value="deck.synergy" height="25" rounded><strong>Synergy</strong></v-progress-linear>
        <h4>{{deckLength}} Cards in Deck</h4>
      </v-col>
      <v-col>
        <v-btn @click="finish">Finish<v-icon>mdi-chevron-right</v-icon></v-btn>
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
      <v-col></v-col>
    </v-row>
    <v-row>
      <v-col></v-col>
    </v-row>
    <v-row>
      <v-col>
        <card-viewer :cards="deckCards" :colors="colors" @clickedCard="removeCardFromDeck" :show-qty="true"></card-viewer>
      </v-col>
    </v-row>
    <v-dialog
        v-model="dialog"
        max-width="400"
    >
      <v-card>
        <v-card-title class="text-h5">
          Finish Deck?
        </v-card-title>

        <v-card-text>
          Your deck currently has {{deckLength}} cards, which is less than 40. 40 cards is the recommended deck size.<br>
          Are you sure you want to finish editing this deck?
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn
              color="green darken-1"
              text
              @click="()=>{this.dialog = false;this.$router.push('/build');}"
          >
            Yes
          </v-btn>

          <v-btn
              color="grey darken-1"
              text
              @click="dialog=false"
          >
            No
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
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
    },
  },
  data:()=>({
    allCards:[],
    deckCards:[],
    deck:{},
    colors:[{text:"All",value:"all"}],
    deckColors:[],
    search:"",
    loading:true,
    selectedColor:"",
    nextPageUrl:"",
    startPage:1,
    disableNext:true,
    allColors:[{text:"White",value:"W"},{text:"Black",value: "B"},{text:'Blue',value: "U"},{text:'Red',value: "R"},{text:'Green',value: "G"},{text:'Colorless',value:"C"}],
    dialog:false,
  }),
  firestore(){
    return {
      deckCards: db.collection("users").doc(this.user.uid).collection("decks").doc(this.id).collection("cards"),
      deck:db.collection('users').doc(this.user.uid).collection("decks").doc(this.id),
      deckColors: db.collection("users").doc(this.user.uid).collection("decks").doc(this.id).collection("colors"),
    }
  },
  methods:{
    getCards(){
      this.loading=true;
      axios
          .get('https://api.scryfall.com/cards/search?q='+(this.search.length>0?this.search:"*")+(this.selectedColor!='all'?'+c%3A'+this.selectedColor:'+c%3A'+this.searchColor)+"+and+-c%3A"+this.notSearchColor)
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
      if(this.nextPageUrl.length>0) {
        this.loading=true;
        axios.get(this.nextPageUrl)
            .then((r) => {
              this.allCards=this.allCards.concat(r.data.data);
              this.loading = false;
              if (r.data.has_more) {
                this.nextPageUrl = r.data.next_page;
                this.disableNext=false;
              } else {
                this.nextPageUrl = "";
                this.disableNext=true;
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
          return db.collection("users").doc(this.user.uid).collection("decks").doc(this.id).collection("cards").doc(card.id).set(card)
        }
      })
      .then(()=>{})
      .catch((e)=>{console.error(e)})
      .finally(()=>{
        db.collection('users').doc(this.user.uid).collection("decks").doc(this.id).update({synergy:Math.floor(Math.random()*100)});
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
      .finally(()=>{
        db.collection('users').doc(this.user.uid).collection("decks").doc(this.id).update({synergy:Math.floor(Math.random()*100)});
      })

    },
    finish(){
      if(this.deckLength<40){
        this.dialog=true;
      }
      else{
        this.$router.push("/build");
      }
    },
  },
  computed:{
    searchColor(){
      let colorString="";
      this.deckColors.forEach((color)=>{
        colorString+=color.value.toLowerCase();
      });
      colorString+="c";
      return colorString;
    },
    notSearchColor(){
      let colorString="";
      this.allColors.forEach((color)=>{
        this.deckColors.forEach((c)=>{
            if(color.value!==c.value){
              colorString += color.value.toLowerCase();
            }
        });
      });
      return colorString;
    },
    deckLength(){
      let length=0;
      this.deckCards.forEach((card)=>{
        length+=card.qty;
      })
      return length;
    }
  },
  components:{
    CardViewer,
  },
  created() {
    this.selectedColor=this.colors[0].value;
    this.getCards();
  },
  watch:{
    deckColors:function (){
      this.colors=this.colors.concat(this.deckColors);
    }
  }
}
</script>

<style scoped>

</style>