import {Form} from "./common/Form";
import {IOrderAdress, IOrderContact} from "../types";
import {EventEmitter, IEvents} from "./base/events";
import {ensureAllElements} from "../utils/utils";


export class OrderAdress extends Form<IOrderAdress> {
    protected _paymentButtons: HTMLButtonElement[];
    
    constructor(container: HTMLFormElement, events: IEvents) {
        super(container, events);

        this._paymentButtons = ensureAllElements<HTMLButtonElement>('.button_alt', container);
        this._paymentButtons.forEach(button => {
            button.addEventListener('click', () => {
              this.payment = button.name; 
              events.emit('payment:change', button)
            });
        })
    }

    set payment(value: string) {
        //доработать реализацию - на макете кнопки, а radio !!!
    }

    set address(value: string) {
        (this.container.elements.namedItem('address') as HTMLInputElement).value = value;
    }
}


export class OrderContact extends Form<IOrderContact> {
    constructor(container: HTMLFormElement, events: IEvents) {
        super(container, events);
    }

    set phone(value: string) {
        (this.container.elements.namedItem('phone') as HTMLInputElement).value = value;
    }

    set email(value: string) {
        (this.container.elements.namedItem('email') as HTMLInputElement).value = value;
    }
}