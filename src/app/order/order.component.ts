import { Component, OnInit } from '@angular/core';

import {FormGroup, FormBuilder, Validators, AbstractControl} from '@angular/forms'

import { RadioOption } from 'app/shared/radio/radioOption.model'
import { OrderService } from 'app/restaurant-detail/order.services';
import { CartItem } from 'app/restaurant-detail/shopping-cart/cart-item.model';
import {OrderItem, Order} from './order.model'
import {Router} from '@angular/router'
@Component({
  selector: 'mt-order',
  templateUrl: './order.component.html'
})
export class OrderComponent implements OnInit {

  orderForm: FormGroup

  delivery: number = 8

  paymentOptions: RadioOption[] = [
    {label:'Dinheiro',value: 'NOM'},
    {label:'Cartão de Débito',value: 'DEB'},
    {label:'Cartão Refeição',value: 'REF'}
  ]
  constructor(private orderService: OrderService, private router: Router,
    private formBulider: FormBuilder) { }

    emailPattern = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i

    numberPattern = /^[0-9]*$/

  ngOnInit() {
    this.orderForm = this.formBulider.group({
      name:this.formBulider.control('',[Validators.required,Validators.minLength(5)] ),
      email:this.formBulider.control('',[Validators.required,Validators.pattern(this.emailPattern)]),
      emailConfirmation:this.formBulider.control('',[Validators.required,Validators.pattern(this.emailPattern)]),
      address:this.formBulider.control('',[Validators.required,Validators.minLength(5)]),
      numero:this.formBulider.control('',[Validators.required,Validators.pattern(this.numberPattern)]),
      optionalAddress:this.formBulider.control(''),
      paymentOption:this.formBulider.control('',[Validators.required])
    },{validator: OrderComponent.equalsTo})
  }
 static equalsTo(group: AbstractControl): {[key:string]: boolean}{
   const email = group.get('email')
   const emailConfirmation = group.get('emailConfirmation')
   if(!email || !emailConfirmation){
     return undefined
   }

   if(email.value !== emailConfirmation.value){
    return {emailsNoMatch: true}
   }

   return undefined 
 }
  itemsValue(): number{
    return this.orderService.itemsValue()
  }

  cartItems(): CartItem[]{
    return this.orderService.cartItems()
  }

  increaseQty(item: CartItem){
    this.orderService.increaseQty(item)
  }

  decreaseQty(item: CartItem){
    this.orderService.decreaseQty(item)
  }

  remove(item: CartItem){
    this.orderService.remove(item)
  }
  
  
  checkOrder(order: Order){
    order.orderItems = this.cartItems()
      .map((item:CartItem)=> new OrderItem(item.quantity,item.menuItem.id))
  this.orderService.checkOrder(order).subscribe((orderId: string) =>{
    this.router.navigate(['/sumary'])
    this.orderService.clear()
  }) 
    console.log(order)
  }

}
