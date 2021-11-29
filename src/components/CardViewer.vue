<template>
  <v-container class="b-1">
    <v-row class="d-flex justify-space-between">
      <v-col cols="1" class="d-flex align-center">
        <v-btn fab @click="previous"><v-icon>mdi-arrow-left</v-icon></v-btn>
      </v-col>
      <v-col cols="10" class="d-flex align-center">
        <v-container v-if="!loading">
          <v-row>
            <v-col v-for="card in currentCards" :key="card.id" cols="2">
              <Card :card="card" :img="(card.image_uris?card.image_uris.large:null)" @clickCard="clickCard" :show-qty="showQty"></Card>
            </v-col>
          </v-row>
        </v-container>
        <v-progress-circular indeterminate v-else></v-progress-circular>
      </v-col>
      <v-col cols="1" class="d-flex align-center">
        <v-btn fab @click="next"><v-icon>mdi-arrow-right</v-icon></v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import Card from "./Card";
export default {
  name: "CardViewer",
  props:{
    colors:{
      type:Array,
    },
    cards:{
      type:Array,
      required:true,
    },
    showQty:{
      type:Boolean
    },
    startPage:{

    },
    loading:{
      type:Boolean,
    },
  },
  data:()=>({
    //currentCards:[],
    page:1,
  }),
  methods:{
    clickCard(card){
      this.$emit('clickedCard',card);
      //this.setCurrentCards();
    },
    next(){
      this.page++;
      if(this.page*6>=this.cards.length){
        this.$emit('moreCards',this.page);
      }
      //this.setCurrentCards();
    },
    previous(){
      if(this.page>1) {
        this.page--;
        //this.setCurrentCards();
      }
    },
  },
  created() {
    this.page=this.startPage;
  },
  computed:{
    currentCards(){
      if(((this.page-1)*6)<(this.cards.length)&&(this.page*6)<=(this.cards.length)) {
        return this.cards.slice((this.page - 1) * 6, this.page * 6);
      }
      else if(((this.page-1)*6)<(this.cards.length)){
        return this.cards.slice(((this.page-1)*6),(this.cards.length));
      }
      else{
        return this.cards.slice(((this.cards.length-6)>=0?(this.cards.length-6):0),(this.cards.length))
      }
    }
  },
  watch:{
    cards:function (){
      this.page=this.startPage;
    }
  },
  components:{
    Card
  }
}
</script>

<style scoped>
 div.row.d-flex{
   height: 150px;
 }
</style>