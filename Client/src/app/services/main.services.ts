import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';


@Injectable({
    providedIn: 'root'
})
export class MainService {
    public apiUrl: string;

    constructor(public http: HttpClient) { }

    login(request) {
        return this.http.post('api/login', request);
    }
    getPermissions(request) {
        return this.http.post('api/getPermissions', request);
    }

    forgotPassword(request) {
        return this.http.post('api/forgotPassword', request, {
            headers: new HttpHeaders({
                "Content-Type": "application/json"
            })
        });
    }

    registerUser(request) {
        return this.http.post('api/registerUser', request, {
            headers: new HttpHeaders({
                "Content-Type": "application/json"
            })
        });

    }

    getAccessToken(request) {
        return this.http.post('api/getAccessToken', request);
    }


    getExternalServiceConnections() {
        var url = 'api/getExternalServiceConnections';
        return this.http.get(url);
    }
    saveExternalServiceConnections(request) {
        return this.http.post('api/saveExternalServiceConnections', request);
    }
    saveExternalServiceConnection(request) {
        return this.http.post('api/saveExternalServiceConnection', request);
    }
    getServiceConnectionByName(serviceProviderName) {
        var url = 'api/getServiceConnectionByName' + '?' + 'serviceProviderName=' + serviceProviderName;
        return this.http.get(url);
    }
    uploadFile(f, isDewDoc) {
        var url = 'api/uploadFile';
        var fd = new FormData();
        fd.append('file', f);
        fd.append('isDewDoc', isDewDoc);
        // let options = { headers: new HttpHeaders().set('Content-Type', 'multipart/form-data;boundary=' + Math.random()).set("Accept", "application/json") };
        return this.http.post(url, fd);
    }
    getUsers(gridProperties) {
        var url = 'api/getUsers';
        var request: any = {};
        request.gridProperties = gridProperties || {};
        return this.http.post(url, request);
    }

    getUser(request) {
        return this.http.post('api/getUser', request);
    }
    updateUser(request) {
        return this.http.post('api/updateUser', request);
    }
    addUser(request) {
        return this.http.post('api/addUser', request);
    }
    changePassword(request) {
        return this.http.post('api/changePassword', request);
    }

    getRoleDetails(request) {
        return this.http.post('api/getRoleDetails', request);
    }
    updateRoles(request) {
        return this.http.post('api/updateRoles', request);
    }
    insertRoles(request) {
        return this.http.post('api/insertRoles', request);
    }
    deleteRole(request) {
        return this.http.post('api/deleteRole', request);
    }
    insertUserRole(request) {
        return this.http.post('api/insertUserRole', request);
    }
    deleteUserRole(request) {
        return this.http.post('api/deleteUserRole', request);
    }
    deleteUser(request) {
        return this.http.post('api/deleteUser', request);
    }
    getUserRoles(userName) {
        var url = 'api/getUserRoles' + '?' + 'userName=' + userName;
        return this.http.get(url);
    }
    getRoles(gridProperties) {
        var url = 'api/getRoles';
        var request: any = {};
        request.gridProperties = gridProperties || {};
        return this.http.post(url, request);
    }
    getOperations(gridProperties) {
        var url = 'api/getOperations';
        var request: any = {};
        request.gridProperties = gridProperties || {};
        return this.http.post(url, request);
    }
    insertOperations(request) {
        return this.http.post('api/insertOperations', request);
    }
    updateOperations(request) {
        return this.http.post('api/updateOperations', request);
    }
    // getSecurityEntities(gridProperties) {
    //   var url = 'api/getSecurityEntities';
    //   var request = {};
    //   request.gridProperties = gridProperties;
    //   return this._http.post(url, request);
    // }

    getSecurityEntities(gridProperties) {
        var url = 'api/getSecurityEntities';
        var request: any = {};
        request.gridProperties = gridProperties || {};
        return this.http.post(url, request);
    }

    insertSecurityEntity(request) {
        return this.http.post('api/insertSecurityEntity', request);
    }
    updateSecurityEntity(request) {
        return this.http.post('api/updateSecurityEntity', request);
    }
    deleteSecurityEntity(request) {
        return this.http.post('api/deleteSecurityEntity', request);
    }
    // getRoleEntityOperations(roleName, gridProperties) {
    //   var url = 'api/getRoleEntityOperations' + '?' + 'roleName=' + roleName;
    //   var request = {};
    //   request.roleName = roleName;
    //   request.gridProperties = gridProperties;
    //   return this._http.post(url, request);
    // }
    insertRoleEntityOperation(request) {
        return this.http.post('api/insertRoleEntityOperation', request);
    }
    deleteRoleEntityOperation(request) {
        return this.http.post('api/deleteRoleEntityOperation', request);
    }
    deleteOperations(request) {
        return this.http.post('api/deleteOperations', request);
    }
    // getTags(gridProperties) {
    //   var url = 'api/getTags';
    //   var request = {};
    //   request.gridProperties = gridProperties;
    //   return this._http.post(url, request);
    // }
    insertTags(request) {
        return this.http.post('api/insertTags', request);
    }

    getDocuments(moduleName, gridProperties, status) {
        var url = 'api/getDocuments' + '?' + 'moduleName=' + moduleName;
        var request: any = {};
        request.moduleName = moduleName;
        request.gridProperties = gridProperties;
        request.status = status;
        return this.http.post(url, request);
    }

    insertDocument(request) {
        return this.http.post('api/insertDocument', request);
    }
    updateDocument(request) {
        return this.http.post('api/updateDocument', request);
    }
    deleteDocument(request) {
        return this.http.post('api/deleteDocument', request);
    }
    insertCodeTableHeader(request) {
        return this.http.post('api/insertCodeTableHeader', request);
    }
    deleteTableHeader(request) {
        return this.http.post('api/deleteTableHeader', request);
    }
    insertCodeTable(request) {
        return this.http.post('api/insertCodeTable', request);
    }
    getCodeTableHeaders(gridProperties) {
        var url = 'api/getCodeTableHeaders';
        var request: any = {};
        request.gridProperties = gridProperties;
        return this.http.post(url, request);
    }
    getCodeTables(CodeName, gridProperties) {
        var url = 'api/getCodeTables' + '?' + 'CodeName=' + CodeName;
        var request: any = {};
        request.gridProperties = gridProperties;
        return this.http.post(url, request);
    }
    updateCodeTable(request) {
        return this.http.post('api/updateCodeTable', request);
    }
    deleteCodeTable(request) {
        return this.http.post('api/deleteCodeTable', request);
    }

    sendNotification(request) {
        return this.http.post('api/sendNotification', request);
    }

    getApplicationUserbyUserName(username) {
        var request: any = {};
        request.username = username;
        return this.http.post('api/getApplicationUserbyUserName', request);
    }

    getApplicationUserbyEmail(email) {
        var request: any = {};
        request.email = email;
        return this.http.post('api/getApplicationUserbyEmail', request);
    }

}
