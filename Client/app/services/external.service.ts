import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as _ from 'lodash';
import { Observable } from 'rxjs';
import { DewAuthService } from '../authentication/auth.service';

@Injectable({
    providedIn: 'root',
})
export class ExternalService {
    constructor(private authService: DewAuthService, private http: HttpClient) {
    }

    public processExternalService(baseServiceName, url, data, requestContentType,
        responseContentType, serviceHeaders, httpMethod, queryParams): Observable<any> {
        return new Observable((observer) => {
            this.http.get('externalServices/externalServiceConnections.json').subscribe({
                next: connData => {
                    let serviceConnection: any = _.find(connData, (c: any) => {
                        return c.serviceProviderName == baseServiceName;
                    });
                    if (serviceConnection) {
                        _.each(serviceConnection.authParameters, (p) => {
                            serviceConnection[p.key] = p.value;
                        });
                    }
                    else {
                        observer.error("service connection not found");
                    }
                    if (serviceConnection.authType == 'OAuth2' || serviceConnection.ProvidesToken) {
                        serviceConnection.token = this.authService.getProviderToken(serviceConnection.serviceProviderName);
                    }
                    let cleanUrl = url;
                    if (url.indexOf('<%=') > -1) {
                        cleanUrl = _.template(url)(serviceConnection);
                    }

                    let req: any = {
                        url: this.getServiceUrl(serviceConnection, cleanUrl),
                        method: httpMethod,
                        headers: {}
                    };
                    if (serviceHeaders && serviceHeaders.length > 0) {
                        _.each(serviceHeaders, (h) => {
                            if (h.value.indexOf('<%=') > -1) {
                                req.headers[h.key] = _.template(h.value)(serviceConnection);
                            }
                            else {
                                req.headers[h.key] = h.value;
                            }
                        });
                    }
                    if (requestContentType) {
                        req.headers['Content-Type'] = requestContentType;
                    }
                    if (responseContentType) {
                        req.headers['accept'] = responseContentType;
                    }
                    this.getServiceAuthentication(serviceConnection, req);

                    if (data) {
                        req.body = data;
                        httpMethod = "POST";
                    }
                    else {
                        httpMethod = "GET";
                    }
                    req.method = httpMethod;
                    if (queryParams) {
                        req.params = queryParams;
                    }
                    req.headers = new HttpHeaders(req.headers);

                    this.http.request(req).subscribe({
                        next: res => {
                            observer.next(res);
                        }, 
                        error: err => {
                            observer.error(err);
                        }, 
                        complete: () => { }
                    });
                },
                error: err => {
                    observer.error(err);
                }, 
                complete: () => { }
            });
        });
    };

    getServiceUrl(serviceConnection, url) {
        if (url.indexOf('http') != 0) {
            url = url.startsWith('/') ? url.substring(1) : url;
            if (serviceConnection.baseUrl.endsWith('/')) {
                return serviceConnection.baseUrl + url;
            }
            else {
                return serviceConnection.baseUrl + "/" + url;
            }
        }
        else {
            return url;
        }
    }

    getServiceAuthentication(serviceConnection, req) {
        if (serviceConnection && serviceConnection.authHeaders.length > 0) {
            _.each(serviceConnection.authHeaders, (h) => {
                if (h.value.indexOf('<%=') > -1) {
                    req.headers[h.key] = _.template(h.value)(serviceConnection);
                }
                else {
                    req.headers[h.key] = h.value;
                }
            });
        }
        if (serviceConnection.authType == 'BasicAuth') {
            let user = '';
            let pwd = '';
            _.each(serviceConnection.authParameters, (p) => {
                if (p.key == 'userName') {
                    user = p.value;
                }
                if (p.key == 'password') {
                    pwd = p.value;
                }
            });
            req.headers['Authorization'] = 'Basic ' + btoa(user + ':' + pwd);
        }
        else if ((serviceConnection.authType == 'OAuth2' || serviceConnection.ProvidesToken) && serviceConnection.token) {
            req.headers['Authorization'] = 'Bearer ' + (serviceConnection.token.access_token ? serviceConnection.token.access_token : serviceConnection.token);
        }
    }
}