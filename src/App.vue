<template>
  <div id="app">
    <app-header></app-header>
    <div class="main-body">
      <router-view/>
    </div>
    <!--<app-copy></app-copy>-->
  </div>
</template>

<script>
export default {
  name: 'app'
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
.main-body{
  padding: 20px;
  margin: auto;
  max-width: 1024px;
  min-width: 750px;
  background-color: #ffffff;
}
</style>
