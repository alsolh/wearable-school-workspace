import {Component, OnInit} from '@angular/core';
import {OAuthService} from 'angular-oauth2-oidc';

@Component({
  selector: 'app-gsignin',
  templateUrl: './gsignin.component.html',
  styleUrls: ['./gsignin.component.css']
})
export class GsigninComponent implements OnInit {

  constructor(private oAuthService: OAuthService) {
  }

  public login() {
    this.oAuthService.initImplicitFlow();
  }

  public logoff() {
    this.oAuthService.logOut();
  }

  public get name() {
    const claims = this.oAuthService.getIdentityClaims();
    // let obj = JSON.parse(JSON.stringify(claims));
    if (!claims) {
      return null;
    } else {
      return claims['name'];
    }

  }

  ngOnInit() {
  }

}
