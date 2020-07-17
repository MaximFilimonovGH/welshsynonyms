import { Component, OnInit } from '@angular/core';
import { RouteService } from '../services/route-service.service';

@Component({
  selector: 'app-about-page',
  templateUrl: './about-page.component.html',
  styleUrls: ['./about-page.component.css']
})

export class AboutPageComponent implements OnInit {

  constructor(private routeService: RouteService) {this.routeService.changeRoute("mission");}

  ngOnInit(): void {
    this.routeService.changeRoute("mission");
  }

}
