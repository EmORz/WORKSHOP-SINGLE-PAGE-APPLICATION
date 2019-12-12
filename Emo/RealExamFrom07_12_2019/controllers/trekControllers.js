import * as helper from "../helpers/helpers.js";
import * as app from "../scripts/app.js";
import { getTrek, edit, create, del } from "../models/treksModels.js";

//get
export async function getCreate(ctx) {
  app.setHeaderInfo(ctx);
  if (ctx.isAuth) {
    helper.getTemplate("trek/create.hbs", ctx);
  }
}
export async function getDetails(ctx) {
  debugger;
  app.setHeaderInfo(ctx);
  let trek = await getTrek(ctx.params.id);
  trek.isCreator = sessionStorage.getItem("userId") === trek._acl.creator;
  ctx.trek = trek;
  helper.getTemplate("trek/details.hbs", ctx);
}
export async function getEdit(ctx) {
  app.setHeaderInfo(ctx);
  let trek = await getTrek(ctx.params.id);
  trek.isCreator = sessionStorage.getItem("userId") === trek._acl.creator;
  ctx.trek = trek;
  helper.getTemplate("trek/edit.hbs", ctx);
}
export function getDelete(ctx) {
  app.setHeaderInfo(ctx);
  const id = ctx.params.id;
  let check = helper.messages("Do you want to delete  this trek?");
  if (check) {
    del(ctx).then(function() {
      alert(`Trek with ${id} was Deleted!`);
      ctx.redirect("#/");
    });
  }
}
//post
export async function likes(ctx) {
  debugger;
  let id = ctx.params.id;
  let currentTrek = await getTrek(id);

  currentTrek.likes++;

  Object.keys(currentTrek).forEach(k => {
    ctx[k] = currentTrek[k];
  });
  console.log(ctx);
  edit(ctx.params.id, currentTrek).then(tr => {
    ctx.redirect("#/");
  });
}
export function postCreate(ctx) {
  debugger;
  app.setHeaderInfo(ctx);
  create(ctx)
    .then(function(data) {
      ctx.redirect("#/");
    })
    .catch(console.error);
}
export function postEdit(ctx) {
  app.setHeaderInfo(ctx);
  let id = ctx.params.id;
  let data = {
    ...ctx.params
  };
  delete data.id;

  edit(id, data)
    .then(function(inf) {
      alert("This trek was update successfully!");
      ctx.redirect("#/");
    })
    .catch(console.error);
}
