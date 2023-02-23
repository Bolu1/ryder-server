
/* eslint-disable valid-jsdoc */
/* eslint-disable no-unused-vars */
import axios from '../axios';
/**
 * ApiClient
 */
class ApiClient {
    /**
     * ApiClient GET request helper
     * @param {*} path Server API endpoint
     * @param {*} params Server request params
     * @return {*} promise
     */
    get(path: string, params?: object, headers = {}) {
        return axios.get(path, {
            params,
            headers,
        });
    }
    /**
     * ApiClient POST request helper
     * @param {*} path Server API endpoint
     * @param {*} payload Request payload sent to server
     * @return {*} promise
     */
    post(path: string, payload: object) {
        return axios.post(path, payload);
    }
    /**
     * ApiClient DELETE request helper
     * @param {*} path Server API endpoint
     * @param {*} params Server request params
     * @return {*} promise
     */
    delete(path: string, params?: object) {
        return axios.delete(path, {
            params,
        });
    }
    /**
     * ApiClient PATCH request helper
     * @param {*} path Server API endpoint
     * @param {*} params Server request params
     * @return {*} promise
     */
    patch(path: string, payload?: object) {
        return axios.patch(path, payload);
    }

    /**
     * ApiClient PATCH request helper
     * @param {*} path Server API endpoint
     * @param {*} params Server request params
     * @return {*} promise
     */
     put(path: string, payload?: object) {
        return axios.put(path, payload);
    }
}
export const ApiRequestClient = new ApiClient();