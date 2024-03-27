import './scss/styles.scss';

import './scss/styles.scss';

import {WebLarekAPI} from "./components/WebLarekAPI";
import {API_URL, CDN_URL} from "./utils/constants";
import {EventEmitter} from "./components/base/Events";
import {AppState, ProductModel, CatalogChangeEvent} from "./components/AppData";
import {Page} from "./components/Page";
import {ICard, Card, CatalogCard, PreviewCard, BasketCard} from "./components/Card";
import {cloneTemplate, createElement, ensureElement} from "./utils/utils";
import {Modal} from "./components/common/Modal";
import {Basket} from "./components/Basket";
import {IOrderForm} from "./types";
import {OrderAdress, OrderContact} from "./components/Order";
import {Success} from "./components/Success";


const events = new EventEmitter();
const api = new WebLarekAPI(CDN_URL, API_URL);

// Чтобы мониторить все события, для отладки
events.onAll(({ eventName, data }) => {
    console.log(eventName, data);
})

// Все шаблоны
const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const orderAdressTemplate = ensureElement<HTMLTemplateElement>('#order');
const orderContactTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');

// Модель данных приложения
const appData = new AppState({}, events);

// Глобальные контейнеры
const page = new Page(document.body, events);
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);

// Переиспользуемые части интерфейса
const basket = new Basket(cloneTemplate(basketTemplate), events);
const orderAdress = new OrderAdress(cloneTemplate(orderAdressTemplate), events);
const orderContact= new OrderContact(cloneTemplate(orderContactTemplate), events);
const success = new Success(cloneTemplate(successTemplate), events);

// Дальше идет бизнес-логика
// Поймали событие, сделали что нужно

// Изменились элементы каталога
events.on<CatalogChangeEvent>('items:changed', () => {
    page.catalog = appData.catalog.map(item => {
        const card = new CatalogCard("card", cloneTemplate(cardCatalogTemplate), {
            onClick: () => events.emit('card:select', item)
        });
        return card.render({
            title: item.title,
            image: item.image,
            category: item.category,
            price: item.price
        });
    });

    page.counter = appData.getStatusBasket();
});

//  установить открываемую карточку товара
events.on('card:select', (item: ProductModel) => {
    appData.setPreview(item);
});

//  открыть выбранную карточку товара
events.on('preview:open', (item: ProductModel) => {
    const card = new PreviewCard("card", cloneTemplate(cardPreviewTemplate), {
            onClick: () => events.emit('product:buy', item)
        });
    modal.render({
        content: card.render({
            title: item.title,
            image: item.image,
            description: item.description,
            price: item.price,
            category: item.category,
            selected: appData.getProductStatus(item.id)
        })
    });
    
    appData.clearPreview();
});

// добавление продукта в корзину, обновление статуса корзины
events.on('product:buy', (item: ProductModel) => {
    appData.addToBasket(item);
    page.counter = appData.getStatusBasket();
    modal.close();
})

// отрисовка карточек в корзине и итога корзины
function renderBasketCards() {
    
    basket.total = appData.getTotal();
    basket.selected = appData.getTotal(); //appData.getStatusBasket(); - если только мамка добавлена - заказ сделать нельзя
    let i = 0;
    basket.items = appData.getProductsFromBasket().map((item) => {
        const card = new BasketCard(cloneTemplate(cardBasketTemplate) , {
            onClick: () => events.emit('product:delete', item)
        });

        i++;

        return card.render({
            title: item.title,
            price: item.price,
            index: i
            });
    })
}

// открытие корзины
events.on('basket:open', () => {
    renderBasketCards();

    modal.render({
        content: basket.render()
    })
})

//удаление продукта из корзины
events.on('product:delete', (item: ProductModel) => {
    appData.removeFromBasket(item);
    page.counter = appData.getStatusBasket();
    renderBasketCards();
    
    modal.render({
        content: basket.render()
    })
})

// открыть форму заказа - 1-й шаг: форма оплаты и адрес
events.on('order:start', () => {
    modal.render({
        content: orderAdress.render({
			payment: 'card',
			address: '',
			valid: false,
			errors: [],
        })
    });
});

events.on('payment:change', (item: HTMLButtonElement) => {
    appData.order.payment = item.name;
})

//изменение полей формы первого шага заказа (в данном случае только адрес) и установка этих значений
events.on(/^order\..*:change/, (data: { field: keyof IOrderForm, value: string }) => {
    appData.setOrderField(data.field, data.value, 1);
  });

//открыть форму заказа - 2-й шаг: контактная информация
events.on('order:submit', () => {
    modal.render({
      content: orderContact.render({
        email: '',
        phone: '',
        valid: false,
        errors: []
      })
    });
})

//изменение полей формы второго шага заказа (почта и телефон) и установка этих значений
events.on(/^contacts\..*:change/, (data: { field: keyof IOrderForm, value: string }) => {
    appData.setOrderField(data.field, data.value, 2);
  });

// валидация обеих форм
events.on('formErrors:change', (errors: Partial<IOrderForm>) => {
    const { email, phone, address } = errors;
    orderAdress.valid = !address;
    orderContact.valid = !email && !phone;
    orderAdress.errors = Object.values({address}).filter(i => !!i).join('; ');
    orderContact.errors = Object.values({phone, email}).filter(i => !!i).join('; ');
})

//контакты заполнены, отправка данных заказа на сервер и открытие модального окна успешного заказа
events.on('contacts:submit', () => {
    //console.log(appData.order)
    api.orderProducts(appData.order)
    .then((result) => {

        success.total = appData.getTotal();
        appData.clearBasket();
        page.counter = 0;

        modal.render({
            content: success.render({})
        });
    })
    .catch(err => {
        console.error(err);
    });
});

//закрытие окна успешного заказа
events.on('success:close', () => {
    modal.close();
});


// Блокируем прокрутку страницы если открыта модалка
events.on('modal:open', () => {
    page.locked = true;
});

// ... и разблокируем
events.on('modal:close', () => {
    page.locked = false;
});

// Получаем лоты с сервера
api.getProductList()
    .then(appData.setCatalog.bind(appData))
    .catch(console.error);