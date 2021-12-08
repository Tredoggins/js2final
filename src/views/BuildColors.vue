<template>
  <v-form>
    <v-checkbox
        v-for="color in colors"
        :key="color.value"
        v-model="selectedColors"
        :label="color.text"
        :value="color"
    ></v-checkbox>
    <p style="color:darkred">{{error}}</p>
    <v-btn @click="submit">Continue</v-btn>
  </v-form>
</template>

<script>
import {db} from "../config/config";

export default {
  name: "BuildColors",
  props:{
    user:{
      type:Object,
      required:true,
    },
    id:{
      type:String,
      required:true,
    },
  },
  data:()=>({
    colors:[{text:"White",value:"W"},{text:"Black",value: "B"},{text:'Blue',value: "U"},{text:'Red',value: "R"},{text:'Green',value: "G"},{text:'Colorless',value:"C"}],
    selectedColors:[],
    initialColors:[],
    error:"",
  }),
  firestore(){
    return {
      initialColors:db.collection('users').doc(this.user.uid).collection("decks").doc(this.id).collection("colors"),
    }
  },
  methods:{
    submit(){
      if(this.selectedColors.length>0) {
        this.error="";
        let promises=[];
        this.initialColors.forEach((myColor)=>{
          promises.push(db.collection("users").doc(this.user.uid).collection("decks").doc(this.id).collection("colors").doc(myColor.text).delete())
        })
        this.selectedColors.forEach((myColor) => {
          promises.push(db.collection('users').doc(this.user.uid).collection("decks").doc(this.id).collection("colors").doc(myColor.text).set(myColor))

        });
        Promise.all(promises)
                .then(() => {
                  this.$router.push("/edit/" + this.id + "/deck");
                })
                .catch((e) => {
                  console.error(e);
                })
      }
      else{
        this.error="You need at least 1 color for your deck"
      }
    }
  },
  watch:{
    initialColors:function (){
      if(this.selectedColors.length===0) {
        this.initialColors.forEach((color) => {
          this.selectedColors.push({text: color.text, value: color.value});
        });
      }
    }
  },
  mounted() {

  }
}
</script>

<style scoped>

</style>