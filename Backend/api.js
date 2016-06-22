/**
 * Created by chaika on 09.02.16.
 */
var Pizza_List = require('./data/Pizza_List');
var crypto = require('crypto');

exports.getPizzaList = function(req, res) {
    res.send(Pizza_List);
};

function base64(str) {
    return new Buffer(str).toString('base64');
}

function sha1(string) {
    var sha1 = crypto.createHash('sha1');
    sha1.update(string);
    return sha1.digest('base64');
}


exports.createOrder = function(req, res) {
    var order_info = req.body;
    //console.log("Creating Order", order_info);

    //ВИКОРИСТАВ КЛЮЧІ З ЛЕКЦІЇ, ТОМУ ЩО НЕМА МОЖЛИВОСТІ ЗАЙТИ НА СВІЙ ПРИВАТ
    var LIQPAY_PUBLIC_KEY = "i77030840732";
    var LIQPAY_PRIVATE_KEY = "3HQyjVuJbi6JSYYLmoEcDL8";

    var transaction_descript = "";
    order_info.pizza.forEach(function(item){
        transaction_descript += "(" + item.quantity+ " pizza(s)) " + "[" + item.size + "] "
            + item.pizza.title + "\n";
    });

    var order = {
        version: 3,
        public_key: LIQPAY_PUBLIC_KEY,
        action: "pay",
        amount: order_info.price,
        currency: "UAH",
        description: "Name: " + order_info.name + "\n" + "Address: " + order_info.address + "\n" +
        "Phone: " + order_info.phone + "\n" + "Order: " + transaction_descript,
        order_id: Math.random()*100,
        //!!!Важливо щоб було 1, бо інакше візьме гроші!!
        sandbox: 1
    };
    var data = base64(JSON.stringify(order));
    var signature = sha1(LIQPAY_PRIVATE_KEY + data + LIQPAY_PRIVATE_KEY);


    res.send({
        success: true,
        data: data,
        signature: signature
    });
};