import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-students',
  templateUrl: './students.component.html',
  styleUrls: ['./students.component.css']
})
export class StudentsComponent implements OnInit {
  studentsCount = 10;
  constructor() { }

  ngOnInit() {
  }

  onAddStudent() {
    this.studentsCount = this.studentsCount + 1;
  }
}
