import * as http from './http';

const BASE_DOMAIN = 'https://www.instacart.ca';
const API_VERSION = 'v3';
const COOKIE_SESSION_NAME = '_instacart_session';

export interface Options {
    email: string;
    password: string;
}

enum Path {
    LOGIN = 'dynamic_data/authenticate/login',
    DELIVERY = 'next_gen/retailer_information/content/delivery',
    RETAILERS = 'next_gen/retailers',
}

export default class InstacWrapper {
    private _email: string;
    private _password: string;
    private _sessionToken: string | null;

    constructor({ email, password }: Options) {
        this._email = email;
        this._password = password;
        this._sessionToken = null;
    }

    private buildUrl(path: string) {
        return new URL(`${BASE_DOMAIN}/${API_VERSION}/containers/${path}?source=web`);
    }

    private getHeaders(withAuth = false) {
        return {
            ...withAuth && !!this._sessionToken
                ? { 'Cookie': `${COOKIE_SESSION_NAME}=${this._sessionToken}` }
                : undefined
        };
    }

    public async login() {
        const url = new URL(`${BASE_DOMAIN}/${API_VERSION}/${Path.LOGIN}?source=mobile_web&cache_key=undefined`);
        const body = {
            email: this._email,
            password: this._password,
            grant_type: 'password',
            signup_v3_endpoints_web: null,
            authenticity_token: null,
        }

        const res = await http.post(url, body);

        const sessionCookie = res.headers.raw()['set-cookie'].find(c => c.startsWith(COOKIE_SESSION_NAME));

        if (!sessionCookie) { throw new Error('Login failed. Unable to retrieve session token'); }

        this._sessionToken = sessionCookie.split(`${COOKIE_SESSION_NAME}=`).slice(1).join();
    }

    public async getDeliveryTimes(retailerName: string) {
        const url = this.buildUrl(`${retailerName}/${Path.DELIVERY}`);
        const res = await http.get(url, this.getHeaders(true));

        if (res.status !== 200) {
            throw new Error(`HTTP Error: failed to fetch delivery times for: ${retailerName}`);
        }

        return {
            status: res.status,
            data: (await res.json()).container,
        }
    }

    public async getRetailers() {
        const url = this.buildUrl(`${Path.RETAILERS}`);
        const res = await http.get(url, this.getHeaders(true));

        if (res.status !== 200) {
            throw new Error('HTTP ERROR: failed to fetch retailers');
        }

        return {
            status: res.status,
            data: (await res.json()).container,
        }
    }
}