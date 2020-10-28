import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-game-advanced',
  templateUrl: './game-advanced.component.html',
  styleUrls: ['./game-advanced.component.css']
})
export class GameAdvancedComponent implements OnInit {

  constructor() { }

  @Input() data: any;

  ngOnInit(): void {
    console.log(this.data);
  }

}
