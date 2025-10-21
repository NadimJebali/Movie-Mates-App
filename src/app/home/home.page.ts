import { Component } from '@angular/core';
import 'hammerjs';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false,
})
export class HomePage {

  constructor() {}


    users = [
    { name: 'Alice', age: 23, photo: 'assets/logo.png', transform: '', transition: '' },
    { name: 'Bob', age: 27, photo: 'assets/bob.jpg', transform: '', transition: '' },
    { name: 'Charlie', age: 25, photo: 'assets/charlie.jpg', transform: '', transition: '' },
  ];

  onPan(event: any, index: number) {
    const x = event.deltaX;
    const y = event.deltaY;
    const rotate = x / 10;
    this.users[index].transform = `translate(${x}px, ${y}px) rotate(${rotate}deg)`;
    this.users[index].transition = 'none';
  }

  onPanEnd(event: any, index: number) {
    const x = event.deltaX;
    if (x > 150) this.swipeRight(index);
    else if (x < -150) this.swipeLeft(index);
    else {
      this.users[index].transform = 'translate(0px, 0px) rotate(0deg)';
      this.users[index].transition = 'transform 0.3s ease';
    }
  }

  swipeRight(index: number) {
    this.users[index].transform = 'translate(1000px, 0px) rotate(30deg)';
    this.users[index].transition = 'transform 0.5s ease';
    setTimeout(() => this.users.splice(index, 1), 500);
  }

  swipeLeft(index: number) {
    this.users[index].transform = 'translate(-1000px, 0px) rotate(-30deg)';
    this.users[index].transition = 'transform 0.5s ease';
    setTimeout(() => this.users.splice(index, 1), 500);
  }

}
