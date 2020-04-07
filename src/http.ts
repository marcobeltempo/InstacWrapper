import fetch from 'node-fetch';

const getDefaultHeaders = () => {
    return {
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
        'X-Client-Identifier': 'web',
        'Accept': 'application/json',
    };
}

export const get = (url: URL, headerOverride?: any) => {
    return fetch(url, {
        method: 'GET',
        headers: {...getDefaultHeaders(), ...headerOverride},
    });
}

export const post = (url: URL, body: {}, headerOverride?: any) => {
 return fetch(url, {
        method: 'POST',
        headers: {...getDefaultHeaders(), ...headerOverride},
        body: JSON.stringify(body),
    });
}