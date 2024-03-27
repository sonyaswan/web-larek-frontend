import {Component} from "./base/Component";
import {ProductStatus, IProductItem} from "../types";
import {bem, createElement, ensureElement, formatNumber} from "../utils/utils";


interface ICardActions {
    onClick: (event: MouseEvent) => void;
}

export interface ICard {
  id: string;
  title: string;
  price: number | null
  image?: string;
  category?: ProductStatus;
  description?: string;
  index?: number;
  selected?: boolean;
}

//общее
export class Card<T> extends Component<ICard> {
  protected _title: HTMLElement;
  protected _price: HTMLElement;
  protected _image?: HTMLImageElement;
  protected _category?: HTMLElement;
  protected _description?: HTMLElement;
  protected _categoryColor = <Record<string, string>> {
    "софт-скил": "soft",
    "другое": "other",
    "дополнительное": "additional",
    "кнопка": "button",
    "хард-скил": "hard"
  };

  constructor(protected blockName: string, container: HTMLElement) {
      super(container);
      this._title = ensureElement<HTMLElement>(`.${blockName}__title`, container);
      this._price = ensureElement<HTMLElement>(`.${blockName}__price`, container);
      this._image = container.querySelector(`.${blockName}__image`);
      this._category = container.querySelector(`.${blockName}__category`);
      
  }

  set id(value: string) {
      this.container.dataset.id = value;
  }

  get id(): string {
      return this.container.dataset.id || '';
  }

  set title(value: string) {
      this.setText(this._title, value);
  }

  set price(value: number | null) {
    this.setText(this._price, 
                value ? `${formatNumber(value)}  синапсов` : 'Бесценно');
  }

  set image(value: string) {
    this.setImage(this._image, value, this.title)
  }

  set category(value: string) {
    this.setText(this._category, value);
    this._category.className = `${bem(this.blockName, 'category').name} ${bem(this.blockName, 'category', this._categoryColor[value]).name}`
  }

}

//представление в списке (каталоге)
export class CatalogCard extends Card<HTMLElement> {
  constructor(protected blockName: string, container: HTMLElement, actions?: ICardActions) {
    super(blockName, container);
    if (actions?.onClick) {
          container.addEventListener('click', actions.onClick);
    }
  }
}

//представление в модалке превью
export class PreviewCard extends Card<HTMLElement> {
  protected _button: HTMLButtonElement;

  constructor(protected blockName: string, container: HTMLElement, actions?: ICardActions) {
    super(blockName, container);
    this._description = ensureElement<HTMLElement>(`.${blockName}__text`, container);
    this._button = container.querySelector(`.${blockName}__button`);
    if (actions?.onClick) {
      this._button.addEventListener('click', actions.onClick);
    }
  }
  
  set description(value: string) {
    this.setText(this._description, value);
  }

  set selected(value: boolean) {
    this.setDisabled(this._button, value)
    this.setText(this._button, value ? "Уже в корзине" : "Купить");
  }

}

//представление в корзине
export class BasketCard extends Card<HTMLElement> {
  protected _buttonDelete: HTMLButtonElement;
  protected _index: HTMLElement;

  constructor(container: HTMLElement, actions?: ICardActions) {
    super("card", container);
    this._buttonDelete = container.querySelector(`.basket__item-delete`);
    this._index = container.querySelector(`.basket__item-index`);
    if (actions?.onClick) {
      this._buttonDelete.addEventListener('click', actions.onClick);
    }
  }

  set index(value: number) {
    this.setText(this._index, value);
  }
}
