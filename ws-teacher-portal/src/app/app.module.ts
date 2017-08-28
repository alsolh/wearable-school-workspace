import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule} from '@angular/http';

import { AppComponent } from './app.component';
import { StudentsComponent } from './students/students.component';
import { GsigninComponent } from './gsignin/gsignin.component';
import { GoogleSignInComponent } from 'angular-google-signin';
import { OAuthModule } from 'angular-oauth2-oidc';
import { AngularFontAwesomeModule } from 'angular-font-awesome/angular-font-awesome';
import { DataTableModule } from 'primeng/primeng';

@NgModule({
  declarations: [
    AppComponent,
    StudentsComponent,
    GoogleSignInComponent,
    GsigninComponent
  ],
  imports: [
    BrowserModule,
    DataTableModule,
    HttpModule,
    FormsModule,
    AngularFontAwesomeModule,
    OAuthModule.forRoot()
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
