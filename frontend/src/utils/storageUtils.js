/*
    Save and manage local data
*/
import store from 'store'

const USER_KEY = 'user_key';

const storage = {
    // Save user
    saveUser(user) {
        // localStorage.setItem(USER_KEY, JSON.stringify(user));
        store.set(USER_KEY, user);
    },

    // Load user
    getUser() {
        // return JSON.parse(localStorage.getItem(USER_KEY) || '{}')
        return store.get(USER_KEY) || {};
    },

    // Delete user
    removeUser() {
        // localStorage.removeItem(USER_KEY)
        store.remove(USER_KEY);
    }
}

export default storage;