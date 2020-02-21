import { Component, OnInit } from '@angular/core';
import { UserService } from '../core/user.service';
import { AuthService } from '../core/auth.service';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FirebaseUserModel } from '../core/user.model';
import { element } from '@angular/core/src/render3';

@Component({
  selector: 'page-about',
  templateUrl: 'about.component.html',
  styleUrls: ['about.scss']
})
export class AboutComponent {

 
}
