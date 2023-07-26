<template>
  <div id="widget">
     <button @click='check()'>Chat Widget</button>
  </div>
</template>

<script>


export default {
  name: 'App',
  methods:{
    check(){
      alert('chat Initialized')
    }
  }
  
}
</script>

<style>
#widget {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
  position:relative;
  top:500px;
  left:540px;
}
</style>
