import {Component} from "../base/Component";
import {ensureElement} from "../../utils/utils";

export interface ISuccess {
    total: number;
}

export interface ISuccessActions {
    onClick: () => void;
}

export class Success extends Component<ISuccess> {
    protected _close: HTMLElement;

    constructor(container: HTMLElement, closeClass: string, actions: ISuccessActions) {
        super(container);

        this._close = ensureElement<HTMLElement>(closeClass, this.container);

        if (actions?.onClick) {
            this._close.addEventListener('click', actions.onClick);
        }
    }
}