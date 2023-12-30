import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ProductService } from '../services/product.service';
import { product } from '../data-type';
import { NgFor } from '@angular/common';
@Component({
  selector: 'app-search',
  standalone: true,
  imports: [NgFor,RouterLink],
  templateUrl: './search.component.html',
  styleUrl: './search.component.css'
})
export class SearchComponent implements OnInit {
  searchResult:undefined| product[]
  constructor(private activateRoute:ActivatedRoute, private product:ProductService) { }
   
  ngOnInit(): void {
    let query =this.activateRoute.snapshot.paramMap.get('query')
    query && this.product.searchProducts(query).subscribe((result)=>{
      this.searchResult=result
      console.warn(result)
    })
  }

}
