/**
 * Created by chaika on 02.02.16.
 */
var Templates = require('../Templates');
var Storage = require('../storage/Storage');

//Перелік розмірів піци
var PizzaSize = {
    Big: "big_size",
    Small: "small_size"
};

//Змінна в якій зберігаються перелік піц в кошику
var Cart = [];

//HTML елемент куди будуть додаватися піци
var $cart = $(".order-list");

function addToCart(pizza, size) {
    //Додавання однієї піци в кошик покупок
    //Приклад реалізації, можна робити будь-яким іншим способо
    var excistenPizza = pizza_excist(pizza, size);
    if (excistenPizza) {
        excistenPizza["quantity"]++;
    } else {
        Cart.push({
            pizza: pizza,
            size: size,
            quantity: 1
        });
    }
    //Оновити вміст кошика на сторінці
    updateCart();
}

function pizza_excist(pizza, size) {
    var bool;
    Cart.forEach(function(pizzaInCart){
        if(pizzaInCart["pizza"]["id"] === pizza["id"] && pizzaInCart["size"] === size)
            bool = pizzaInCart;
    });
    return bool;
}

function removeFromCart(cart_item) {
    //Видалити піцу з кошика
    //TODO: треба зробити
    Cart.splice(Cart.indexOf(cart_item), 1)
    //Після видалення оновити відображення
    updateCart();
}

function initialiseCart() {
    //Фукнція віпрацьвуватиме при завантаженні сторінки
    //Тут можна наприклад, зчитати вміст корзини який збережено в Local Storage то показати його
    //TODO: ...
    var saved_orders = Storage.get("cart");
    if (saved_orders) {
        Cart = saved_orders;
    }
    cleanCartHandler();
    updateCart();
}

function getPizzaInCart() {
    //Повертає піци які зберігаються в кошику
    return Cart;
}

function updateCart() {
    //Функція викликається при зміні вмісту кошика
    //Тут можна наприклад показати оновлений кошик на екрані та зберегти вміт кошика в Local Storage

    //Очищаємо старі піци в кошику
    $cart.html("");

    //Онволення однієї піци
    function showOnePizzaInCart(cart_item) {
        var html_code = Templates.PizzaCart_OneItem(cart_item);

        var $node = $(html_code);

        $node.find(".plus").click(function(){
            //Збільшуємо кількість замовлених піц

            cart_item.quantity += 1;

            //Оновлюємо відображення
            updateCart();
        });

        $node.find(".minus").click(function(){
            cart_item.quantity--;
            if (cart_item.quantity <= 0) {
                removeFromCart(cart_item);
            }
            updateCart();
        });

        $node.find(".cancel").click(function(){
            removeFromCart(cart_item);
        });

        $node.find(".pizza-counter").html(cart_item.quantity);
        $cart.append($node);
    }

    Cart.forEach(showOnePizzaInCart);

    $(".left-block .badge").text(Cart.length);

    if (!Cart.length) {
        $(".order-button").addClass("btn-block");
        $(".order-button").prop("disabled", true);
    } else {
        $(".order-button").removeClass("btn-block");
        $(".order-button").prop("disabled", false);
    }

    Storage.set("cart", Cart);
    updatePrice();
}

function updatePrice() {
    var price = 0;
    Cart.forEach(function(pizza){
        price+= (pizza["pizza"] [pizza["size"] ]["price"]) * pizza.quantity;
    });
    $(".sum_price").text(price);
}

//clean all orders
function cleanCartHandler() {
    $(".left-block #cleanup").click(function(){
        while (Cart.shift());
        updateCart();
    });
}

exports.removeFromCart = removeFromCart;
exports.addToCart = addToCart;

exports.getPizzaInCart = getPizzaInCart;
exports.initialiseCart = initialiseCart;

exports.PizzaSize = PizzaSize;