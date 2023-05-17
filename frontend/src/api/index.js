import ajax from "./ajax";
import axios from 'axios';
import { message } from 'antd'

// export const reqLogin = (username, password) => ajax('/login', {username, password}, 'POST')
export function reqLogin(username, password) {
    // request "/login"
    return ajax('/login', {username, password}, 'POST');
}

export function reqAddUser(user) {
    // add user
    return ajax('/manage/user/add', user, 'POST');
}

export function reqWeather(city) {
    const key = 'd34d8a7178ed492da94143114232804&'; // Here use your key.
    const url = `http://api.weatherapi.com/v1/current.json?key=${key}q=${city}`;
    return new Promise((reslove, reject) => {
        axios.get(url).then((response) => {
            reslove(response);
        }).catch((error) => {
            if (error.message === 'Request failed with status code 400') {
                message.error('Change reqWeather in \'src/api/index.js\' with your own key.');
            } else {
                message.error('Failed to get weather.');
            }
        })
    }) 
}

// Get Category List
export function reqCategorys(parentId) {
    return ajax('/manage/category/list', {parentId}); // {parentId: parentId}
}

// Add Category
export function reqAddCategory(categoryName, parentId) { // Two paremeters
    return ajax('/manage/category/add', {categoryName, parentId}, 'POST');
}

// Update Category Name
export function reqUpdateCategory({categoryId, categoryName}) { // One parameter
    return ajax('/manage/category/update', {categoryId, categoryName}, 'POST');
}

// Get Product List
export function reqProducts(pageNum, pageSize) {
    return ajax('/manage/product/list', {pageNum, pageSize});
}

// Search by productName/productDesc
export function reqSearchProducts(pageNum, PageSize, searchName, searchType) {
    return ajax('/manage/product/search', {
        pageNum, 
        PageSize, 
        [searchType]: searchName,
    })
}

// Get category
export function reqCategory(categoryId) {
    return ajax('/manage/category/info', {categoryId});
}

// Update product status
export function reqUpdateStatus(productId, status) {
    return ajax('/manage/product/updateStatus', {productId, status}, 'POST');
}

// delete image
export function reqDeleteImg(name) {
    return ajax('/manage/img/delete', {name}, 'POST');
}

// Add/Update product
export function reqAddOrUpdateProduct(product) {
    return ajax('/manage/product/' + (product._id ? 'update' : 'add'), product, 'POST');
}

// Get role list
export function reqRoles() {
    return ajax('/manage/role/list');
}

// Add Role
export function reqAddRole(roleName) {
    return ajax('/manage/role/add', {roleName}, 'POST');
}

// Update Role
export function reqUpdateRole(role) {
    return ajax('/manage/role/update', role, 'POST');
}


// Get all user list
export function reqUsers() {
    return ajax('/manage/user/list');
}

// Delete user
export function reqDeleteUser(userId) {
    return ajax('/manage/user/delete', {userId}, 'POST');
}

// Add/Update User
export function reqAddOrUpdateUser(user) {
    return ajax('/manage/user/'+(user._id ? 'update' : 'add'), user, 'POST');
}
