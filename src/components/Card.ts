import {Component} from "./base/Component";
import {ProductStatus, ILot, LotStatus} from "../types";
import {bem, createElement, ensureElement, formatNumber} from "../utils/utils";
import clsx from "clsx";

interface ICardActions {
    onClick: (event: MouseEvent) => void;
}

export interface ICard {
  id: string;
  title: string;
  price: number | null
  image: string;
  category: ProductStatus;
  description: string;
}

export class Card<T> extends Component<ICard> {
  protected _title: HTMLElement;
  protected _price: HTMLElement;


  constructor(protected blockName: string, container: HTMLElement) {
      super(container);

      this._title = ensureElement<HTMLElement>(`.${blockName}__title`, container);
      this._price = ensureElement<HTMLElement>(`.${blockName}__price`, container);
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
    this.setText(this._price, formatNumber(value));
  }

}

export class CardView extends Card<true> {
  protected _image: HTMLImageElement;
  protected _category: HTMLElement;


  constructor(protected blockName: string, container: HTMLElement, actions?: ICardActions) {
      super(blockName, container);

      this._image = ensureElement<HTMLImageElement>(`.${blockName}__image`, container);
      this._category = ensureElement<HTMLElement>(`.${blockName}__category`, container);
      if (actions?.onClick) {
        container.addEventListener('click', actions.onClick);
      }
  }

  set image(value: string) {
    this.setImage(this._image, value, this.title)
  }

  set category(value: string) {
    const categoryClass = <Record<string, string>> {
      'софт-скил': 'soft',
      'хард-скил': 'hard',
      'кнопка': 'button',
      'другое': 'other',
      'дополнительное': 'additional'
    }
    this.setText(this._category, value);
    this._category.className = bem(this.blockName, 'category', categoryClass[value]).name;
  }
}

export class CardPreview extends CardView {
  protected _description: HTMLElement;
  protected _button: HTMLButtonElement;


  constructor(protected blockName: string, container: HTMLElement, actions?: ICardActions) {
      super(blockName, container);

      this._category = ensureElement<HTMLElement>(`.${blockName}__description`, container);
      if (actions?.onClick) {
        container.addEventListener('click', actions.onClick);
      }
  }

  set image(value: string) {
    this.setImage(this._image, value, this.title)
  }

  set category(value: string) {
    const categoryClass = <Record<string, string>> {
      'софт-скил': 'soft',
      'хард-скил': 'hard',
      'кнопка': 'button',
      'другое': 'other',
      'дополнительное': 'additional'
    }
    this.setText(this._category, value);
    this._category.className = bem(this.blockName, 'category', categoryClass[value]).name;
  }
}