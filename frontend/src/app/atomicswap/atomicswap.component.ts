import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-atomicswap',
  templateUrl: './atomicswap.component.html',
  styleUrls: ['./atomicswap.component.scss']
})
export class AtomicSwapComponent implements OnInit {
  swaps : {
    date : Date,
    peer : string,
    foreignAmount : number,
    foreignCurrency : string,
    vtcAmount : number,
    rate : number,
    status : string
  }[] = [
    {
        date : new Date(2017,8,20),
        peer : 'coblee',
        foreignAmount : 1,
        foreignCurrency : 'LTC',
        vtcAmount : 55,
        rate : 55,
        status : 'Completed'
    }
  ];
  constructor() { }

  ngOnInit() {
  }

}
