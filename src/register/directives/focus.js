export default {
  inserted: () => {},
  bind: (el, binding) => {
    if (el) {
      el.focus();
    }
    console.log(binding);
  },
  update() {},
  unbind(el, binding) {
    console.log(el, binding);
  }
};
