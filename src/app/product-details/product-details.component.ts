import { Component ,OnInit} from '@angular/core';
import { ActivatedRoute, RouterLinkWithHref } from '@angular/router';
import { ProductService } from '../services/product.service';
import { cart, product } from '../data-type';
import { JsonPipe, NgIf } from '@angular/common';

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [NgIf],
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.css'
})
export class ProductDetailsComponent implements OnInit{
  productData:undefined|product
  productQuantity:number=1
  quantity:number=1
  removeCart=false
  cartData:product|undefined
  constructor(private activateRoute:ActivatedRoute,private product:ProductService) { }
  ngOnInit(): void {
    let productId=this.activateRoute.snapshot.paramMap.get('productId')
    productId && this.product.getProduct(productId).subscribe((result)=>{
      this.productData=result
      let cartData=localStorage.getItem('localCart')
      if(productId &&cartData)
      {
        let items=JSON.parse(cartData)
        items=items.filter((item:product)=>productId==items.id.toString())
        if(items.length){
          this.removeCart=true
        }
        else{
          this.removeCart=false
        }
      }
      //when we refresh after login then cart data should be there
      let user=localStorage.getItem('user')
      if(user){
        let userId=user && JSON.parse(user).id
        this.product.getCartList(userId)
        //subscribe krne se data update hojata he
        this.product.cartData.subscribe((result)=>{
            let item=result.filter((item:product)=>productId?.toString()===item.productId?.toString())
            if(item.length){
              this.cartData=item[0]
              this.removeCart=true
            }
        })
      }
        
    })
  }
  handleQuantity(val:string){
    if(this.productQuantity<20&& val==='plus')
    {
      this.productQuantity=this.productQuantity+=1
    }
    if(this.productQuantity>1 && val==='min')
    {
      this.productQuantity=this.productQuantity-=1
    }
  }
  addToCart(){
    if(this.productData){
      this.productData.quantity=this.productQuantity
      if(!localStorage.getItem('user')){
        this.product.localAddToCart(this.productData)
        this.removeCart=true
      }
      else{
        console.warn("user is logged in")
        let user=localStorage.getItem('user')
        let userId=user && JSON.parse(user).id
        let cartData:cart={
          ...this.productData,userId,productId:this.productData.id,
        }
        delete cartData.id
        this.product.addToCart(cartData).subscribe((result)=>{
          console.warn('result',result)
          if(result)
          {
            this.product.getCartList(userId)
            this.removeCart=true
          }
        })
      }   
      console.warn("cartdata",this.productData)
    }
  }
  removeFromCart(productId:number){
    if(!localStorage.getItem('user')){
    this.product.removeItemFromCart(productId)
    
    }else{
        
        this.cartData && this.product.removeFromCart(this.cartData.id).subscribe((result)=>{
          if(result){
            let user=localStorage.getItem('user')
        let userId=user && JSON.parse(user).id
            this.product.getCartList(userId)
          }
       })
       this.removeCart=false
    }
    
  }

}
