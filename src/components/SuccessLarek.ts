import {Component} from "./base/Component";
import {ensureElement} from "./../utils/utils";
import {Success, ISuccessActions} from "../components/common/Success";

export class SuccessLarek extends Success {
    protected _total: HTMLElement;

	constructor(container: HTMLElement, actions: ISuccessActions) {
		super(container, ".order-success__close", actions);

		this._total = ensureElement<HTMLElement>('.order-success__description',this.container);

		if (actions?.onClick) {
			this._close.addEventListener('click', actions.onClick);
		}
	}

	set total(total: number) {
		this.setText(this._total, `Списано ${total} синапсов`);
	}
}