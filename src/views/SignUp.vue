<template>
  <v-row>
    <v-col>
      <v-form v-model="valid">
        <v-text-field
            v-model="username"
            :rules="nameRules"
            :counter="10"
            label="Username"
            required
        ></v-text-field>
        <v-text-field
            v-model="email"
            :rules="emailRules"
            label="E-mail"
            required
        ></v-text-field>
        <v-text-field
            v-model="password"
            :rules="passwordRules"
            label="Password"
            type="password"
        >
        </v-text-field>
        <h2>{{this.error}}</h2>
        <v-btn
            :disabled="!valid"
            color="success"
            class="mr-4"
            @click="submit"
        >
          Sign Up
        </v-btn><v-btn @click="$router.push('/')" class="mr-4">Sign In instead</v-btn>
      </v-form>
    </v-col>
  </v-row>
</template>

<script>
import {auth,db} from "@/config/config";
export default {
  name: "SignUp",
  data: () => ({
    valid: false,
    username: '',
    nameRules: [
      v => !!v || 'Username is required',
      v => v.length <= 10 || 'Name must be less than 10 characters',
    ],
    email: '',
    emailRules: [
      v => !!v || 'E-mail is required',
      v => /.+@.+/.test(v) || 'E-mail must be valid',
    ],
    password:'',
    passwordRules:[
      v=>!!v||'Password is required',
      v=>v.length>=8||'Password must be at least 8 characters',
      v=>v.match(/[0-9]/)||'Password must contain a number'
    ],
    error:'',
  }),
  methods:{
    submit(){
      if(this.valid){
        auth.createUserWithEmailAndPassword(this.email,this.password)
            .then((r)=>{
              //console.log(r);
              this.error='';
              return db.collection('users').doc(r.user.uid).set({username:this.username,image:null})

            })
            .then(()=>{
              this.$router.push("/home");
            })
            .catch((e)=>{
              console.error(e);
              this.error=e.message;
            })
      }
    }
  },
}
</script>

<style scoped>
  h2{
    color: red;
  }
</style>