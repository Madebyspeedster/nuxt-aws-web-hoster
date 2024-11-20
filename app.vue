<script setup>
import "./styles/main.css";
const nav = [{ label: "Main", to: "/" }];
</script>

<template>
  <NuxtPage dir="routing/pages" :nav="nav" current-rout />
</template>
