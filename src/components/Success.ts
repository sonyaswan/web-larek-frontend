import {Component} from "./base/Component";
import {ensureElement} from "../utils/utils";
import {EventEmitter, IEvents} from "./base/Events";

export interface ISuccess {
    total: number;
}

export class Success extends Component<ISuccess> {
    protected _close: HTMLElement;
    protected _total: HTMLElement;

    constructor(container: HTMLElement, events: IEvents) {
        super(container);

        this._close = ensureElement<HTMLElement>(".order-success__close", this.container);
        this._total = ensureElement<HTMLElement>('.order-success__description',this.container);

        this._close.addEventListener('click', () => { 
            events.emit('success:close')
        });

    }

    set total(total: number) {
		this.setText(this._total, `Списано ${total} синапсов`);
	}
}