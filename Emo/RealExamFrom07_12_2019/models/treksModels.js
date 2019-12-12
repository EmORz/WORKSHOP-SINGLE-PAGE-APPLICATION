import * as req from "../scripts/requester.js";

export async function getAll() {
  debugger;
  let data = await req.get("appdata", "treks", "Kinvey");
  return data;
}
export async function getTrek(id) {
  let data = await req.get("appdata", `treks/${id}`, "Kinvey");
  return data;
}

export function edit(id, data) {
 
  let t = req.put("appdata", `treks/${id}`, data )
  return t;
}
