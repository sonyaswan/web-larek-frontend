import {Model} from "./base/Model";
import {productId, ProductStatus, IProductItem, paymentType, IOrder, IAppState, IOrderForm, FormErrors} from "../types";


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
    payment: 'online',
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
      payment: 'online',
      email: '',
      phone: '',
      address: '',
      items: [],
      total: 0
    };
  }

  addToBasket(id: productId) {
    //добавляет объект в корзину
    this.basket.add(id);
  }

  removeFromBasket(id: productId) {
    //убирает объект из корзины
    this.basket.delete(id);
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
      this.emitChanges('preview:changed', item);
  }


  setOrderField(field: keyof IOrderForm, value: paymentType & string, step: number) {
    //заполнить данные заказа
      this.order[field] = value;

      if (step === 2 && this.validateOrder(step)) {
        this.order.total = this.getTotal();
        this.order.items = [...this.basket]
        this.events.emit('order:ready', this.order);
      }
  }

  validateOrder(step: number) {
    //проверить поля заказа (нужна ли проверка выбора типа оплаты???)
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

