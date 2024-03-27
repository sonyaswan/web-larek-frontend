import {Form} from "./common/Form";
import {IOrderAdress, IOrderContact} from "../types";
import {EventEmitter, IEvents} from "./base/Events";
import {ensureAllElements, ensureElement} from "../utils/utils";


export class OrderAdress extends Form<IOrderAdress> {
    protected _paymentButtons: HTMLButtonElement[];
    protected _adressInput: HTMLInputElement;

    constructor(container: HTMLFormElement, events: IEvents) {
        super(container, events);

        this._paymentButtons = ensureAllElements<HTMLButtonElement>('.button_alt', container);
        this._adressInput = container.querySelector('input[name="address"]');

        this._paymentButtons.forEach(button => {
            button.addEventListener('click', () => {
              this.payment = button.name; 
              events.emit('payment:change', button)
            });
        })
    }

    set payment(value: string) {
        this._paymentButtons.forEach(button => {
            this.toggleClass(button, 'button_alt-active', button.name === value);
          });
    }

    set address(value: string) {
        this._adressInput.value = value;
    }
}


export class OrderContact extends Form<IOrderContact> {
    protected _phoneInput: HTMLInputElement;
    protected _emailInput: HTMLInputElement;

    constructor(container: HTMLFormElement, events: IEvents) {
        super(container, events);

        this._phoneInput = container.querySelector('input[name="phone"]');
        this._emailInput = container.querySelector('input[name="email"]');
    }

    set phone(value: string) {
        this._phoneInput.value = value;
    }

    set email(value: string) {
        this._emailInput.value = value;
    }
}