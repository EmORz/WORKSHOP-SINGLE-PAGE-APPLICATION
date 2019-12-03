import * as req from "./requester.js";

const app = Sammy("#rooter", function() {
  this.use("Handlebars", "hbs");

  this.get("/", function(ctx) {
    setHeaderInfo(ctx);
    debugger

    if(ctx.isAuth){
        req.get('appdata', 'recipes', 'Kinvey')
        .then((info) => {
    
            ctx.recipes = info;
            this.loadPartials(getPartials()).partial("./view/home.hbs");    
        })
    }else{
        this.loadPartials(getPartials()).partial("./view/home.hbs");
    }

  });

  this.get('/edit/:id', function (ctx) {
      const id = ctx.params.id;
      setHeaderInfo(ctx)
debugger
      req.get('appdata', `recipes/${id}`, 'Kinvey')
      .then((info) => {
          debugger
          ctx.recipe = info;
          this.loadPartials(getPartials())
          .partial('../view/recipe/edit-recipe.hbs')

      })
  });
  this.post('/edit/:id', function (ctx) {
      debugger
      const id = ctx.params.id;
      setHeaderInfo(ctx)
    const {meal, ingredients, prepMethod, description, foodImageURL, category } = ctx.params;
      req.put('appdata', 'recipes/'+id, {meal, ingredients, prepMethod, description, foodImageURL, category })
      .then((data) =>{
         
        ctx.redirect('/');
    }).catch(console.error);
  })
  this.get('/recipe/:id', function (ctx) {

      setHeaderInfo(ctx)
      const id = ctx.params.id;
debugger
      req.get('appdata', `recipes/${id}`, 'Kinvey')
      .then((data) =>{

        data.isCreator = sessionStorage.getItem('userId') === data._acl.creator;
        ctx.recipe = data;
        this.loadPartials(getPartials()).partial('../view/recipe/recipe-details.hbs');
      })
  })

  this.get('/share', function () {
    this.loadPartials(getPartials()).partial("./view/recipe/share.hbs");      
  })

  this.post('/share', function (ctx) {

    const categories = {

        "Vegetables and legumes/beans":"https://www.eatforhealth.gov.au/sites/default/files/images/the_guidelines/101351132_vegetable_selection_web.jpg",
        "Fruits": "https://hips.hearstapps.com/hmg-prod.s3.amazonaws.com/images/assortment-of-colorful-ripe-tropical-fruits-top-royalty-free-image-995518546-1564092355.jpg?crop=0.657xw:0.983xh;0.191xw,0&resize=640:*",
        "Grain Food":"https://nutritionbymia.com/wp-content/uploads/2-5.15.51-PM.jpg",
        "Milk, cheese, eggs and alternatives": "https://www.healthline.com/hlcmsresource/images/AN_images/AN480-Eggs-Dairy-732x549-thumb.jpg",
        "Lean meats and poultry, fish and alternatives":"https://i.pinimg.com/originals/2e/87/60/2e8760f0a6964e1910b2891e52cd8c93.jpg"

    };   
    const {meal, ingredients, prepMethod, description, foodImageURL, category } = ctx.params;

    if(meal && ingredients && prepMethod && description && foodImageURL && category){

        req.post('appdata', 'recipes', {
 
            meal,
            ingredients: ingredients.split(' '),
            prepMethod,
            description,
            foodImageURL,
            category,
            likesCounter: 0,
            categoryImageURL: categories[category]
        }).then((data) =>{
         
            ctx.redirect('/');
        }).catch(console.error);
    }
 
  })
  this.get("/register", function(ctx) {

    
    this.loadPartials(getPartials()).partial("./view/auth/register.hbs");

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
      console.log(firstName);
      req
        .post("user", "", { firstName, lastName, username, password }, "Basic")
        .then(data => {
          debugger;
          saveAuthInfo(data);
          ctx.redirect("/");
          console.log(data);
        })
        .catch(console.error);
    }
  });

  this.get("/login", function(ctx) {
    this.loadPartials(getPartials()).partial("./view/auth/login.hbs");
  });

  this.post("/login", function(ctx) {
    const { username, password } = ctx.params;
    if (username && password) {
      req.post("user", "login", { username, password }, "Basic").then(data => {
        saveAuthInfo(data);
        ctx.redirect("/");
      });
    }
  });

  this.get("/logout", function(ctx) {
    req.post("user", "_logout", {}, "Kinvey").then(() => {
      sessionStorage.clear();
      ctx.redirect("/");
    }).then(() => displayError('Logout succsess'));
  });

  function displayError(message) {
    const errorBox = document.getElementById('errorBox');
    errorBox.style.display ='block';

    errorBox.textContent = message;
    setTimeout(()=>{
        errorBox.style.display = 'none';
    }, 2000)
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
  function getPartials() {
    return {
      header: "./view/common/header.hbs",
      footer: "./view/common/footer.hbs"
    };
  }
});
app.run();
