<template>
  <v-app>
    <h1>{{pageName}}</h1>
    <router-link to="/">Home</router-link> |
    <router-link to="/build">Build</router-link>
    <router-view/>
  </v-app>
</template>
<script>
  export default{
    computed:{
      pageName(){
        return this.$route.name
      }
    }
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
