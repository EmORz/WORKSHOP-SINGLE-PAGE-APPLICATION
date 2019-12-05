import * as req from "./requester.js";
import * as app from "./app.js";
export function shareRecipe(ctx) {
  app.showLoading("Loading...");
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
        debugger;
        app.showLoading("Loading ...");
        app.showSuccess("Successfull share recipe!");
        ctx.redirect("/");
      })
      .catch(console.error);
  }
}
export function shareGet(ctx) {
  debugger;
  app.setHeaderInfo(ctx);
  app.showLoading("Loading...");
  this.loadPartials({
    header: "./views/common/header.hbs",
    footer: "./views/common/footer.hbs"
  }).then(function() {
    this.partial("./views/recipe/share.hbs");
  });
}

export function editGet(ctx) {
  debugger;
  const id = ctx.params.id;
  app.setHeaderInfo(ctx);

  req.get("appdata", `recipes/${id}`, "Kinvey").then(e => {
    ctx.recipe = e;
    app.showLoading("Loading...");
    this.loadPartials({
      header: "./views/common/header.hbs",
      footer: "./views/common/footer.hbs"
    }).then(function() {
      this.partial("../views/recipe/edit-recipe.hbs");
    });
  });
}

export function editPost(ctx) {
  const id = ctx.params.id;
  app.setHeaderInfo(ctx);
  debugger;
  const {
    meal,
    ingredients,
    prepMethod,
    description,
    foodImageURL,
    category
  } = ctx.params;
  debugger;

  debugger;
  req
    .put(
      "appdata",
      `recipes/${id}`,
      {
        meal,
        ingredients: ingredients.split(" "),
        prepMethod,
        description,
        foodImageURL,
        category
      },
      "Kinvey"
    )
    .then(function() {
      debugger;
      showSuccess("Here");
      ctx.redirect("/");
    })
    .catch(console.error);
}

export function archiveGet(ctx) {
  debugger;
  const id = ctx.params.id;
  app.setHeaderInfo(ctx);
  debugger;

  req
    .del("appdata", `recipes/${id}`, "Kinvey")
    .then(e => {
      ctx.redirect("/");
    })
    .catch(console.error);
}
export function recipeGet(ctx) {
  const id = ctx.params.id;
  app.setHeaderInfo(ctx);

  req.get("appdata", `recipes/${id}`, "Kinvey").then(e => {
    debugger;
    e.isCreator = sessionStorage.getItem("userId") === e._acl.creator;
    ctx.recipe = e;
    this.loadPartials({
      header: "./views/common/header.hbs",
      footer: "./views/common/footer.hbs"
    }).then(function() {

      this.partial("../views/recipe/recipe-details.hbs");
    });
  });
}

export function home(ctx) {
    debugger
  app.setHeaderInfo(ctx);

  if (ctx.isAuth) {
    req.get("appdata", "recipes", "Kinvey").then(recipes => {
      ctx.recipes = recipes;
      this.loadPartials({
        header: "./views/common/header.hbs",
        footer: "./views/common/footer.hbs"
      }).then(function() {
  
        this.partial("../views/home.hbs");
      });
  
    });
  } else {
    this.loadPartials({
        header: "./views/common/header.hbs",
        footer: "./views/common/footer.hbs"
      }).then(function() {
  
        this.partial("../views/home.hbs");
      });
  }
}
