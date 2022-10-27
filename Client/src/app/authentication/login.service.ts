import { Injectable, COMPILER_OPTIONS } from '@angular/core';
import { Router } from '@angular/router';
import * as _ from 'lodash';
import { CookieService } from 'ngx-cookie-service';
import { MainService } from '@services/main.services';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';

@Injectable({
    providedIn: 'root',
})
export class LoginService {
    constructor(private router: Router, public http: HttpClient) { }

    loginExternal(isLogin, provider, cb) {
        var completeUrl = '/api/getUserToken';
        if (provider && provider.UseServerSide && provider.UseServerSide.toLowerCase() == 'yes') {
            this.processUserCredentialsServer(isLogin, completeUrl, provider.serviceProviderName, null, cb);
        }
        else {
            this.processUserCredentialsLocal(isLogin, provider, null, cb);
        }

    };

    processUserCredentialsServer(isLogin, completeUrl, providerName, credentials, cb) {
        if (!credentials)
            credentials = {};
        credentials.serviceProviderName = providerName;
        credentials.isLogin = isLogin;
        this.http.post(completeUrl, credentials).subscribe({
            next: (result: any) => {
                cb(null, result.token, result.user);
            }, 
            error: (error) => {
                cb(error);
            }, 
            complete: () => { }
        });
    };

    processUserCredentialsLocal(isLogin, conn, currentResponse, cb) {
        if (!currentResponse)
            currentResponse = null;
        var config = _.assign(conn, currentResponse);
        //config.qs = qs;

        var atOptions = JSON.parse(_.template(config.AccessTokenPath)(config));
        this.processHttp(atOptions).subscribe({
            next: (response: any) => {
                if (!response || (response.statusCode && response.statusCode != 200)) {
                    cb("Server error");
                    return;
                }
                config.body = response;
                if (config.AccessTokenReference && config.AccessTokenReference.length) {
                    config.accessToken = _.template(config.AccessTokenReference)(config);
                }
                else {
                    config.accessToken = null;
                }
    
                if (isLogin) {
                    if (config.ProfilePath && config.ProfilePath.length) {
                        let profileOptions = JSON.parse(_.template(config.ProfilePath)(config));
                        this.processHttp(profileOptions).subscribe({
                            next: (profileResponse: any) => {
                                if (!profileResponse || (profileResponse.statusCode && profileResponse.statusCode != 200)) {
                                    cb("Server error");
                                    return;
                                }
                                let user = JSON.parse(_.template(config.LoginResponse)(profileResponse));
                                user.token = config.accessToken;
                                cb(null, config.accessToken, user);
                            },
                            error: (error) => {
                                cb(error);
                            }, 
                            complete: () => { }
                        });
                    }
                    else {
                        var user = currentResponse;
                        if (user.password) {
                            delete user.password;
                        }
                        if (user.Password) {
                            delete user.Password;
                        }
                        cb(null, config.accessToken, user);
                    }
                }
                else {
                    cb(null, config.accessToken);
                }
            },
            error: (error) => {
                cb(error);
            }, 
            complete: () => { }
        });
    };

    loginExternalUsingUser(isLogin, provider, user, cb) {
        if (provider.UseServerSide.toLowerCase() == 'yes') {
            this.processUserCredentialsServer(isLogin, '/api/getUserToken', provider.serviceProviderName, user, cb);
        }
        else {
            this.processUserCredentialsLocal(isLogin, provider, user, cb);
        }
    }

    processHttp(options) {
        let httpOptions: any = {};
        if (options.headers) {
            httpOptions.headers = new HttpHeaders(options.headers);
        }
        let data = options.data ? options.data : {};
        if (options.methodType == 'POST') {
            return this.http.post(options.url, data, httpOptions);
        } 
        else if (options.methodType == 'PUT') {
            return this.http.put(options.url, data, httpOptions);
        } 
        else if (options.methodType == 'DELETE') {
            return this.http.delete(options.url, httpOptions);
        } 
        else {
            return this.http.get(options.url, httpOptions);
        }
    }
}
