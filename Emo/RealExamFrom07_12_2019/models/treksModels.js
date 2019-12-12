import * as req from "../scripts/requester.js";
import { setHeaderInfo } from "../scripts/app.js";

export function create(ctx) {
  debugger;
  setHeaderInfo(ctx);
  const { location, dateTime, description, imageURL } = ctx.params;
  if (location && dateTime && description && imageURL) {
    return req.post("appdata", "treks", {
      location,
      description,
      dateTime,
      imageURL,
      organizer: ctx.username,
      likes: 0
    });
  }
}

export async function getAll() {
  debugger;
  let data = await req.get("appdata", "treks", "Kinvey");
  return data;
}
export async function getTrek(id) {
  debugger;
  let data = await req.get("appdata", `treks/${id}`, "Kinvey");
  return data;
}

export function edit(id, data) {
  let t = req.put("appdata", `treks/${id}`, data);
  return t;
}

export function del(ctx) {
  return req.del("appdata", `treks/${ctx.params.id}`, "Kinvey");
}
