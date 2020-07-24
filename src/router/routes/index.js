import demo from "./demo";
import Home from "@/views/Home";
import { isDev } from "@/utils/base";
const routes = [
  {
    name: "Base",
    path: "/",
    redirect: {
      name: "Home"
    }
  },
  {
    name: "Home",
    path: "/home",
    meta: {},
    component: Home
  },
  {
    name: "Error",
    path: "/404",
    component: () =>
      import(/* webpackChunkName:'ErrorPage' */ "@/views/ErrorPage")
  },
  {
    path: "*",
    redirect: "/404"
  }
  // todo:add subsystem route
];
if (isDev()) {
  if (Array.isArray(demo)) {
    routes.push(...demo);
  } else {
    routes.push(demo);
  }
}
export default routes;
