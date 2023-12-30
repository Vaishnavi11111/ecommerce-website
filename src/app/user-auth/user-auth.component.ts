import { Component ,OnInit} from '@angular/core';
import { UserService } from '../services/user.service';
import { SignUp, cart, login, product } from '../data-type';
import { FormsModule} from '@angular/forms'; 
import { NgIf } from '@angular/common';
import { ProductService } from '../services/product.service';

@Component({
  selector: 'app-user-auth',
  standalone: true,
  imports: [FormsModule,NgIf],
  templateUrl: './user-auth.component.html',
  styleUrl: './user-auth.component.css'
})
export class UserAuthComponent implements OnInit{
  showLogin:boolean=true
  authError:string=""
  constructor(private user:UserService ,private product:ProductService) { }
  ngOnInit(): void {
    this.user.userAuthReload()
  }
  signUp(data:SignUp)
  {
    this.user.userSignUp(data)
  }
  login(data:login){
    this.user.userLogin(data)
    this.user.invalidUserAuth.subscribe((result)=>{
      if(result){
        this.authError="Please enter valid user details"
      }
      else{
        this.localCartToRemoteCart()
      }
    })
  }
  openSignUp(){
    this.showLogin=false
  }
  openLogin()
  {
    this.showLogin=true
  }
  localCartToRemoteCart(){
    let data=localStorage.getItem('localCart')
    let user =localStorage.getItem('user')
      let userId=user && JSON.parse(user).id
    if(data)
    {
      let cartDataList:product[]=JSON.parse(data)
      
      cartDataList.forEach((product:product,index)=>{
        let cartData:cart={
          ...product,
          productId:product.id,
          userId
        }
      
      delete cartData.id
      setTimeout(()=>{
        this.product.addToCart(cartData).subscribe((result)=>{
          if(result){
            console.warn("item stored in db")
          }
        })
        if(cartDataList.length===index+1){
          localStorage.removeItem('localCart')
        }
      },500)
    })
    }
    setTimeout(()=>{

    },2000)
  }
}
