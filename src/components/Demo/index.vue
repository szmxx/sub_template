<template>
  <div class="module">
    <div class="module__left">
      <div
        v-for="(i, index) in componentlist"
        :key="index"
        @click="toggleComponentHandler(i)"
      >
        {{ i }}
      </div>
    </div>
    <div class="module__right">
      <component :is="activeComponent"></component>
    </div>
  </div>
</template>
<script>
import { isFullDemo } from "@/utils/base";
const modules = {};
export default {
  name: "Demo",
  data() {
    return {
      activeComponent: null,
      componentlist: []
    };
  },
  created() {
    this.loadComponent();
  },
  methods: {
    loadComponent() {
      let modulelist = [];
      let files = require.context("./components", false, /\.vue$/);
      files.keys().forEach(key => {
        console.dir(this);
        let componentName = key
          .replace(/^\.\/(.*\/)?/, "")
          .replace(/\.vue$/, "");
        modulelist.push(componentName);
        let componentConfig = files(key);
        modules[componentName] = componentConfig.default || componentConfig;
      });
      if (isFullDemo()) {
        let files = require.context("@/components", false, /\.vue$/);
        files.keys().forEach(key => {
          if (!/[d|D]emo/.test(key)) {
            let componentName = key
              .replace(/^\.\/(.*\/)?/, "")
              .replace(/\.vue$/, "");
            if (componentName.startsWith("Cz")) {
              modulelist.push(componentName);
              let componentConfig = files(key);
              modules[componentName] =
                componentConfig.default || componentConfig;
            }
          }
        });
      }
      this.componentlist = modulelist;
    },
    toggleComponentHandler(name) {
      this.activeComponent = modules[name];
    }
  }
};
</script>
<style lang="scss" scoped>
.module {
  display: flex;
  flex-wrap: nowrap;
  width: 100%;
  height: 100%;
  &__left {
    width: 20%;
    min-width: 4rem;
    border-right: 1px solid #eeeeee;
    div {
    }
  }
  &__right {
    width: 80%;
  }
}
</style>
