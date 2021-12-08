<template>
  <v-app>
    <v-container>
      <v-row>
      </v-row>
      <v-row class="d-flex justify-space-between mb-1">
        <v-col v-if="user!=null" class="d-flex">
          <h3>Welcome {{user.username}}!</h3>
        </v-col>
        <v-col class="d-flex flex-column justify-center">
          <h1>{{pageName}}</h1>
        </v-col>
        <v-col class="d-flex justify-end">
          <v-btn @click="signOut" v-if="authUser!=null&&!signedOut">Sign out</v-btn>
        </v-col>
      </v-row>
      <v-row>
        <v-col v-if="authUser!=null">
          <v-btn-toggle mandatory v-model="route" @change="navigate">
            <v-btn :user="authUser">Home</v-btn>
            <v-btn :user="authUser">Build</v-btn>
          </v-btn-toggle>
        </v-col>
      </v-row>
<!--    <router-link to="/">Home</router-link> |
    <router-link to="/build">Build</router-link>-->
      <router-view :user="authUser" v-if="authUser!=null||signedOut"/>
    </v-container>
  </v-app>
</template>
<script>
  import {auth} from "@/config/config";
  import {db} from "./config/config";

  export default{
    data:()=>({
      authUser:null,
      route:0,
      signedOut:false,
      user:null,
    }),
    computed:{
      pageName(){
        return this.$route.name
      }
    },
    methods:{
      navigate(){
        if(this.route==0) {
          (this.authUser ? this.$router.push('/home') : this.$router.push('/'))
        }
        else{
          this.$router.push('/build')
        }
      },
      signOut(){
        auth.signOut()
            .then(()=>{

            })
            .catch((e)=>{
              console.error(e.message);
            })
      },
    },
    created: function() {
      auth.onAuthStateChanged((user)=> {
        if (user) {
          // User is signed in.
          this.authUser=user;
          this.signedOut=false;
          db.collection("users").doc(user.uid).get().then((r)=>{
            this.user=r.data();
          })

        } else {
          // User is signed out.
          this.authUser=null;
          this.signedOut=true;
          this.$router.push('/');
        }
      });
    },
  }
</script>
<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
