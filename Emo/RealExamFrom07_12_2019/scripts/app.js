import * as req from "./requester.js";
import { getHome } from "../controllers/homeController.js";
import * as user from "../controllers/userControllers.js";
import {
  likes,
  getCreate,
  postCreate,
  getDetails,
  getEdit,
  postEdit,
  getDelete
} from "../controllers/trekControllers.js";

export function setHeaderInfo(ctx) {
  ctx.isAuth = sessionStorage.getItem("authtoken") !== null;
  ctx.username = sessionStorage.getItem("username");
}

const app = Sammy("body", function() {
  this.use("Handlebars", "hbs");
  //get
  this.get("#/", getHome);
  this.get("#/create", getCreate);
  this.get("#/details/:id", getDetails);
  this.get("#/edit/:id", getEdit);
  this.get("#/like/:id", likes);
  this.get("#/login", user.getLogin);
  this.get("#/register", user.getRegister);
  this.get("#/logout", user.getLogout);
  this.get("#/profile", user.getProfile);
  this.get("#/close/:id", getDelete);
  //post
  this.post("#/create", postCreate);
  this.post("#/edit/:id", postEdit);
  this.post("#/login", user.postLogin);
  this.post("#/register", user.postRegister);
});

app.run("#/");
