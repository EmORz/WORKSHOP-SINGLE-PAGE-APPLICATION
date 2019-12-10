import * as helper from "../helpers/helpers.js";
import * as app from "../scripts/app.js";
import { getAll } from "../models/treksModels.js";



export async function getHome(ctx) {
  app.setHeaderInfo(ctx);
  if (ctx.isAuth) {
    let treks = await getAll();
    ctx.treks = treks;
    helper.getTemplate("home.hbs", ctx);
  } else {
    helper.getTemplate("home.hbs", ctx);
  }
}
