import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../../services/api-services/user.service';

@Component({
  selector: 'app-info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.scss'],
})
export class InfoComponent implements OnInit {

  constructor(public userService: UserService) { }

  ngOnInit() {}

}
