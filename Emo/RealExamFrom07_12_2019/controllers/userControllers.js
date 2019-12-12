import * as helper from "../helpers/helpers.js";
import * as app from "../scripts/app.js";
import { logout, login, register } from "../models/userModels.js";
import { getAll } from "../models/treksModels.js";

//get
export async function getLogin(ctx) {
  // debugger
  helper.getTemplate("auth/login.hbs", ctx);
}
export async function getRegister(ctx) {
  debugger;
  helper.getTemplate("auth/register.hbs", ctx);
}
export function getLogout(ctx) {
  let check = messages("Do you want to logout from system?");
  if (check) {
    logout()
      .then(() => {
        sessionStorage.clear();
        ctx.redirect("#/login");
      })
      .catch(console.error);
  } else {
    ctx.redirect("#/register");
  }
}
export async function getProfile(ctx) {
  app.setHeaderInfo(ctx);
  let infoTreks = await getAll();
  let filterTreks = infoTreks.filter(x => x.organizer === ctx.username);
  ctx.treks = filterTreks;
  ctx.counterTreks = filterTreks.length;
  helper.getTemplate("auth/profile.hbs", ctx);
}
//post
export function postLogin(ctx) {
  debugger;
  login(ctx)
    .then(function(data) {
      saveAuthInfo(data);
      ctx.redirect("#/");
    })
    .catch(console.error);
}

export function postRegister(ctx) {
  debugger;
  register(ctx)
    .then(function(data) {
      saveAuthInfo(data);
      ctx.redirect("#/");
    })
    .catch(console.error);
}

function messages(text) {
  return window.confirm(text);
}

function saveAuthInfo(ctx) {
  sessionStorage.setItem("authtoken", ctx._kmd.authtoken);
  sessionStorage.setItem("username", ctx.username);
  sessionStorage.setItem("userId", ctx._id);
}
