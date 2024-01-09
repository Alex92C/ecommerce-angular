import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { ProductsHeaderComponent } from './components/products-header/products-header.component';
import { ProductBoxComponent } from './components/product-box/product-box.component';
import { FiltersComponent } from './components/filters/filters.component';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';
import { CartService } from '../../services/cart.service';
import { Product } from '../../models/product.model';
import { Observable, Subscription } from 'rxjs';
import { StoreService } from '../../services/store.service';
import { HttpClientModule } from '@angular/common/http';
import { ScreenSizeService } from '../../services/screen-size.service';
import { MatDrawer } from '@angular/material/sidenav';

const ROWS_HEIGHT: { [id: number]: number } = { 1: 400, 3: 335, 4: 350 };

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    MatSidenavModule,
    ProductsHeaderComponent,
    FiltersComponent,
    MatGridListModule,
    ProductBoxComponent,
    MatCardModule,
    HttpClientModule,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit, OnDestroy, AfterViewInit {
  cols = 3;
  rowHeight = ROWS_HEIGHT[this.cols];
  category: string | undefined;
  products: Array<Product> | undefined;
  sort = 'desc';
  count = '12';
  productSubscription: Subscription | undefined;
  screenSizeSubscription: Subscription | undefined;

  @ViewChild('drawer') drawer!: MatDrawer;

  constructor(
    private cartService: CartService,
    private storeService: StoreService,
    public screenSizeService: ScreenSizeService,
    private cdr: ChangeDetectorRef
  ) {}

  // drawerView: any = this.screenSizeService.isHandset$ ? 'over' : 'side';

  ngOnInit(): void {
    this.screenSizeSubscription = this.screenSizeService.isHandset$.subscribe(
      (isHandset) => {
        this.cols = isHandset ? 1 : 3;
      }
    );
    this.getProducts();
  }

  ngAfterViewInit(): void {
    this.screenSizeService.drawerToggle.subscribe(() => {
      this.drawer.toggle();
      this.cdr.detectChanges();
    });
  }

  getProducts(): void {
    this.productSubscription = this.storeService
      .getAllProducts(this.count, this.sort, this.category)
      .subscribe(
        (_products) => {
          this.products = _products;
        },
        (error) => {
          console.error(error);
        }
      );
  }

  onColumnsCountChange(colsNum: number): void {
    this.cols = colsNum;
    this.rowHeight = ROWS_HEIGHT[this.cols];
  }

  onShowCategory(newCategory: string): void {
    this.category = newCategory;
    this.getProducts();
  }

  onAddToCart(product: Product): void {
    this.cartService.addToCart({
      product: product.image,
      name: product.title,
      price: product.price,
      quantity: 1,
      id: product.id,
    });
  }

  onItemsCountChange(newCount: number): void {
    this.count = newCount.toString();
    this.getProducts();
  }

  onSortChange(newSort: string): void {
    this.sort = newSort;
    this.getProducts();
  }

  onMenuClick(): void {
    this.drawer.toggle();
  }

  ngOnDestroy(): void {
    if (this.productSubscription) {
      this.productSubscription.unsubscribe();
    }

    if (this.screenSizeSubscription) {
      this.screenSizeSubscription.unsubscribe();
    }

    this.screenSizeService.drawerToggle.unsubscribe();
  }
}
