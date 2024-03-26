export type ProductStatus = 'софт-скил' | 'хард-скил' | 'кнопка' | 'другое' | 'дополнительное';

export type productId = string;

export interface IProductItem {
  id: productId;
  description: string;
  image: string;
  title: string;
  category: ProductStatus;
  price: number | null
};


export interface IOrderAdress {
  payment: string;
  address: string
};

export interface IOrderContact {
  email: string;
  phone: string
};

export type IOrderForm = IOrderAdress & IOrderContact;

export interface IOrder extends IOrderForm {
  items: productId[];
  total: number
};

export type FormErrors = Partial<Record<keyof IOrder, string>>;

export interface IOrderResult {
  id: string;
  total: number
};

export interface IAppState {
  catalog: IProductItem[];
  basket: productId[];
  preview: productId | null;
  order: IOrder | null;
  loading: boolean;
};