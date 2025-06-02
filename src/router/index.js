import Vue from "vue";
import VueRouter from "vue-router";
import ChatAi from "../views/ChatAi.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: ChatAi,
  },
  
];

const router = new VueRouter({
  routes,
  mode:"history"
});

export default router;
