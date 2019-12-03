import * as req from "./requester.js";

const app = Sammy("#rooter", function() {
  this.use("Handlebars", "hbs");

  this.get("/", function(ctx) {
    setHeaderInfo(ctx);

    if (ctx.isAuth) {
      req.get("appdata", "recipes", "Kinvey").then(recipes => {
        ctx.recipes = recipes;
        this.loadPartials(getPartials()).partial("./views/home.hbs");
      });
    } else {
      this.loadPartials(getPartials()).partial("./views/home.hbs");
    }
  });

  this.get("/login", function(ctx) {
    this.loadPartials(getPartials()).partial("./views/auth/login.hbs");
  });

  this.post("/login", function(ctx) {
    const { username, password } = ctx.params;

    if (username && password) {
      req.post("user", "login", { ...ctx.params }, "Basic").then(inf => {
      
        showSuccess('Loging successful')
        showLoading('Loading ......')
        saveAuthInfo(inf);
        ctx.redirect("/");
      });
    }
  });

  this.get("/logout", function(ctx) {
    req.post("user", "_logout", {}, "Kinvey").then(e => {
      showSuccess('Successfull logout!')
debugger
      sessionStorage.clear();
      ctx.redirect("/");
    });
  });

  this.get("/register", function(ctx) {
    this.loadPartials(getPartials()).partial("./views/auth/register.hbs");
  });

  this.post("/register", function(ctx) {
    const {
      firstName,
      lastName,
      username,
      password,
      repeatPassword
    } = ctx.params;
    if (firstName && lastName && username && password === repeatPassword) {
      req.post("user", "", { ...ctx.params }, "Basic").then(inf => {
        debugger;
        saveAuthInfo(inf);
        ctx.redirect("/");
      });
    }
  });

  this.get("/share", function(ctx) {
    this.loadPartials(getPartials()).partial("./views/recipe/share.hbs");
  });

  this.post("/share", function(ctx) {
    const {
      meal,
      ingredients,
      prepMethod,
      description,
      foodImageURL,
      category
    } = ctx.params;

    const categories = {
      "Vegetables and legumes/beans":
        "https://www.eatforhealth.gov.au/sites/default/files/images/the_guidelines/101351132_vegetable_selection_web.jpg",
      Fruits:
        "https://hips.hearstapps.com/hmg-prod.s3.amazonaws.com/images/assortment-of-colorful-ripe-tropical-fruits-top-royalty-free-image-995518546-1564092355.jpg?crop=0.657xw:0.983xh;0.191xw,0&resize=640:*",
      "Grain Food":
        "https://nutritionbymia.com/wp-content/uploads/2-5.15.51-PM.jpg",
      "Milk, cheese, eggs and alternatives":
        "https://www.healthline.com/hlcmsresource/images/AN_images/AN480-Eggs-Dairy-732x549-thumb.jpg",
      "Lean meats and poultry, fish and alternatives":
        "https://i.pinimg.com/originals/2e/87/60/2e8760f0a6964e1910b2891e52cd8c93.jpg"
    };
    if (
      meal &&
      ingredients &&
      prepMethod &&
      description &&
      foodImageURL &&
      category
    ) {
      req
        .post("appdata", "recipes", {
          meal,
          ingredients: ingredients.split(" "),
          prepMethod,
          description,
          foodImageURL,
          category,
          categoryImageURL: categories[category],
          likesCounter: 0
        })
        .then(e => {
          ctx.redirect("/");
        })
        .catch(console.error);
    }
  });

  this.get("/edit/:id", function(ctx) {
    debugger;
    const id = ctx.params.id;
    setHeaderInfo(ctx);

    req.get("appdata", `recipes/${id}`, "Kinvey").then(e => {
      ctx.recipe = e;
      this.loadPartials(getPartials()).partial(
        "../views/recipe/edit-recipe.hbs"
      );
    });
  });
  this.post("/edit/:id", function(ctx) {
    debugger;
    const id = ctx.params.id;
    setHeaderInfo(ctx);
    debugger;
    const {
      meal,
      ingredients,
      prepMethod,
      description,
      foodImageURL,
      category
    } = ctx.params;
    debugger
    req
      .post("appdata", "recipes/" + id, {
        meal,
        ingredients: ingredients.split(" "),
        prepMethod,
        description,
        foodImageURL,
        category
      })
      .then(e => {
        ctx.redirect("/");
      })
      .catch(console.error);
  });

  this.get('/archive/:id', function (ctx) {
    const id = ctx.params.id;
    setHeaderInfo(ctx);
    debugger
    
    req.del('appdata', `recipes/${id}`, 'Kinvey').
    then((e) => {
      ctx.redirect('/')
    }).catch(console.error)
    
  })
  this.get("/recipe/:id", function(ctx) {
    debugger;
    const id = ctx.params.id;
    setHeaderInfo(ctx);

    req.get("appdata", `recipes/${id}`, "Kinvey").then(e => {
      debugger;
      e.isCreator = sessionStorage.getItem("userId") === e._acl.creator;
      ctx.recipe = e;
      this.loadPartials(getPartials()).partial(
        "../views/recipe/recipe-details.hbs"
      );
    });
  });



  function getPartials() {
    return {
      header: "./views/common/header.hbs",
      footer: "./views/common/footer.hbs"
    };
  }

  function showSuccess(message) {
    let successBox = $('#successBox');
    successBox.text(message);
    successBox.fadeIn(6);
    successBox.fadeOut(30000);
  }
  function showLoading(message) {
    let errorBox = $('#loadingBox');
    errorBox.text(message);
    errorBox.fadeIn(6);
    errorBox.fadeOut(300000);
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
  function setHeaderInfo(ctx) {
    ctx.isAuth = sessionStorage.getItem("authtoken") !== null;
    ctx.fullName = sessionStorage.getItem("fullName");
  }

  function saveAuthInfo(ctx) {
    sessionStorage.setItem("authtoken", ctx._kmd.authtoken);
    sessionStorage.setItem("fullName", ctx.firstName + " " + ctx.lastName);
    sessionStorage.setItem("userId", ctx._id);
  }
});
app.run();
