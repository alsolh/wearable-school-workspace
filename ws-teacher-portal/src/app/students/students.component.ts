import {Component, OnInit} from '@angular/core';
import {Http, Response, Headers, RequestOptions} from '@angular/http';
import {OAuthService} from 'angular-oauth2-oidc';
import {Message} from 'primeng/primeng';

@Component({
  selector: 'app-students',
  templateUrl: './students.component.html',
  styleUrls: ['./students.component.css']
})
export class StudentsComponent implements OnInit {
  studentsCount = 10;
  courses: any[];
  students: any[];
  watches: any[];
  selectedCourse;
  selectedStudent;
  selectedWatch;
  msgs: Message[] = [];

  constructor(private http: Http, private oAuthService: OAuthService) {

  }

  onRowSelect(event) {
    console.log(event.data.id + ' - ' + event.data.name);
    this.getStudents().subscribe(data => {
      console.log(data);
      this.students = data.students;
    });
    this.getStudents();
  }

  getStudents() {
    return this.http.get('https://classroom.googleapis.com/v1/courses/' + this.selectedCourse.id + '/students', this.getAuthOpts()).map((res: Response) => res.json());
  }

  getAuthOpts() {
    const headers: Headers = new Headers();
    headers.append('Authorization', 'Bearer ' + this.oAuthService.getAccessToken());
    const opts: RequestOptions = new RequestOptions();
    opts.headers = headers;
    return opts;
  }

  ngOnInit() {
    this.courses = [];
    this.getWatches().subscribe(data => {
      console.log(data.rows);
      this.watches = data.rows;
    });
    console.log(this.oAuthService.getAccessToken() != null);
    if (this.oAuthService.getAccessToken() != null) {
      this.getData().subscribe(data => {
        console.log(data);
        this.courses = data.courses;
      });
      // this.getData();
    }
  }

  public assignWatchToStudent() {
    this.updateWatchRecord().subscribe(
      data => {
        // console.log(data);
        this.msgs.push({severity: 'success', summary: 'Watch Assigned'});
        this.getWatches().subscribe(watches => {
          console.log(watches.rows);
          this.watches = watches.rows;
          this.selectedWatch = null;
        });
      }
      ,
      err => {
        console.log(err);
        this.msgs.push({severity: 'error', summary: 'Watch Assignment Failed!', detail: err});
      }
    )
    ;
  }

  updateWatchRecord() {
    console.log('http://192.168.43.10:5984/watches/' + (this.selectedWatch.id).replace('+', '%2B'));
    return this.http.put('http://192.168.43.10:5984/watches/' + (this.selectedWatch.id).replace('+', '%2B'), '{"studentId": "' + this.selectedStudent.profile.id + '", "_rev": "' + this.selectedWatch.value.rev + '","studentName": "' + this.selectedStudent.profile.name.fullName + '"}').map((res: Response) => res.json());
  }

  getWatches() {
    console.log('getwatches called');
    return this.http.get('http://admin:asolh787@192.168.43.10:5984/watches/_all_docs?include_docs=true').map((res: Response) => res.json());
  }

  getData() {
    // console.log(this.oAuthService.getAccessToken());
    const headers: Headers = new Headers();
    headers.append('Authorization', 'Bearer ' + this.oAuthService.getAccessToken());
    const opts: RequestOptions = new RequestOptions();
    opts.headers = headers;
    return this.http.get('https://classroom.googleapis.com/v1/courses', opts).map((res: Response) => res.json());
  }

  onAddStudent() {
    this.studentsCount = this.studentsCount + 1;
  }
}
