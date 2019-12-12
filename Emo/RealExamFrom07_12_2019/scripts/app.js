import * as req from "./requester.js";
import { getHome } from "../controllers/homeController.js";
import * as user from '../controllers/userControllers.js'
import { likes } from "../controllers/trekControllers.js";

export function setHeaderInfo(ctx) {
  ctx.isAuth = sessionStorage.getItem("authtoken") !== null;
  ctx.username = sessionStorage.getItem("username");
}

const app = Sammy("body", function() {
  this.use("Handlebars", "hbs");

  this.get("#/", getHome);

  //create Trek
  this.get("#/create", function(ctx) {
    debugger;
    setHeaderInfo(ctx);
    if (ctx.isAuth) {
      this.loadPartials(getPartials()).partial("./views/trek/create.hbs");
    }
  });
  this.post("#/create", function(ctx) {
    setHeaderInfo(ctx);
    const { location, dateTime, description, imageURL } = ctx.params;
    if (location && dateTime && description && imageURL) {
      debugger;
      req
        .post("appdata", "treks", {
          location,
          description,
          dateTime,
          imageURL,
          organizer: ctx.username,
          likes: 0
        })
        .then(data => {
          debugger;
          ctx.redirect("#/");
        })
        .catch(console.error);
    }
  });

  this.get("#/details/:id", function(ctx) {
    setHeaderInfo(ctx);
    const id = ctx.params.id;
    req.get("appdata", `treks/${id}`, "Kinvey").then(data => {
      debugger;
      data.isCreator = sessionStorage.getItem("userId") === data._acl.creator;
      ctx.trek = data;
      this.loadPartials(getPartials()).partial("./views/trek/details.hbs");
    });
  });

  this.get("#/edit/:id", function(ctx) {
    setHeaderInfo(ctx);
    const id = ctx.params.id;
    req.get("appdata", `treks/${id}`, "Kinvey").then(data => {
      debugger;
      data.isCreator = sessionStorage.getItem("userId") === data._acl.creator;
      ctx.trek = data;
      this.loadPartials(getPartials()).partial("./views/trek/edit.hbs");
    });
  });
  this.post("#/edit/:id", function(ctx) {
    debugger;
    const id = ctx.params.id;
    setHeaderInfo(ctx);

    req.put("appdata", `treks/${id}`, { ...ctx.params }).then(e => {
      alert("This trek was update successfully!");
      ctx.redirect("#/");
    });
  });

  this.get("#/close/:id", function(ctx) {
    debugger;
    setHeaderInfo(ctx);
    const id = ctx.params.id;
    debugger;
    let check = messages("Do you want to delete  this trek?");

    if (check) {
      req.del("appdata", `treks/${id}`, "Kinvey").then(function() {
        alert(`Trek with ${id} was Deleted!`);
        ctx.redirect("#/");
      });
    } else {
      ctx.redirect("#/");
    }
  });


  this.get("#/like/:id", likes);
  //login user
  this.get("#/login", user.getLogin);
  this.post("#/login", user.postLogin);
  //register user
  this.get("#/register", user.getRegister);
  this.post("#/register", user.postRegister);
  //logout user
  this.get("#/logout",  user.getLogout);
  //user profile
  this.get("#/profile", user.getProfile);

  function messages(text) {
    return window.confirm(text);
  }


  function getPartials() {
    return {
      header: "./views/common/header.hbs",
      footer: "./views/common/footer.hbs"
    };
  }
});

app.run("#/");
