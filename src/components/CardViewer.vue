<template>
  <v-container class="b-1">
    <v-row>
      <v-col>
        <v-select :items="colorItems" v-if="colors" label="Color" v-model="selectedColor"></v-select>
      </v-col>
    </v-row>
    <v-row class="d-flex justify-space-between">
      <v-col cols="1" class="d-flex align-center">
        <v-btn fab @click="previous"><v-icon>mdi-arrow-left</v-icon></v-btn>
      </v-col>
      <v-col>
        <v-container>
          <v-row>
            <v-col v-for="card in currentCards" :key="card.id" cols="2">
              <v-card height="200" @click="clickCard(card)">
                <v-img :src="card.image_uris.large" v-if="card.image_uris"></v-img>
                <h1 v-else>{{card.name}}</h1>
              </v-card>
            </v-col>
          </v-row>
        </v-container>

      </v-col>
      <v-col cols="1" class="d-flex align-center">
        <v-btn fab @click="next"><v-icon>mdi-arrow-right</v-icon></v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
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
    getMore:{
      type:Function
    }
  },
  data:()=>({
    selectedColor:{},
    currentCards:[],
    page:1,
  }),
  methods:{
    clickCard(card){
      this.$emit('clickedCard',card);
      this.setCurrentCards();
    },
    next(){

    },
    previous(){

    },
    setCurrentCards(){
      if(((this.page-1)*6)<(this.cards.length)&&(this.page*6)<=(this.cards.length)) {
        this.currentCards = this.cards.slice((this.page - 1) * 6, this.page * 6);
      }
      else if(((this.page-1)*6)<(this.cards.length)){
        this.currentCards=this.cards.slice(((this.page-1)*6),(this.cards.length));
      }
      else{
        this.currentCards=this.cards.slice(((this.cards.length-6)>=0?(this.cards.length-6):0),(this.cards.length))
      }
    }
  },
  computed:{
    colorItems(){
      let newColors=[];
      newColors.push({text:"All",value:'all'})
      this.colors.forEach((val)=>{
        newColors.push({text:val,value:(val.toUpperCase()!=='BLUE'?val.toUpperCase().substr(0,1):'U')})
      });
      return newColors;
    },
  },
  mounted() {
    this.selectedColor=this.colorItems[0];
    this.setCurrentCards();
  },
  watch:{
    cards:function (){
      this.setCurrentCards();
    }
  }
}
</script>

<style scoped>
 div.row.d-flex{
   height: 300px;
 }
</style>