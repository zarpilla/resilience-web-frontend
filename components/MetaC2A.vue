<script setup lang="ts">
const props = defineProps<{
  section: any;
  c2a: any;
}>();


</script>
<template>
    <div class="cta">
        <MetaLink :page="c2a.page" :text="c2a.text" :target="c2a.target" :href="c2a.href" :css-class="c2a.cssClass" />
    </div>
</template>