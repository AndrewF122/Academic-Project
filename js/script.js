'use strict'

window.addEventListener('DOMContentLoaded', () => {
    //tabs
    const tabs = document.querySelectorAll('.tabheader__item'),
        tabsContent = document.querySelectorAll(".tabcontent"),
        tabsParent = document.querySelector(".tabheader__items");


    function hideTabContent() {
        tabsContent.forEach((item, i) => {

            item.classList.remove("show");
            item.classList.add("hide", "fade");
        });
        tabs.forEach((item) => {
            item.classList.remove("tabheader__item_active");
        })
    }

    function showTabContent(i = 0) {

        tabsContent[i].classList.remove('hide');
        tabsContent[i].classList.add('show', 'fade');
        tabs[i].classList.add("tabheader__item_active");
    }
    hideTabContent();
    showTabContent();

    tabsParent.addEventListener('click', (event) => {
        const target = event.target;
        if (target && target.classList.contains("tabheader__item")) {
            tabs.forEach((item, i) => {
                if (target == item) {
                    hideTabContent();
                    showTabContent(i);
                }
            });
        }
    })

    //timer
    const deadline = new Date('2023-10-20');
    function getTimeRemaining(endtime) {
        const now = new Date();
        const remaining = Date.parse(endtime) - Date.parse(now),
            days = Math.floor(remaining / (1000 * 60 * 60 * 24)),
            hours = Math.floor(remaining / (1000 * 60 * 60) % 24),
            minutes = Math.floor(remaining / (1000 * 60) % 60),
            seconds = Math.floor((remaining / 1000) % 60);
        return {
            remaining,
            days,
            hours,
            minutes,
            seconds
        }
    }

    function setDate(selector, endtime) {
        const Parent = document.querySelector(selector);
        const days = Parent.querySelector('#days'),
            hours = Parent.querySelector('#hours'),
            minutes = Parent.querySelector('#minutes'),
            seconds = Parent.querySelector('#seconds');
        function inputHTML() {

            const remaining = getTimeRemaining(endtime);
            if (remaining.remaining >= 0) {
                days.innerHTML = getZero(remaining.days);
                hours.innerHTML = getZero(remaining.hours);
                minutes.innerHTML = getZero(remaining.minutes);
                seconds.innerHTML = getZero(remaining.seconds);
            } else {
                clearInterval(start);
            }
        }

        inputHTML();
        const start = setInterval(inputHTML, 1000);


    }
    function getZero(num) {
        if (num >= 0 && num <= 9) {
            return `0${num}`;
        }
        else {
            return num
        }
    }
    setDate(".timer", deadline);


    //модальные окна

    /*Задача на рефакторинг: 
    1) если нажал Esc - модальное окно закрывается.
    2) делегировать событие в модальном окне на крестик
    3) сделать реализацию исключительно css классами, без инлайн-стилей
    */
    // const modal = document.querySelector(".modal");
    // const modalBtns = document.querySelectorAll('[data-modal]');
    // const modalCloseElement = document.querySelector('[data-close]');


    // function showModal (){
    //     modal.style.display = 'block';
    // }
    // function hideModal(){
    //     modal.style.display = 'none';
    // }

    // modalBtns.forEach((item)=>{
    //     item.addEventListener('click',showModal);
    // });
    // modalCloseElement.addEventListener('click', hideModal);
    /*===========================================================================*/

    const modal = document.querySelector(".modal");
    const modalBtns = document.querySelectorAll('[data-modal]');
    const modalCloseElement = document.querySelector('[data-close]');

    function showModal() {
        modal.classList.remove('hide');
        modal.classList.add('show');
        document.body.style.overflow = 'hidden';
        clearTimeout(showModalByTime);
    }
    function hideModal() {
        modal.classList.remove('show');
        modal.classList.add('hide');
        document.body.style.overflow = '';

    }
    modalBtns.forEach((item) => {
        item.addEventListener('click', showModal);
    });
    modal.addEventListener('click', (e) => {
        if (e.target === modalCloseElement || e.target === modal || e.target.getAttribute('data-close') == '') {
            hideModal();
        }
    });


    document.addEventListener('keydown', (e) => {
        if (e.code === "Escape" && modal.classList.contains('show')) {
            hideModal();
        }
    });

    /*Доработка модального окна
    1) Появление модального окна через какое-то время.
    2) Появление модального окна когда мы докрутили до низу страницы.
    */

    const showModalByTime = setTimeout(showModal, 50000);


    function showModalByScroll() {
        if (document.documentElement.scrollHeight <= document.documentElement.scrollTop + document.documentElement.clientHeight) {
            showModal();
            window.removeEventListener('scroll', showModalByScroll);
        }
    }
    window.addEventListener('scroll', showModalByScroll);

    /*
    to do list:
    1)сделать класс для меню
    */
    // class MenuItem {
    //     constructor(imgURL, menuName, description, price) {
    //         this.imgURL = imgURL;
    //         this.menuName = menuName;
    //         this.description = description;
    //         this.price = price;
    //         this.MenuElement;
    //     }

    //     createMenuItem() {
    //         const MenuItemElement = document.createElement('div');
    //         MenuItemElement.classList.add('menu__item');
    //         this.MenuElement = MenuItemElement;
    //     }
    //     createImg() {
    //         this.MenuElement.innerHTML = `<img src="${this.imgURL}">`;
    //     }
    //     createTitle() {
    //         this.MenuElement.innerHTML += `<h3 class="menu__item-subtitle">${this.menuName}</h3>`;
    //     }
    //     createDescription() {
    //         this.MenuElement.innerHTML += `<div class="menu__item-descr">${this.description}</div>`
    //     }
    //     createPrice() {
    //         this.MenuElement.innerHTML += `                    <div class="menu__item-divider"></div>
    //         <div class="menu__item-price">
    //             <div class="menu__item-cost">Цена:</div>
    //             <div class="menu__item-total"><span>${this.price}</span> грн/день</div>`
    //     }
    //     init(parent) {
    //         this.createMenuItem();
    //         this.createImg();
    //         this.createTitle();
    //         this.createDescription();
    //         this.createPrice();
    //         parent.append(this.MenuElement);
    //     }

    // }

    // const firstMenuItem = new MenuItem('img/slider/pepper.jpg', "ПЕРЕЦ", 'ПЕРЕЦ КРАСНЫЙ', '1337')
    // firstMenuItem.init(document.querySelector(".menu__field>.container"));



    /*===============================================================================*/


    /*Задача на рефакторинг кода
    1) В первом решении есть много функций, которые поочерёдно записываются в свойство MenuElement
    экземпляра класса. Надо кучу функций одним методом.
    2) Добавить функционал с рест-оператором, где перечисляются классы, которые добавляет в главный объект.
    P.s. предусмотреть классы по-умолчанию, если в создании экземпляра объекта мы его не предали.
    
    */
    class MenuItem {
        constructor(imgURL, alt, menuName, description, price, parentSelector, ...classes) {
            this.imgURL = imgURL;
            this.alt = alt;
            this.menuName = menuName;
            this.description = description;
            this.price = price;
            this.parent = document.querySelector(parentSelector);
            this.classes = classes;
            this.transfer = 37
        }


        render() {
            const MenuItemElement = document.createElement('div');
            if (this.classes.length === 0) {
                this.classes = 'menu__item';
                MenuItemElement.classList.add(this.classes);
            }
            else {
                this.classes.forEach((classItem) => MenuItemElement.classList.add(classItem));
            }

            MenuItemElement.innerHTML = `
            <img src="${this.imgURL}" alt="${this.alt}">
            <h3 class="menu__item-subtitle">${this.menuName}"</h3>
            <div class="menu__item-descr">${this.description}</div>
            <div class="menu__item-divider"></div>
            <div class="menu__item-price">
                <div class="menu__item-cost">Цена:</div>
                <div class="menu__item-total"><span>${this.price}</span> грн/день</div>
            </div>
            `

            this.parent.append(MenuItemElement);
        }

    }

    new MenuItem('img/tabs/vegy.jpg',
        'veg',
        'Жир',
        'Покупай, налетай',
        '1337',
        '.menu__field .container',
        'menu__item'
    ).render();
    /*===========Реализация отправки данных на сервер========= */
    const formFeedBack = {
        loading: 'img/form/spinner.svg',
        success: 'Ваши данные успешно отправлены',
        error: 'Что-то пошло не так'
    }
    const forms = document.querySelectorAll('form');

    forms.forEach(item => {
        item.addEventListener('submit', (e) => {
            e.preventDefault();
            callMeBack(item);
        });
    })


    function callMeBack(form) {
        //оповещение пользователя
        const message = document.createElement('img');
        form.insertAdjacentElement('afterend', message);
        message.src = formFeedBack.loading;
        message.style.cssText = `
            display:block;
            margin: 0 auto;
        `;
        //создание  json объекта с формы для отправки
        const formData = new FormData(form);
        let obj = {};
        formData.forEach((value, key) => {
            obj[key] = value;
        });
        const json = JSON.stringify(obj);


        //создание запроса
        fetch('server1.php', {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            body: json
        }).then(data => { return data.text() })
            .then(data => {
                console.log(data);

                showThanksModal(formFeedBack.success);
                form.reset();
                message.remove();

            }).catch(() => {
                showThanksModal(formFeedBack.error);
                console.log('error');
                message.remove();
            }).finally(() => {
                form.reset();
            });



        //когда запрос выполнился, так же оповещаем пользователя
        // request.addEventListener('load', () => {
        //     if (request.status === 200) {

        //         console.log(request.response);

        //         showThanksModal(formFeedBack.success);
        //         form.reset();
        //         message.remove();
        //     } else {
        //         showThanksModal(formFeedBack.error);
        //         console.log('error');
        //         message.remove();
        //     }
        // });
    }


    function showThanksModal(message) {
        const prevModalDialog = document.querySelector('.modal__dialog');
        prevModalDialog.classList.add('hide');
        showModal();
        const ThanksModal = document.createElement('div');
        ThanksModal.classList.add('modal__dialog');
        ThanksModal.innerHTML = `
            <div class = "modal__content">
                <div class="modal__title">${message}</div>
                <div data-close class="modal__close">&times;</div>
            </div>
        `;
        // modal.append(ThanksModal);
        document.querySelector('.modal').append(ThanksModal);
        setTimeout(() => {
            ThanksModal.remove();
            prevModalDialog.classList.add('show');
            prevModalDialog.classList.remove('hide');
            hideModal();
        }, 4000);
    }

    // showThanksModal(formFeedBack.success);
    fetch('https://jsonplaceholder.typicode.com/posts', {
        method: 'POST',
        body: JSON.stringify({ name: "Alex" }),
        headers: {
            'Content-type': 'application/json'
        }
    })
        .then(response => response.json())
    // .then(json => console.log(json));



    fetch('http://localhost:3000/menu')
        .then(data => data.json())
        .then(res => console.log(res));
});



