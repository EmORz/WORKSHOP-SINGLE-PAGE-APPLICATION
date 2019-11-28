import { appKey, appSecret, getData } from "./storage.js";

function handleError(res) {
    
    if(res.status === 409) {
        alert('This username is already used!');
    }
    if (!res.ok && res.status !==401) { 
        throw new Error(`Something went wrong! Status: ${res.status}, Status text: ${res.statusText}`);
    }
    if(res.status === 204){
        return res;
    }
    return res;
}

function desirialize(response) {
  
    if(response['url'].includes('logout')){
        return response;
    }
    return response.json();
}

function makeAuthString() {

    let type = 'Basic';
    let auth = btoa(`${appKey}:${appSecret}`);

    if(getData("userInfo") !== null){
        type = 'Kinvey';
        auth = JSON.parse(getData('authToken'));
    }

    return `${type} ${auth}`;
}

function makeHeaders(type, data) {

    let authString = makeAuthString();
    let headers = {
        method: type,
        headers: {
            "Authorization": authString,
            "Content-type": "application/json"
        }
    }

    if(type!=='GET'){
        headers.body = JSON.stringify(data);
    }
    return headers;
}

function makeRequest(type, url, data) {

    const baseUrl = `https://baas.kinvey.com/`;

    let headers = makeHeaders(type, data);

    return fetch(baseUrl+url, headers)
    .then(handleError)
    .then(desirialize);
}

export const get = makeRequest.bind(undefined, 'GET');
export const post = makeRequest.bind(undefined, 'POST');
export const put = makeRequest.bind(undefined, 'PUT');
export const del = makeRequest.bind(undefined, 'DELETE');