import axios from 'axios';

const REST_API_BASE_URL = 'http://localhost:8080';

export const listProducts = () => axios.get(`${REST_API_BASE_URL}/product/getAllByCompany/1`);

export const saveProduct = (product) => axios.post(`${REST_API_BASE_URL}/product/save`, product);

export const updateProduct = (product) => axios.put(`${REST_API_BASE_URL}/product/update`, product);

export const deleteProduct = (productId) => axios.delete(`${REST_API_BASE_URL}/product/delete/${productId}`);

export const listCategories = () => axios.get(`${REST_API_BASE_URL}/category/getAllByCompany/1`);

