import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatBadgeModule } from '@angular/material/badge';
import { Cart, CartItem } from '../../models/cart.model';
import { CartService } from '../../services/cart.service';
import { ScreenSizeService } from '../../services/screen-size.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatToolbarModule,
    MatIconModule,
    MatIconModule,
    MatMenuModule,
    MatBadgeModule,
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent {
  private _cart: Cart = { items: [] };
  itemsQuantity = 0;

  @Output() menuClick = new EventEmitter<void>();

  @Input()
  get cart(): Cart {
    return this._cart;
  }

  // check this code later

  set cart(cart: Cart) {
    this._cart = cart;
    this.itemsQuantity = cart.items.reduce(
      (acc, item) => acc + item.quantity,
      0
    );
  }

  // isHandset$: Observable<boolean> = this.breakpointObserver
  //   .observe(Breakpoints.Handset)
  //   .pipe(map((result) => result.matches));

  // private breakpointObserver: BreakpointObserver

  constructor(
    private cartService: CartService,
    public screenSizeService: ScreenSizeService
  ) {}

  getTotal(items: Array<CartItem>): number {
    return this.cartService.getTotal(items);
  }

  onClearCart(): void {
    this.cartService.clearCart();
  }

  menuClicked(): void {
    this.screenSizeService.drawerToggle.next(true);
  }
}
