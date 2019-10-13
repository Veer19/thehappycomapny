<template>
  <div class="button">{{text}}</div>
</template>

<script>
export default {
  name: 'Button',
  props: {
    text:String
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.button{
  padding: 20px 30px;
  background: #03223D;
  color: white;
  font-size: 120%;
  border-radius: 3px;
  border: none;
}

</style>
