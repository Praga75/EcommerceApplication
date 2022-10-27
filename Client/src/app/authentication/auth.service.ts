import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import * as _ from 'lodash';
import { CookieService } from 'ngx-cookie-service';
import { MainService } from '@services/main.services';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { LoginService } from './login.service';
import { DewService } from '@services/dew.service';
import { Observable, BehaviorSubject, from } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Config } from '../config';
import * as authProvider from '../../assets/settings.json';
import { User } from '@interfaces/user'

@Injectable({
    providedIn: 'root',
})
export class DewAuthService {
    public authToken = '';
    // currentUser = null;
    permissionList = null;
    public isAuthenticated = new BehaviorSubject<boolean>(false);
    public currentUser: any = new BehaviorSubject<User>({
        userId: null,
        userName: '',
        firstName: '',
        lastName: '',
        email: '',
        displayName: '',
        hasAddress: false,
        isActive: false,
        DocId: '',
        originalProfilePicFileName: '',
        profilePicMimeType: ''
    });


    useCookies = true;
    authProvider: any = authProvider.default;
    // authProvider:any = null;
    credentialsLoaded = false;
    permissionsLoaded = false;
    providerNeedsToken = null;
    loginInProgress = false;
    httpOptions = null;

    constructor(private router: Router, public http: HttpClient, private cookieService: CookieService,
        private mainApi: MainService, private loginService: LoginService, private dewService: DewService) {
        this.httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            })
        };
    }


    loadUserCredentials(cb) {
        if (this.credentialsLoaded) {
            cb();
            return;
        }
        let getCredentials = () => {
            var token = null;
            var user = null;
            if (this.useCookies) {
                token = this.cookieService.get(this.authProvider.authProvider) || null;
                user = this.cookieService.get(this.authProvider.authProvider + '_user') ? JSON.parse(this.cookieService.get(this.authProvider.authProvider + '_user')) : null;
            } else {
                token = window.localStorage.getItem(this.authProvider.authProvider);
                user = window.localStorage.getItem(this.authProvider.authProvider + '_user');
            }
            this.currentUser = user;
            if (token) {
                this.useCredentials(token, user);
            }
            if (!this.permissionsLoaded) {
                this.getPermissions((response) => {
                    // console.log("Permissions Loaded", response);
                    this.permissionsLoaded = true;
                });
            }
            this.credentialsLoaded = true;
        };
        //this.getSettings(() => {
        getCredentials();
        cb();
        //})
    }

    getSettings(cb) {
        if (this.authProvider) {
            cb();
            return;
        }
        this.http.get(Config.ServiceBaseUrl + 'assets/settings.json').subscribe({
            next: (data) => {
                this.authProvider = data;
                cb();
            },
            error: (error) => {
                console.log("unable to load settings");
            },
            complete: () => { }
        });
    }

    storeUserCredentials(token, user) {
        if (this.useCookies) {
            this.cookieService.set(this.authProvider.authProvider, token);
            this.cookieService.set(this.authProvider.authProvider + '_user', JSON.stringify(user));
            this.cookieService.set('getUser', user);
            this.cookieService.set('getToken', token);
            this.cookieService.delete('loggedInUser');
            if (user.stayLoggedIn) {
                this.cookieService.set('loggedInUser', user.userName);
            }
        } else {
            window.localStorage.setItem(this.authProvider.authProvider, token);
            window.localStorage.setItem('getToken', token);
            window.localStorage.setItem(this.authProvider.authProvider + '_user', JSON.stringify(user));
        }
        if (token && user) {
            this.useCredentials(token, user);
        }
    }

    setProviderToken(provider, token) {
        if (this.useCookies) {
            this.cookieService.set(provider, token);
        } else {
            window.localStorage.setItem(provider, token);
        }
    }

    getProviderToken(provider) {
        if (this.useCookies) {
            return this.cookieService.get(provider);
        } else {
            return window.localStorage.getItem(provider);
        }
    }

    useCredentials(token, user) {
        this.isAuthenticated.next(true);

        this.authToken = token;
        this.currentUser = user;

        if (this.useCookies) {
            this.cookieService.set("Authorization", token);
        }
    }

    destroyUserCredentials() {
        this.isAuthenticated.next(false);

        this.authToken = null;
        this.currentUser = null;

        if (this.useCookies) {
            this.cookieService.delete("Authorization");
            this.cookieService.delete(this.authProvider.authProvider);
            this.cookieService.delete(this.authProvider.authProvider + '_user');
            this.cookieService.delete('getUser');
            this.cookieService.delete('getToken');
        } else {
            window.localStorage.removeItem(this.authProvider.authProvider);
            window.localStorage.removeItem(this.authProvider.authProvider + '_user');
        }
    }



    showLogin(url) {
        //this.getSettings(() => {
        this.providerNeedsToken = null;
        if (this.authProvider.authProvider == "Dew" || this.authProvider.loginScreenProvider == "Dew") {
            if (!this.isAuthenticated.value) {
                if (this.useCookies && this.cookieService.get('loggedInUser')) {
                    this.router.navigate(["/login"], { queryParams: { loggedInUser: this.cookieService.get('loggedInUser'), returnUrl: url } });
                } else {
                    this.router.navigate(["/login"], { queryParams: { returnUrl: url } });
                }
            }
        } else if (this.authProvider.authProvider != "NOLOGIN" && this.authProvider.loginScreenProvider != "NOLOGIN") {
            if (this.loginInProgress)
                return;
            this.loginInProgress = true;
            this.getExternalServiceConfig(this.authProvider.authProvider, this.authProvider.authProviderLocal, (providerNFErr, provider) => {
                if (!providerNFErr && provider) {

                    this.loginService.loginExternal(true, provider, (error, token, user) => {
                        this.loginInProgress = false;
                        if (!error) {
                            this.processLoginResponse(token, user, (r) => {
                                if (r) {
                                    this.router.navigate(["/"], { queryParams: { returnUrl: url } });
                                    //$route.reload();
                                }
                            });
                        }
                    });
                } else {
                    this.loginInProgress = false;
                    //cb(providerNFErr);
                }
            });
        }
        //})
    };

    getToken(serviceProviderName, url, cb) {
        this.getExternalServiceConfig(serviceProviderName, true, (providerNFErr, aProvider) => {
            this.providerNeedsToken = aProvider;
            if (!providerNFErr && this.providerNeedsToken) {
                if (this.providerNeedsToken.CredentialNeeded && this.providerNeedsToken.CredentialNeeded.toLowerCase() == "yes") {
                    this.router.navigate(["/login"], { queryParams: { returnUrl: url } });
                } else {
                    this.loginService.loginExternal(false, this.providerNeedsToken, (error, token) => {
                        if (!error) {
                            this.providerNeedsToken.token = token;
                            this.saveExternalServiceConfig(this.providerNeedsToken, (err) => {
                                if (!err) {
                                    //$location.path('/externalServices');
                                    if (cb) {
                                        cb();
                                    }
                                }
                            });
                        }
                        else {
                            //alert(error);
                            cb(error);
                        }
                    });
                }
            } else {
                this.router.navigate(["/externalServices"]);
            }
        });
    };

    login(user) {
        return new Observable((observer) => {
            var self = this;
            if (this.providerNeedsToken) {
                this.loginService.loginExternalUsingUser(false, this.providerNeedsToken, user, function (error, token) {
                    if (!error) {
                        self.providerNeedsToken.token = token;
                        self.saveExternalServiceConfig(this.providerNeedsToken, function (err) {
                            if (!err) {
                                observer.next("login successful");
                                this.router.navigate(["/externalServices"]);
                            } else {
                                observer.error("Login Failed!");
                            }
                        });
                    } else {
                        observer.error("Login Failed!");
                    }
                });
            } else if (this.authProvider.authProvider == "Dew") {
                this.mainApi.login(user).subscribe({
                    next: (result: any) => {
                        if (result && result.success) {
                            result.user.stayLoggedIn = user.stayLoggedIn;
                            self.processLoginResponse(result.token, result.user, function (r) {
                                if (r) {
                                    observer.next("login successful");
                                } else {
                                    observer.error("Login Failed!");
                                }
                            });
                        } else if (result && !result.success && result.msg) {
                            observer.error(result.msg);
                        } else {
                            observer.error("Login Failed!");
                        }
                    },
                    error: (error) => {
                        observer.error("Login Failed!");
                    },
                    complete: () => { }
                })
            } else {
                this.getExternalServiceConfig(this.authProvider.authProvider, this.authProvider.authProviderLocal, function (providerNFErr, provider) {
                    if (!providerNFErr && provider) {
                        this.loginService.loginExternalUsingUser(true, provider, user, function (error, token, userResponse) {
                            if (!error) {
                                self.processLoginResponse(token, userResponse, function (r) {
                                    if (r) {
                                        this.router.navigate(["/"]);
                                    }
                                });
                            }
                        });
                    } else {
                        observer.error(providerNFErr);
                    }
                });
            }
        });
    };

    processLoginResponse(token, user, cb) {
        this.currentUser = user;
        if (token && user) {
            this.storeUserCredentials(token, user);
            this.getPermissions((response) => {
                cb(response);
            });
        } else {
            cb(null)
        }

    };

    showForbiddenPage() {
        this.router.navigate(["/forbidden"]);
    }

    getPermissions(cb) {
        var self = this;
        if (this.authProvider.useDewAuthorization && this.currentUser) {
            this.mainApi.getPermissions(this.currentUser).subscribe({
                next: (permissionsResponse) => {
                    self.setPermissions(permissionsResponse);
                    cb(true);
                },
                error: (error) => {
                    cb(false);
                },
                complete: () => { }
            })
        } else {
            cb(true);
        }
    };

    logout(url) {
        this.destroyUserCredentials();
        this.showLogin(url);
    };

    setPermissions(permissions) {
        this.permissionList = permissions;
        this.dewService.permissionsChanged.emit(this.permissionList);
    };

    getExternalServiceConfig(providerName, authProviderLocal, cb) {
        if (!authProviderLocal) {
            this.mainApi.getServiceConnectionByName(providerName).subscribe({
                next: (response: any) => {
                    _.each(response.authParameters, (p) => {
                        response[p.key] = p.value;
                    });
                    cb(null, response);
                }, 
                error: (error) => {
                    cb(error, null);
                }, 
                complete: () => { }
            })
        } else {
            this.http.get('externalServices/externalServiceConnections.json').subscribe({
                next: (data) => {
                    var conn: any = _.find(data, function (p: any) {
                        return p.serviceProviderName == providerName;
                    });
                    if (conn) {
                        _.each(conn.authParameters, function (p) {
                            conn[p.key] = p.value;
                        });
                        cb(null, conn);
                    } else {
                        cb("Conn not found");
                    }
                },
                error: (error) => {
                    cb(error);
                },
                complete: () => { }
            });
        }
    };

    saveExternalServiceConfig(provider, cb) {
        if (!provider.AuthProviderLocal) {
            this.mainApi.saveExternalServiceConnection(provider).subscribe({
                next: (response) => {
                    cb(null);
                }, 
                error: (error) => {
                    cb(error);
                },
                complete: () => { }
            });
        } else {
            this.setProviderToken(provider.serviceProviderName, provider.token);
            cb();
        }
    };

    hasPermission(permission, cb) {
        permission = permission.trim();
        if (!this.permissionList) cb(false);
        cb(_.some(this.permissionList, (item) => {
            return item === permission;
        }));
    };

    loginScreenProvider() {
        return this.authProvider.loginScreenProvider;
    }

}
