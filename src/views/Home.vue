<template>
  <div class="home">
    this is home page
    <div>
      <router-link to="/home/home1">To home1 !</router-link>
    </div>
    <div>
      <router-link to="/home/home2">To home2 !</router-link>
    </div>
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: "Home",
};
</script>
