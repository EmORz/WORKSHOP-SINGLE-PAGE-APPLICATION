import * as req from "../scripts/requester.js";

export async function getAll() {
  debugger;
  let data = await req.get("appdata", "treks", "Kinvey");
  return data;
}
