import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";
import { RouterModule } from "@angular/router";
import { ToastrModule } from 'ngx-toastr';

import { AppComponent } from "./app.component";
import { AdminLayoutComponent } from "./layouts/admin-layout/admin-layout.component";
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';

import { NgbModule } from "@ng-bootstrap/ng-bootstrap";

import { AppRoutingModule } from "./app-routing.module";
import { ComponentsModule } from "./components/components.module";
import { UploadAudioFileComponent } from './pages/upload-audio-file/upload-audio-file.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { FeaturesComponent } from './pages/features/features.component';
import { PreprocessingComponent } from './pages/preprocessing/preprocessing.component';
import { PipelinesComponent } from './pages/pipelines/pipelines.component';
import { StoredPipelinesComponent } from './pages/stored-pipelines/stored-pipelines.component';








@NgModule({
  imports: [
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    ComponentsModule,
    NgbModule,
    RouterModule,
    AppRoutingModule,
    ToastrModule.forRoot()
  ],
  exports:[
    
  ],
  declarations: [AppComponent, AdminLayoutComponent, AuthLayoutComponent, UploadAudioFileComponent, PageNotFoundComponent, FeaturesComponent, PreprocessingComponent, PipelinesComponent, StoredPipelinesComponent],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
