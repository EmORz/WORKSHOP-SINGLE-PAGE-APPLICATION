import * as req from "./requester.js";
import { getHome } from "../controllers/homeController.js";

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

  this.get("#/profile", Profile);

  this.get("#/like/:id", Likes);

  async function Likes(ctx) {
 
    let id = ctx.params.id;
    let currentTrek = await getTrek(id);

    currentTrek.likes++;

    Object.keys(currentTrek).forEach(k => {
      debugger;
      ctx[k] = currentTrek[k];
    });
    debugger;
    console.log(ctx)
    edit(ctx.params.id, currentTrek).then(tr => {
     debugger
      ctx.redirect("#/");
    });
 

  }

   function edit(id, data) {
    debugger;
    let t = req.put("appdata", `treks/${id}`, data )
    return t;
  }
  async function getTrek(id) {
    debugger;
    let data = await req.get("appdata", `treks/${id}`, "Kinvey");
    return data;
  }

  async function Profile(ctx) {
    setHeaderInfo(ctx);

    let infoTreks = await getAllTreks();
    let filterTreks = infoTreks.filter(x => x.organizer === ctx.username);
    ctx.treks = filterTreks;
    ctx.counterTreks = filterTreks.length;
    this.loadPartials(getPartials()).partial("./views/auth/profile.hbs");
  }

  async function getAllTreks() {
    const data = await req.get("appdata", "treks", "Kinvey");
    return data;
  }

  //login user
  this.get("#/login", function(ctx) {
    this.loadPartials(getPartials()).partial("./views/auth/login.hbs");
  });
  this.post("#/login", function(ctx) {
    const { username, password } = ctx.params;
    if (username && password) {
      req.post("user", "login", { username, password }, "Basic").then(data => {
        saveAuthInfo(data);
        ctx.redirect("#/");
      });
    }
  });

  //register user
  this.get("#/register", function(ctx) {
    this.loadPartials(getPartials()).partial("./views/auth/register.hbs");
  });
  this.post("#/register", function(ctx) {
    const { username, password, rePassword } = ctx.params;

    if (username && password === rePassword) {
      debugger;
      req
        .post("user", "", { username, password }, "Basic")
        .then(data => {
          saveAuthInfo(data);
          debugger;
          ctx.redirect("#/");
        })
        .catch(console.error);
    }

    debugger;
  });

  //logout user
  this.get("#/logout", function(ctx) {
    let check = messages("Do you want to logout from system?");
    if (check) {
      req
        .post("user", "_logout", {}, "Kinvey")
        .then(() => {
          sessionStorage.clear();
          ctx.redirect("#/");
        })
        .then(console.error);
    } else {
      ctx.redirect("#/profile");
    }
  });

  function messages(text) {
    return window.confirm(text);
  }


  function saveAuthInfo(ctx) {
    sessionStorage.setItem("authtoken", ctx._kmd.authtoken);
    sessionStorage.setItem("username", ctx.username);
    sessionStorage.setItem("userId", ctx._id);
  }
  function getPartials() {
    return {
      header: "./views/common/header.hbs",
      footer: "./views/common/footer.hbs"
    };
  }
});

app.run("#/");
