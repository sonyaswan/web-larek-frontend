import {Model} from "./base/Model";
import {productId, ProductStatus, IProductItem, IOrder, IAppState, IOrderForm, FormErrors} from "../types";

export type CatalogChangeEvent = {
  catalog: ProductModel[]
};

export class ProductModel extends Model<IProductItem> {
  id: productId;
  description: string;
  image: string;
  title: string;
  category: ProductStatus;
  price: number | null
}

export class AppState extends Model<IAppState> {
  basket: Set<productId> = new Set();
  catalog: ProductModel[];
  loading: boolean;
  order: IOrder = {
    payment: 'card',
    email: '',
    phone: '',
    address: '',
    items: [],
    total: 0
  };
  preview: productId | null;
  formErrors: FormErrors = {};


  clearBasket() {
    //очищает корзину
    this.basket.clear();
  }

  clearOrder() {
    //очищает заказ
    this.order = {
      payment: 'card',
      email: '',
      phone: '',
      address: '',
      items: [],
      total: 0
    };
  }

  addToBasket(product: ProductModel) {
    //добавляет объект в корзину
    this.basket.add(product.id);
  }

  removeFromBasket(product: ProductModel) {
    //убирает объект из корзины
    this.basket.delete(product.id);
  }

  getStatusBasket(): number {
    //вычисляет количество продуктов в корзине
    return this.basket.size;
  }

  getProductsFromBasket(): ProductModel[] {
    //возвращает список продуктов из корзины с описанием
    let selectedProducts: ProductModel[] = [];
    this.basket.forEach(item => {
      selectedProducts.push(this.catalog.find(product => product.id === item))
    })
    return selectedProducts;
  }

  getProductStatus(id: string): boolean {
    //проверяет, есть ли препарат с указанным id в корзине
    return this.basket.has(id);
  }

  getTotal(): number {
    //вычисляет стоимость всего заказа
    let totalSum = 0;
    this.basket.forEach(item => {
      totalSum += this.catalog.find(product => product.id === item).price
    })

    return totalSum;
  }

  setCatalog(items: IProductItem[]) {
    //заполнить данные каталога
      this.catalog = items.map(item => new ProductModel(item, this.events));
      this.emitChanges('items:changed', { catalog: this.catalog });
  }

  setPreview(item: ProductModel) {
    //заполнить данные превью
      this.preview = item.id;
      this.emitChanges('preview:open', item);
  }

  clearPreview() {
    //очистить данные превью
    this.preview = '';
  }

  setOrderField(field: keyof IOrderForm, value: string, step: number) {
    //заполнить данные типа оплаты и адреса
      this.order[field] = value;
      if (step === 1 && this.validateOrder(step)) {
        this.events.emit('order:ready', this.order);
      } 
      else if (step === 2 && this.validateOrder(step)) {
        this.order.total = this.getTotal();
        this.order.items = [...this.basket].filter((item) => {
          //для мамки выдает ошибку при пост запросе: "товар не продается", поэтому отбираются только товары с ценами
          const price = this.catalog.find(product => product.id === item).price;
          return price > 0;
        });
        this.events.emit('order:ready', this.order);
      }
  }

  validateOrder(step: number) {
    //проверить поля заказа 
      const errors: typeof this.formErrors = {};

      if (step === 1) {
        if (!this.order.address) {
          errors.address = 'Необходимо указать адрес';
        }
      }

      else if (step === 2) {
        if (!this.order.email) {
            errors.email = 'Необходимо указать email';
        }
        if (!this.order.phone) {
            errors.phone = 'Необходимо указать телефон';
        }
      }

      this.formErrors = errors;
      this.events.emit('formErrors:change', this.formErrors);
      return Object.keys(errors).length === 0;
  }
}

