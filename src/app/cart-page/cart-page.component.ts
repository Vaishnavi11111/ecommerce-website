import { Component, OnInit } from '@angular/core';
import { ProductService } from '../services/product.service';
import { cart, priceSummary } from '../data-type';
import { NgFor } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cart-page',
  standalone: true,
  imports: [NgFor],
  templateUrl: './cart-page.component.html',
  styleUrl: './cart-page.component.css'
})
export class CartPageComponent implements OnInit {
  cartData:cart[]|undefined
  priceSummary:priceSummary={
    price:0,
    discount:0,
    tax:0,
    delivery:0,
    total:0
  }
  constructor(private product:ProductService,private router:Router) { }
  ngOnInit(): void {
    this.loadDetails()
    
  }
  loadDetails(){
    this.product.currentCart().subscribe((result)=>{
      this.cartData=result
      let price=0;
      result.forEach((item)=>{
          if(item.quantity){
            price=price+(+item.price* +item.quantity)//convert string to number
          }
          
      })
      this.priceSummary.price=price
      this.priceSummary.discount=price/10
      this.priceSummary.tax=price/10
      this.priceSummary.delivery=50
      this.priceSummary.total=price+(price/10)+50-(price/10)
      if(!this.cartData.length){
        this.router.navigate(['/'])
      }
    })
  }
  checkout(){
    this.router.navigate(['/checkout'])
  }
  removeFromCart(cartId:number|undefined){
    cartId && this.product.removeFromCart(cartId).subscribe((result)=>{
      
        this.loadDetails()
      
   })
  }
}
