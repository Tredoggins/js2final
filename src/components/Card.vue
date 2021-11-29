<template>
  <v-tooltip max-width="300" top>
    <template v-slot:activator="{ on, attrs }">
      <v-card @click="clickCard(card)" v-bind="attrs" v-on="on">
        <v-img :src="img" v-if="img"></v-img>
        <h4 v-else>{{card.name}}</h4>
        <h4 v-if="showQty">{{card.qty}}</h4>
      </v-card>
    </template>
    <v-card width="200">
      <v-img :src="img" v-if="img"></v-img>
      <h1 v-else>{{card.name}}</h1>
    </v-card>
  </v-tooltip>
</template>

<script>
export default {
  name: "Card",
  props:{
    card:{
      type:Object,
      required:true,
    },
    img:{
      type:String,
    },
    showQty:{
      type:Boolean
    }
  },
  methods:{
    clickCard(card){
      this.$emit("clickCard",card);
    }
  }
}
</script>

<style scoped>

</style>