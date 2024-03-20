import { Api, ApiListResponse } from './base/api';
import {IProductItem, IOrder, IOrderResult} from "../types";


export class WebLarekAPI extends Api {
  readonly cdn: string;

  constructor(cdn: string, baseUrl: string, options?: RequestInit) {
      super(baseUrl, options);
      this.cdn = cdn;
  }

  //получение списка товаров
  getProductList(): Promise<IProductItem[]> {
    return this.get('/product').then((data: ApiListResponse<IProductItem>) =>
        data.items.map((item) => ({
            ...item,
            image: this.cdn + item.image
        }))
    );
}

  //получение информации по одному товару по id
  getProductItem(id: string): Promise<IProductItem> {
      return this.get(`/product/${id}`).then(
          (item: IProductItem) => ({
              ...item,
              image: this.cdn + item.image,
          })
      );
  }

  //размещение заказа
  orderProducts(order: IOrder): Promise<IOrderResult> {
      return this.post('/order', order).then(
          (data: IOrderResult) => data
      );
  }

}