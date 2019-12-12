import * as helper from "../helpers/helpers.js";
import * as app from "../scripts/app.js";
import { getTrek, edit } from "../models/treksModels.js";

export async function likes(ctx) {
    debugger
    let id = ctx.params.id;
    let currentTrek = await getTrek(id);

    currentTrek.likes++;

    Object.keys(currentTrek).forEach(k => {

      ctx[k] = currentTrek[k];
    });
    console.log(ctx)
    edit(ctx.params.id, currentTrek).then(tr => {

      ctx.redirect("#/");
    });
}