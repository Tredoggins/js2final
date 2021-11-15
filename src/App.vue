<template>
  <v-app>
    <v-container>
      <v-row>
        <v-col>
          <h1>{{pageName}}</h1>
        </v-col>
      </v-row>
      <v-row>
        <v-col v-if="authUser!=null">
          <v-btn-toggle>
            <v-btn @click="(authUser?$router.push('/home'):$router.push('/'))" :user="authUser">Home</v-btn>
            <v-btn @click="$router.push('/build')" :user="authUser">Build</v-btn>
          </v-btn-toggle>
        </v-col>
      </v-row>
<!--    <router-link to="/">Home</router-link> |
    <router-link to="/build">Build</router-link>-->
      <router-view :user="authUser"/>
    </v-container>
  </v-app>
</template>
<script>
  import {auth} from "@/config/config";

  export default{
    data:()=>({
      authUser:null,
    }),
    computed:{
      pageName(){
        return this.$route.name
      }
    },
    created: function() {
      auth.onAuthStateChanged((user)=> {
        if (user) {
          // User is signed in.
          this.authUser=user;

        } else {
          // User is signed out.
          this.authUser=null;
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
