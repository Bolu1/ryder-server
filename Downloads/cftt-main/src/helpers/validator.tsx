/* eslint-disable max-len */
import { validateAll, extend } from 'indicative/validator';
import { getValue } from 'indicative-utils';

extend('validemail', {
    async: true,
    /**
     * @param {*} args
     * @returns {args} args
     */
    compile(args) {
        return args;
    },

    /**
     * @param {*} data data object
     * @param {*} field fields
     * @returns {Boolean} bool
     */
    async validate(data, field) {
        const fieldValue = getValue(data, field);
        const re =
            /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

        if (!re.test(fieldValue)) {
            return false;
        }

        return true;
    },
});

/**
 * Method to validate form data
 * @param {*} data
 * @param {*} rules
 * @param {*} messages
 * @returns {object} error
 */
export const validateData = async (data: object, rules:any, messages: any, removeAdditional = false) => {
    return validateAll(data, rules, messages, { removeAdditional })
        .then(() => {
            return {};
        })
        .catch((errors) => {
            const formattedErrors: any = {};

            errors.forEach((error: any) => (formattedErrors[error.field] = error.message));

            return formattedErrors;
        });
};
