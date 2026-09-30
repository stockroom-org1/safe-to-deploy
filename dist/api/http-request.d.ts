import { ErrorResponse } from '../namespaces/TrustAuthorityDecision';
export declare function postRequest<T, B>(vid: string, vkey: string, resourceUri: string, resourceName: string, body: B): Promise<T | ErrorResponse>;
export declare function getRequestById<T>(vid: string, vkey: string, resourceUri: string, resourceName: string, queryParams: Array<{
    key: string;
    value: string;
}>): Promise<T | ErrorResponse>;
