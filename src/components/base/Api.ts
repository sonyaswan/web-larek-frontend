export type ApiListResponse<Type> = {
    total: number,
    items: Type[]
};

export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';

export class Api {
    readonly baseUrl: string;
    protected options: RequestInit;

    constructor(baseUrl: string, options: RequestInit = {}) {
        this.baseUrl = baseUrl;
        this.options = {
            headers: {
                'Content-Type': 'application/json',
                ...(options.headers as object ?? {})
            }
        };
    }

    protected _handleResponse(response: Response): Promise<object> {
        if (response.ok) return response.json();
        else return response.json()
            .then(data => Promise.reject(data.error ?? response.statusText));
    }

    protected _request(uri: string, options: object): Promise<object> {
        return fetch(this.baseUrl + uri, options).then(this._handleResponse)
    }

    get(uri: string) {
        return this._request(uri, {
            ...this.options,
            method: 'GET'
        });
    }

    post(uri: string, data: object, method: ApiPostMethods = 'POST') {
        return this._request(uri, {
            ...this.options,
            method,
            body: JSON.stringify(data)
        })
    }
}
