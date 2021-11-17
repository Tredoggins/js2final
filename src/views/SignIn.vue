<template>
  <v-row>
    <v-col>
      <v-text-field label="Email" type="email" v-model="email"></v-text-field>
      <v-text-field label="Password" type="password" v-model="password"></v-text-field>
      <h2>{{error}}</h2>
      <v-btn @click="logIn" color="success" class="mr-4">Login</v-btn><v-btn @click="$router.push('/signup')" class="mr-4">Sign Up instead</v-btn>
    </v-col>
  </v-row>
</template>

<script>
import {auth} from "@/config/config";

export default {
  name: "SignIn",
  data:()=>({
    email:"",
    password:'',
    error:'',
  }),
  methods:{
    logIn(){
      auth.signInWithEmailAndPassword(this.email,this.password)
          .then(()=>{
            this.$router.push("/home");
          })
          .catch((e)=>{
            this.error=e.message;
          })
    },
  },
}
</script>

<style scoped>

</style>