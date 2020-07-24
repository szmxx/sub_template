import Vue from "vue";
import axios from "axios";

function register() {
  Vue.prototype.$http = axios;
  Vue.prototype.$eventbus = new Vue();
}
register();
