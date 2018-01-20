import {Component, OnInit} from '@angular/core';
import {OAuthService} from 'angular-oauth2-oidc';

@Component({
  selector: 'app-gsignin',
  templateUrl: './gsignin.component.html',
  styleUrls: ['./gsignin.component.css']
})
export class GsigninComponent implements OnInit {
  claims;
  constructor(private oAuthService: OAuthService) {
  }

  public login() {
    this.oAuthService.initImplicitFlow();
    this.oAuthService.loadUserProfile();
  }

  public logoff() {
    this.oAuthService.logOut();
  }
  public get image(){
    console.log('image called');
    console.log(this.claims['picture']);
    return this.claims['picture'];
  }
  public get name() {
    if (!this.claims) {
      this.claims = this.oAuthService.getIdentityClaims();
      this.oAuthService.loadUserProfile();
      console.log('name called');
      console.log('claims object - ' + JSON.stringify(this.claims));
    }
    if (!this.claims) {
      return null;
    } else {
      return this.claims['name'];
    }

  }

  ngOnInit() {
  }

}
