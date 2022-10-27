import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DEFAULT_OPTIONS } from '@angular/material/dialog';
import { BrowserModule } from '@angular/platform-browser';
import { DataTablesModule } from 'angular-datatables';
import { NgChartsModule } from 'ng2-charts';

// Dew Prebuild Modules and Components
import { ManageUsersComponent } from '../manage-users/manage-users.component';
import { ManageRolesComponent } from '../manage-roles/manage-roles.component';
import { ManageEntitiesComponent } from '../manage-entities/manage-entities.component';
import { ManageOperationsComponent } from '../manage-operations/manage-operations.component';
import { ManageCodetablesComponent } from '../manage-codetables/manage-codetables.component';
import { ManageDocumentsComponent } from '../manage-documents/manage-documentss.component';

import { MaterialModule } from "../material.module";
import { FileInput } from './file-input/file-input';

import { DeleteConfirmDialogComponent } from './delete-confirm-dialog/delete-confirm-dialog.component';
import { DewAlertDialogComponent } from './dew-alert-dialog/dew-alert-dialog.component';
import { DewConfirmDialogComponent } from './dew-confirm-dialog/dew-confirm-dialog.component';

import { DataTableFilterComponent, } from './grids/datatable-filter.component';
import { NoitemComponent } from './noitem/noitem.component';
import { ErrorComponent } from './error/error.component';
import { ForgotComponent } from './forgot/forgot.component';
import { LockscreenComponent } from './lockscreen/lockscreen.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { MyProfileComponent, ChangePasswordDialog } from './my-profile/my-profile.component';

import { HasPermission } from '../authentication/has.permission';
import { ClipboardModule } from 'ngx-clipboard';

import { AddApplicationUserDialog, EditApplicationUserDialog, UserDetailsComponent, AddApplicationUserRolesDialog } from './user-details/user-details.component';
import { EntitiesDetailsComponent, EditApplicationEntityDialog, AddApplicationEntityDialog } from './entities-details/entities-details.component';
import { OperationsDetailsComponent, AddApplicationOperationsDialog, EditApplicationOperationsDialog } from './operations-details/operations-details.component';
import { AddApplicationRoleDialog, EditApplicationRoleDialog, RoleDetailsComponent, RoleAddEntityOperationDialog } from './role-details/role-details.component';
import { CodetablesDetailsComponent, AddCodeTableDialog, EditCodeTableDialog } from './codetables-details/codetables-details.component';
import { AddDocumentDialog, EditDocumentDialog, DocumentDetailsComponent } from './document-details/document-details.component';

import { CodeTablesGridView } from './codetables-details/codetables-grid-view.component'

import { UserListComponent } from './user-list/user-list.component';
import { EntitiesListComponent } from './entities-list/entities-list.component';
import { OperationsListComponent } from './operations-list/operations-list.component';
import { RoleListComponent } from './role-list/role-list.component';
import { CodetablesListComponent, AddCodeTableHeaderDialog } from './codetables-list/codetables-list.component';
import { DocumentListComponent } from './document-list/document-list.component';



import { gridviewRoles } from "./role-details/grid-view-roles.component";
import { dewMatPager } from './dew-mat-pager/dew-mat-pager';
import { MustMatchDirective } from './must-match/must-match.directive';
import { from } from 'rxjs';
import { DewDataTableComponent } from './grids/dew-datatable/dew-datatable.component';

import { UsernameUniqueDirective } from './unique-check/username-unique.directive';
import { EmailUniqueDirective } from './unique-check/email-unique.directive';
import { RegisterComponent } from './register/register.component';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { ForbiddenComponent } from './forbidden/forbidden.component';
import { waitForMeetingComponent } from './waitForMeeting/waitForMeeting.component';
import { DisablePasteDirective } from './disable-copy-paste/disable-paste.directive';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { QuillModule } from 'ngx-quill';
import { GoogleMapComponent } from './google-plugins/google-places.component';


import { VgCoreModule } from '@videogular/ngx-videogular/core';
import { VgControlsModule } from '@videogular/ngx-videogular/controls';
import { VgBufferingModule } from '@videogular/ngx-videogular/buffering';
import { VgOverlayPlayModule } from '@videogular/ngx-videogular/overlay-play';
import { dewVideoPlayer } from './dew-video-player/dew-video-player'
import { LogoutConfirmComponent } from './logout-confirm/logout-confirm.component'

