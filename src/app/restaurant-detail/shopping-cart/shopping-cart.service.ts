
import { MenuItem } from "../menu-item/menu-item.model";
import { CartItem } from "./cart-item.model";
import {Injectable} from  '@angular/core'
import { NotificationService } from '../../shared/messages/notification.services'

@Injectable()
export class ShoppingCartService{
    items: CartItem[] = []

    constructor(private notificationService: NotificationService){}

    Clear(){
    this.items = []
    }
    addItem(item: MenuItem){
        let foundItem = this.items.find((mItem) => mItem.menuItem.id === item.id)
        if(foundItem){
            this.increaseQty(foundItem)
        }
        else{
            this.items.push(new CartItem(item))
        }
        this.notificationService.notify(`Voce adicionou um item ${item.name}`)
    }
    removeItem(item: CartItem){
        this.items.splice(this.items.indexOf(item),1)

        this.notificationService.notify(`Voce adicionou um item ${item.menuItem.name}`)
    }
    total(): number{
        return this.items
                .map(item => item.value())
                .reduce((prev,value) => prev+value,0)
    }

    increaseQty(item: CartItem){
        item.quantity = item.quantity + 1
    }

    decreaseQty(item: CartItem){
        item.quantity = item.quantity - 1
        if(item.quantity === 0){
            this.removeItem(item)
        }
    }
}