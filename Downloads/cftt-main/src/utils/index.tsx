import moment from 'moment';
import React from 'react';

// /**
//  * Util to convert a string to a slug format
//  * @param {string} text The string to format
//  * @returns {string} The resulting string
//  */
// export const slugify = text =>
//     text
//         .toString()
//         .toLowerCase()
//         .replace(/\s+/g, '_') // Replace spaces with _
//         .replace(/\-+/g, '_') // Replace all - with _
//         .replace(/[^\w\-]+/g, '') // Remove all non-word chars
//         .replace(/\_\_+/g, '_') // Replace multiple _ with single _
//         .replace(/^_+/, '') // Trim _ from start of text
//         .replace(/_+$/, ''); // Trim _ from end of text

/**
 * Checks if an array is empty
 * @param {Array} arr Array to be tested
 * @returns {Boolean} Boolean value
 */
export const isNotEmptyArray = (arr: any) => Array.isArray(arr) && arr.length > 0;

// /**
//  * Delete an array of keys from a given object
//  * @param {Object} targetObj Object to remove propeties from
//  * @param {Array} props Array of object properties to be deleted
//  * @returns {Object} A copy of the orginal object excluding the specified properties
//  */
// export const omit = (targetObj, props) => {
//     // Clone the targetObj to avoid mutating the original data
//     const obj = Object.assign({}, targetObj);

//     if (!Array.isArray(props)) {
//         return;
//     }

//     props.forEach(prop => {
//         obj.hasOwnProperty(prop) && delete obj[prop];
//     });

//     return obj;
// };

export const getUrlParams = (url = window.location.href) => {
    const params = {};
    // @ts-ignore
    url.replace(/[?&]+([^=&]+)=([^&]*)/gi, function (m, key, value) {
        // @ts-ignore
        params[key] = value;
    });
    return params;
};

/**
 * Checks if an object has no set properties
 * @param {*} obj The object to test
 * @returns {*} boolean
 */
export const isObjectEmpty = (obj = {}) =>
    !obj || Object.keys(obj).length === 0;


// /**
//  * Ensure that a given string matches the character count and ellipsized at that point
//  * @param {String} text Target text
//  * @param {Number} numChars Number of characters needed
//  * @returns {String} Truncated text
//  */
export const truncateMultilineText = (text:string, numChars:number) => {
    if (!text) return '';

    // Because '...' will be appended to long strings,
    // this ensures that the entire character count is as specified
    const maxStringLength = numChars - 3;

    return maxStringLength > text.length
        ? text
        : `${text.trim().substring(0, maxStringLength)}...`;
};

/**
 * Function that does nothing:
 * Useful as a default value for an optional Component prop
 * that's of type - function
 * Or for stubbing function calls in Tests and Storybook Docs
 * @returns {*} undefined
 */
export const noOp = () => { };

// /**
//  * Method to extract error message from error response object
//  * @returns {*} The error messgae
//  */
export const extractErrorMessage = (err: any): string => {
    
    const errResponse = err.response || err.toString();
    console.log(err.toString());
    const errorMessage =
    errResponse === null ? 'Something went Wrong. Please try again' : 
        errResponse && errResponse.data && errResponse.data.message
            ? errResponse.data.message
            :  err.toString();

    return errorMessage;
};
// /**
//  * 
//  */
export const scrollTop = () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth',
    });
};

export const scrollDown = () => {
    window.scrollTo({
        //bottom:0,
        behavior: 'smooth',
    });
};

export const parseTime = (time = '1:00 am') => {
    var startTime = new Date();
    var parts = time.match(/(\d+):(\d+) (am|pm)/);
    if (parts) {
        var hours = parseInt(parts[1]),
            minutes = parseInt(parts[2]),
            tt = parts[3];
        if (tt === 'pm' && hours < 12) hours += 12;
        startTime.setHours(hours, minutes, 0, 0);
    }
    return startTime;
};

export const formatDate = (date: Date) => {
    if (!date) return '';
    const d = new Date(date);
    
    const newDate = d.getFullYear() + '-' + ('0' + (d.getMonth() + 1)).slice(-2) + '-' + ('0' + d.getDate()).slice(-2);
    return newDate;
};
export const formatDate2 = (date: Date) => {
    if (!date) return '';
    return moment(date).format('DD-MM-YYYY');
};

export const formatInitialDateValue = (data: Date) => {
    return moment(data).fromNow();
}

export const getMomentAgo = (data: Date) => {
 
    return moment(data).fromNow();
}

export const capiitalizeFirstLetter = (string = '') => {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

export const capiitalizeFirstLetter2 = (string = '') => {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}
export const changeStringToLowerCase = (string = '') => {
    return  string.toLowerCase();
}

// export const extractFirstLetter = (string = '') => {
//     if(string){
//          return string.charAt(0).toUpperCase();
//      }

//      return string;
   
// }

// export const trimString = (string) => {
//     if(string.length > 45){
//         string = string.substring(0, 35);
//         return string + ' ...';
//     }
    
//     return string;
// }
export const changeOptionsToBool = (value: string):any => {
    const obj:any = {
        'false': 'false',
        'true': 'true',
        'active': 'true',
        'non-active': 'true',
        '': 'null',
        'null': 'null',
    }
    return obj[value];
};

export const processAlertError =(message: string) : object => {
    return {type: 'alert-danger', text: message};
};
export const processAlertSuccess =(message: string) : object => {
    return {type: 'alert-success', text: message};
};
export const processAlertInfo =(message: string) : object => {
    return {type: 'alert-primary', text: message};
};

export const validateImage = (file: any) : boolean=> {
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/x-icon'];
    if (validTypes.indexOf(file.type) === -1) {
        return false;
    }

    return true;
}
export const replaceUnderScore = (str = '') => {
    return str.split('_').join(' ');
};

export const getDateFromWeek = (w:any,y:any) => {
    
    var simple = new Date(y, 0, 1 + (w - 1) * 7);
    var dow = simple.getDay();
    var ISOweekStart = simple;
    if (dow <= 4)
        ISOweekStart.setDate(simple.getDate() - simple.getDay() + 1);
    else
        ISOweekStart.setDate(simple.getDate() + 8 - simple.getDay());
 
    return ISOweekStart;
    
};

export const splitBiblePassage = (biblePassageStr: String, version= 'niv') => {
    let str: Array<String>|String = biblePassageStr;
    str = str.split(':');
    let verse = str[1];
    let book = str[0].split(' ');
    let getBook:any = [...book];
    getBook.pop();
    let changeIndex = 0;
    for (let index = 0; index < getBook.length; index++) {
        let element = getBook[index];
        if((/[a-zA-Z]/).test(element)){
            changeIndex = index;
        };
    };
    getBook[changeIndex] = capiitalizeFirstLetter2(getBook[changeIndex]);
    let checkmultipleVerse = verse.split('');
        return {
            book: getBook.join(' ').trim(),
            chapter: book[book.length - 1],
            verse: verse,
            version,
            multipleVerses: !checkmultipleVerse.includes("-")? false: true,
        };
};

export const getScripture = (scriptureData:any) => {
    const data = scriptureData?.refrence ? scriptureData?.refrence : '';
    return data;
};

export const getSupportingVerses = (supportingverseData:any) => {
    const confirmDataValidity = isNotEmptyArray(supportingverseData);
    if(confirmDataValidity){
        const returnArr = [];
        for (let index = 0; index < supportingverseData.length; index++) {
            const element = supportingverseData[index];
                returnArr.push(element?.refrence);
        }
        return returnArr;
    }
    return [];
};
