/**
 * Created by chaika on 02.02.16.
 */
var Templates = require('../Templates');
var PizzaCart = require('./PizzaCart');
var Pizza_List = null;

//HTML едемент куди будуть додаватися піци
var $pizza_list = $("#pizza_list");

function showPizzaList(list) {
    //Очищаємо старі піци в кошику
    $pizza_list.html("");

    //Онволення однієї піци
    function showOnePizza(pizza) {
        var html_code = Templates.PizzaMenu_OneItem({pizza: pizza});

        var $node = $(html_code);

        $node.find(".buy-big").click(function(){
            PizzaCart.addToCart(pizza, PizzaCart.PizzaSize.Big);
        });
        $node.find(".buy-small").click(function(){
            PizzaCart.addToCart(pizza, PizzaCart.PizzaSize.Small);
        });

        $pizza_list.append($node);
    }

    list.forEach(showOnePizza);
}

function filterPizza(filter) {
    var counter = 0;
    //Масив куди потраплять піци які треба показати
    var pizza_shown = [];

    Pizza_List.forEach(function(pizza){
        //Якщо піца відповідає фільтру
        if ((pizza.content[filter] && pizza.content[filter].length != 0) || filter === "all") {
            counter++;
            pizza_shown.push(pizza);
        }
        //TODO: зробити фільтри
    });

    //Показати відфільтровані піци
    showPizzaList(pizza_shown);
    return counter;
}

function initialiseMenu(server_list) {
    //Показуємо усі піци
    Pizza_List = server_list;
    select_pizza_type();
    showPizzaList(Pizza_List);
}

function select_pizza_type() {
    $(".pizzas-filters ul li").click(function(){
        if (!$(this).children().hasClass("active")) {
            $(this).parent().find(".active").removeClass("active");
            $(this).find("a").addClass("active");

            //change fiter's header
            var header = $(this).children().text();
            switch (header) {
                case "Усі":
                case "М’ясні":
                    header += " піци";
                    break;
                case "Вега" :
                    header = "Вегетаріанська піци";
                    break;
                default: header = "Піци " + header.toLowerCase();
            }
            //set new header
            $(".title #type-title").text(header);
            $(".title .badge").text(filterPizza($(this).children().attr("id")));
        }
    });
}

exports.filterPizza = filterPizza;
exports.initialiseMenu = initialiseMenu;
exports.select_pizza_type = select_pizza_type;