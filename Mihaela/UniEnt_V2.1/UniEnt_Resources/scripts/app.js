import * as req from "./requester.js";

const app = Sammy("body", function() {
  this.use("Handlebars", "hbs");

  this.get("#/", function(ctx) {
    debugger;
    setHeaderInfo(ctx);

    if (ctx.isAuth) {
      req
        .get("appdata", "events", "Kinvey")
        .then(events => {
          ctx.events = events;
          debugger;
          this.loadPartials(getPartials()).partial("../views/home.hbs");
        })
        .catch(console.error);
    } else {
      this.loadPartials(getPartials()).partial("../views/home.hbs");
    }
  });

  this.get("#/register", function(ctx) {
    this.loadPartials(getPartials()).partial("../views/auth/register.hbs");
  });
  this.post("#/register", function(ctx) {
    const { username, password, rePassword } = ctx.params;

    if (username && password === rePassword) {
      debugger;
      req
        .post("user", "", { ...ctx.params }, "Basic")
        .then(e => {
          saveAuthInfo(e);
          ctx.redirect("#/");
        })
        .catch(() => showError("Pass do not matchhhhhhhhhhh"));
    } else {
      alert("Password do not match!");
      showError("Pass do not match");
      debugger;
      throw new Error("Password do not match!");
    }
  });

  this.get("#/login", function(ctx) {
    this.loadPartials(getPartials()).partial("../views/auth/login.hbs");
  });

  this.post("#/login", function(ctx) {
    console.log(ctx);

    const { username, password } = ctx.params;

    if (username && password) {
      req
        .post("user", "login", { ...ctx.params }, "Basic")
        .then(inf => {
          showSuccess("Loging successful");
          showLoading("Loading ......");
          saveAuthInfo(inf);
          ctx.redirect("#/");
        })
        .catch(() => showError("Something is wrong!"));
    }
  });

  this.get("#/logout", function(ctx) {
    req.post("user", "_logout", {}, "Kinvey").then(e => {
      showSuccess("Successfull logout!");

      sessionStorage.clear();
      ctx.redirect("#/");
    });
  });

  this.get("#/create", function(ctx) {
    setHeaderInfo(ctx);
    this.loadPartials(getPartials()).partial("../views/events/create.hbs");
  });

  this.post("#/create", function(ctx) {
    setHeaderInfo(ctx);

    const data = {
      ...ctx.params,
      peopleInterestedIn: 0,
      organizer: ctx.username
    };

    req
      .post("appdata", "events", data, "Kinvey")
      .then(info => {
        document.getElementById("inputEventName").value = "";
        document.getElementById("inpuEventDate").value = "";
        document.getElementById("inputEventDescription").value = "";
        document.getElementById("inputEventImage").value = "";

        showSuccess("Event created successfully");
      })
      .catch(() => showError("Something is wrong!"));
  });

  //
  async function getAllEvents() {
    return await req.get("appdata", "events", "Kinvey");
  }
  async function getEvent(id) {
    let result = await req.get("appdata", `events/${id}`, "Kinvey");
    return result;
  }


  //
  this.get("#/profile", getProfile);

  async function getProfile(ctx) {
    setHeaderInfo(ctx);
    let events = await getAllEvents();
    let myEvents = events.filter(x => x.organizer === ctx.username);
    ctx.events = myEvents;
    ctx.numberOfEvents = myEvents.length;
    this.loadPartials(getPartials()).partial("../views/auth/profile.hbs");

    
  }


  this.get(`#/join/:id`, joinEvent);

  async function joinEvent(ctx) {
    debugger
    const id = ctx.params.id;
    setHeaderInfo(ctx);
    let event = await getEvent(id);
    event.peopleInterestedIn++;
    debugger
    Object.keys(event).forEach( e=>{
      ctx[e] = event[e];
    });
debugger
    req.put('appdata', 'events/'+id, event, 'Kinvey')
    .then((e)=>{
      ctx.redirect('#/');
    })

  }

  this.get("#/details/:id", function(ctx) {
    const id = ctx.params.id;
    setHeaderInfo(ctx);
    req.get("appdata", `events/${id}`, "Kinvey").then(data => {
      data.isOrganizer = sessionStorage.getItem("userId") === data._acl.creator;
      ctx.events = data;
      this.loadPartials(getPartials()).partial(
        "../views/events/eventsDetail.hbs"
      );
    });
  });
  this.get("#/close/:id", function(ctx) {
    const id = ctx.params.id;
    debugger;
    setHeaderInfo(ctx);

    req.del("appdata", `events/${id}`, "Kinvey").then(e => {
      ctx.redirect("#/");
    });
  });

  this.get("#/edit/:id", function(ctx) {
    const id = ctx.params.id;
    setHeaderInfo(ctx);

    req.get("appdata", `events/${id}`, "Kinvey").then(e => {
      ctx.events = e;
      this.loadPartials(getPartials()).partial("../views/events/editEvent.hbs");
    });
  });

  this.post("#/edit/:id", function(ctx) {
    const id = ctx.params.id;
    setHeaderInfo(ctx);

    let data = {
      ...ctx.params
    };
    delete data.id;
    req.put("appdata", `events/${id}`, data, "Kinvey").then(e => {
      showSuccess("Events was updated!");
      ctx.redirect(`#/details/${ctx.params.id}`);
    });
  });

  function getPartials() {
    return {
      header: "./views/common/header.hbs",
      footer: "./views/common/footer.hbs",
      eventsHolder: "./views/events/eventsHolder.hbs",
      error: "./views/events/error.hbs"
    };
  }

  function showSuccess(message) {
    let successBox = $("#successBox");
    successBox.text(message);
    successBox.fadeIn(6);
    successBox.fadeOut(30000);
  }
  function showLoading(message) {
    let errorBox = $("#loadingBox");
    errorBox.text(message);
    errorBox.fadeIn(6);
    errorBox.fadeOut(300000);
  }
  function showError(message) {
    let errorBox = $("#errorBox");
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
    ctx.username = sessionStorage.getItem("username");
  }

  function saveAuthInfo(ctx) {
    sessionStorage.setItem("authtoken", ctx._kmd.authtoken);
    sessionStorage.setItem("username", ctx.username);
    sessionStorage.setItem("userId", ctx._id);
  }
});
app.run("#/");
