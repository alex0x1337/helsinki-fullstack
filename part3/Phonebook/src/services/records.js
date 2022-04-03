import axios from 'axios'

const baseUrl = '/api/persons';

const getAll = () => {
    return axios.get(baseUrl).then(response => response.data);
};

const create = (newObject) => {
    return axios.post(baseUrl, newObject).then(response => response.data);
};

const update = (newObject) => {
    return axios.put(`${baseUrl}/${newObject.id}`, newObject).then(response => response.data);
};

const deleteOne = (id) => {
    return axios.delete(`${baseUrl}/${id}`).then(response => response.data);
};

let methods = { getAll: getAll, create: create, update: update, delete: deleteOne };

export default methods