@NgModule({
    declarations: [
        DataTableFilterComponent,
        //Pre-build shared Components
        UserDetailsComponent,
        UserListComponent,
        EntitiesListComponent,
        EntitiesDetailsComponent,
        OperationsListComponent,
        OperationsDetailsComponent,
        RoleListComponent,
        RoleDetailsComponent,
        CodetablesDetailsComponent,
        CodetablesListComponent,
        DocumentDetailsComponent,
        DocumentListComponent,
        NoitemComponent,
        NotFoundComponent,
        waitForMeetingComponent,
        MyProfileComponent,
        ChangePasswordDialog,
        ErrorComponent,
        ForgotComponent,
        RegisterComponent,
        LockscreenComponent,
        EditApplicationUserDialog,
        AddApplicationUserDialog,
        AddApplicationUserRolesDialog,
        EditApplicationEntityDialog,
        AddApplicationEntityDialog,
        EditApplicationOperationsDialog,
        AddApplicationOperationsDialog,
        DeleteConfirmDialogComponent,
        DewConfirmDialogComponent,
        DewAlertDialogComponent,
        AddApplicationRoleDialog,
        RoleAddEntityOperationDialog,
        EditApplicationRoleDialog,
        AddCodeTableDialog,
        EditCodeTableDialog,
        AddCodeTableHeaderDialog,
        AddDocumentDialog,
        EditDocumentDialog,
        FileInput,
        gridviewRoles,
        CodeTablesGridView,
        //Pre-build Pages
        ManageUsersComponent,
        ManageEntitiesComponent,
        ManageOperationsComponent,
        ManageRolesComponent,
        ManageCodetablesComponent,
        ManageDocumentsComponent,
        dewMatPager,
        MustMatchDirective,
        DisablePasteDirective,
        UsernameUniqueDirective,
        EmailUniqueDirective,
        HasPermission,
        DewDataTableComponent,
        ForbiddenComponent,
        GoogleMapComponent,
        dewVideoPlayer,
        LogoutConfirmComponent
    ],
    imports: [
        BrowserModule,
        FormsModule,
        FlexLayoutModule,
        ReactiveFormsModule,
        DataTablesModule,
        NgChartsModule,
        MaterialModule,
        PdfViewerModule,
        CarouselModule,
        ClipboardModule,
        QuillModule,
        NgxSkeletonLoaderModule,
        VgCoreModule,
        VgControlsModule,
        VgOverlayPlayModule,
        VgBufferingModule,

    ],
    exports: [
        BrowserModule,
        FlexLayoutModule,
        DataTableFilterComponent,
        FormsModule,
        ReactiveFormsModule,
        DataTablesModule,
        NgChartsModule,
        MaterialModule,
        FileInput,
        dewMatPager,
        MustMatchDirective,
        UsernameUniqueDirective,
        EmailUniqueDirective,
        HasPermission,
        PdfViewerModule,
        CarouselModule,
        NgxSkeletonLoaderModule,
        GoogleMapComponent,
        VgCoreModule,
        VgControlsModule,
        VgOverlayPlayModule,
        VgBufferingModule,
        dewVideoPlayer
    ],
    providers: [
        { provide: MAT_DIALOG_DEFAULT_OPTIONS, useValue: { hasBackdrop: true } }
    ],
    entryComponents: [
        EditApplicationUserDialog,
        DeleteConfirmDialogComponent,
        DewConfirmDialogComponent,
        DewAlertDialogComponent,
        AddApplicationUserDialog,
        AddApplicationUserRolesDialog,
        AddApplicationRoleDialog,
        ChangePasswordDialog,
        EditApplicationEntityDialog,
        AddApplicationEntityDialog,
        EditApplicationOperationsDialog,
        AddApplicationOperationsDialog,
        AddApplicationRoleDialog,
        RoleAddEntityOperationDialog,
        EditApplicationRoleDialog,
        AddCodeTableDialog,
        EditCodeTableDialog,
        AddCodeTableHeaderDialog,
        AddDocumentDialog,
        EditDocumentDialog
    ],
})
export class SharedModule { }
