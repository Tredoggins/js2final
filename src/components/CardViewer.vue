<template>
  <v-container>
    <v-row>
      <v-col>
        <v-select :items="colorItems" v-if="colors" label="Color" :value="colorItems[0]"></v-select>
      </v-col>
    </v-row>
    <v-row>
      <v-col v-for="card in cards" :key="card.id">
        <v-card width="200">
          <v-img :src="card.image_uris.large" v-if="card.image_uris"></v-img>
          <h1 v-else>{{card.name}}</h1>
        </v-card>
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
    }
  },
  data:()=>({
  }),
  computed:{
    colorItems(){
      let newColors=[];
      newColors.push({text:"All",value:'all'})
      this.colors.forEach((val)=>{
        newColors.push({text:val,value:val.toLowerCase()})
      });
      return newColors;
    },
  }
}
</script>

<style scoped>

</style>