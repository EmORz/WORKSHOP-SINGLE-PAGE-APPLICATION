import * as req from "../scripts/requester.js";

export function logout() {
  return req.post("user", "_logout", {}, "Kinvey");
}

export function login(ctx) {
  debugger;
  const { username, password } = ctx.params;
  if (username && password) {
    return req.post("user", "login", { username, password }, "Basic");
  } else {
    window.alert("Wrong pass or username!");
  }
}

export function register(ctx) {
  const { username, password, rePassword } = ctx.params;

  if (username && password === rePassword) {
    debugger;
   return req.post("user", "", { username, password }, "Basic");
  }
}
