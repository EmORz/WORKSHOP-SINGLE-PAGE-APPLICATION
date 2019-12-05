import { post } from "./requester.js";

import * as app from "./app.js";

export function loginAuthGet() {
  this.loadPartials({
    header: "./views/common/header.hbs",
    footer: "./views/common/footer.hbs"
  }).then(function() {
    this.partial("./views/auth/login.hbs");
  });
}
export function loginAuth(ctx) {
  debugger;
  const { username, password } = ctx.params;

  if (username && password) {
    post("user", "login", { ...ctx.params }, "Basic").then(inf => {
      app.showSuccess("Loging successful");
      app.showLoading("Loading ......");
      app.saveAuthInfo(inf);
      ctx.redirect("/");
    });
  }
}
export function logoutAuth(ctx) {
  post("user", "_logout", {}, "Kinvey").then(e => {
    app.showSuccess("Successfull logout!");

    sessionStorage.clear();
    ctx.redirect("/");
  });
}
export function registerAuth(ctx) {
  const {
    firstName,
    lastName,
    username,
    password,
    repeatPassword
  } = ctx.params;

  if (firstName && lastName && username && password === repeatPassword) {
    post("user", "", { ...ctx.params }, "Basic").then(inf => {
      debugger;
      app.saveAuthInfo(inf);
      ctx.redirect("#/");
    });
  }
}
export function registerAuthGet() {
    this.loadPartials({
      header: "./views/common/header.hbs",
      footer: "./views/common/footer.hbs"
    }).then(function() {
      this.partial("./views/auth/register.hbs");
    });
  }