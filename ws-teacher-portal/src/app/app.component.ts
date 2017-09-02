import { Component } from '@angular/core';
import { OAuthService } from 'angular-oauth2-oidc';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  title = 'app work1s';
  name = '';

  constructor(private oauthService: OAuthService) {
    // URL of the SPA to redirect the user to after login
    this.oauthService.requireHttps = false;
    this.oauthService.strictDiscoveryDocumentValidation = false;

    this.oauthService.redirectUri = window.location.origin + '/index.html';

    // The SPA's id. The SPA is registerd with this id at the auth-server
    this.oauthService.clientId = '327326659682-9lhtb8s3kvd1r7k3fk38823osvm8npa4.apps.googleusercontent.com';

    // set the scope for the permissions the client should request
    // The first three are defined by OIDC. The 4th is a usecase-specific one
    this.oauthService.scope = 'https://www.googleapis.com/auth/classroom.courses.readonly profile https://www.googleapis.com/auth/classroom.rosters';

    // The name of the auth-server that has to be mentioned within the token
    this.oauthService.issuer = 'https://accounts.google.com';

    // Load Discovery Document and then try to login the user
    this.oauthService.loadDiscoveryDocument().then(() => {

      // This method just tries to parse the token(s) within the url when
      // the auth-server redirects the user back to the web-app
      // It dosn't send the user the the login page
      this.oauthService.tryLogin();
    });

  }
}
