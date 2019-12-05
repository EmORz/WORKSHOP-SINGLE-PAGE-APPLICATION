import * as req from "./requester.js";
import * as auth from "./authentication.js"
import { shareRecipe, shareGet, editGet, editPost, archiveGet, recipeGet, home } from "./recipeModule.js";

export function saveAuthInfo(ctx) {
  sessionStorage.setItem("authtoken", ctx._kmd.authtoken);
  sessionStorage.setItem("fullName", ctx.firstName + " " + ctx.lastName);
  sessionStorage.setItem("userId", ctx._id);
}
export function showSuccess(message) {
  let successBox = $('#successBox');
  successBox.text(message);
  successBox.fadeIn(6);
  successBox.fadeOut(30000);
}
export function showLoading(message) {
  let errorBox = $('#loadingBox');
  errorBox.text(message);
  errorBox.fadeIn(6);
  errorBox.fadeOut(300000);
}
export function setHeaderInfo(ctx) {
  ctx.isAuth = sessionStorage.getItem("authtoken") !== null;
  ctx.fullName = sessionStorage.getItem("fullName");
}


const app = Sammy("#rooter", function() {
  this.use("Handlebars", "hbs");

  this.get("/", home);

  this.get("/login", auth.loginAuthGet);
  this.post("/login", auth.loginAuth);

  this.get("/logout", auth.logoutAuth);

  this.get("/register", auth.registerAuthGet);
  this.post("/register", auth.registerAuth);

  this.get("/share", shareGet);

  this.post("/share", shareRecipe);

  this.get("/edit/:id", editGet);
  this.post("/edit/:id", editPost);

  this.get('/archive/:id', archiveGet)

  this.get("/recipe/:id", recipeGet);




  function getPartials() {
    return {
      header: "./views/common/header.hbs",
      footer: "./views/common/footer.hbs"
    };
  }


  function showError(message) {
    let errorBox = $('#errorBox');
    errorBox.text(message);
    errorBox.fadeIn();
    errorBox.fadeOut();
  }
  function displayError(message) {
    const errorBox = document.getElementById("errorBox");
    errorBox.style.display = "block";

    errorBox.textContent = message;
    setTimeout(() => {
      errorBox.style.display = "none";
    }, 2000);
  }



});
app.run();
