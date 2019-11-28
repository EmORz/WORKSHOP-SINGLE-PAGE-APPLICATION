export const appKey = 'kid_BJXauRj3S';
export const appSecret = '4f59bed433b84a18a0348d0ff6eca19f';

function saveData(key, value) {
    localStorage.setItem(key+appKey, JSON.stringify(value))
}

export function getData(key) {
    return localStorage.getItem(key+appKey)
}

export function saveUser(data) {
    saveData('userInfo', data)
    saveData('authToken', data._kmd.authtoken)
}

export function removeUser() {
    localStorage.clear();
}