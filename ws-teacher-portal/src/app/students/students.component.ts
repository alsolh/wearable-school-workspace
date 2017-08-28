import { Component, OnInit } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { OAuthService } from 'angular-oauth2-oidc';

@Component({
  selector: 'app-students',
  templateUrl: './students.component.html',
  styleUrls: ['./students.component.css']
})
export class StudentsComponent implements OnInit {
  studentsCount = 10;
  constructor(private http: Http, private oAuthService: OAuthService) {
    this.getData().subscribe(data => {
      console.log(data);
    })
    this.getData();
  }

  ngOnInit() {
  }

  getData() {
    console.log(this.oAuthService.getAccessToken());
    let headers: Headers = new Headers();
    headers.append('Authorization', 'Bearer ' + this.oAuthService.getAccessToken());
    let opts: RequestOptions = new RequestOptions();
    opts.headers = headers;
    return this.http.get('https://classroom.googleapis.com/v1/courses', opts).map((res: Response) => res.json());
  }

  onAddStudent() {
    this.studentsCount = this.studentsCount + 1;
  }
}
