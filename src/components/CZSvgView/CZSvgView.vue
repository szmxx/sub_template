<template>
  <svg
    :class="svgClass"
    :style="svgColor"
    full="currentColor"
    aria-hidden="true"
  >
    <use :xlink:href="iconName"></use>
  </svg>
</template>

<script>
export default {
  name: "CZSvgView",
  props: {
    iconClass: {
      type: String,
      default: ""
    },
    color: {
      type: String,
      default: ""
    },
    className: {
      type: String,
      default: ""
    }
  },
  data() {
    return {};
  },
  computed: {
    iconName() {
      return "#icon-" + this.iconClass;
    },
    svgClass() {
      return this.className ? `${this.className} CZSvgView` : "CZSvgView";
    },
    svgColor() {
      return this.color ? { color: this.color } : {};
    }
  }
};
</script>
<style scoped lang="scss">
.CZSvgView {
  width: 1em;
  height: 1em;
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
}
</style>
