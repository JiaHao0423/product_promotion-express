
//購物車表單&購物清單
const graphicscardList = document.querySelector('#graphicscardlist');
const harddriveList = document.querySelector('#harddrivelist');
const keyboard_mouseList = document.querySelector('#keyboard_mouselist');
const memorycardList = document.querySelector('#memorycardlist');
const screenList = document.querySelector('#screenlist');
const computerList = document.querySelector('#computerlist');
const shoppingList = document.querySelector('.shopping-list');


let shoppingCards = [];

//購物車
function addcard(name,index) {
    selectName = "#" + name + "_" +index;
    let select = document.querySelector(selectName);
    let count = parseInt(select.options[select.selectedIndex].text);
    if (shoppingCards[index] == null){
        shoppingCards[index] = JSON.parse(JSON.stringify(productList[(index)]));
        shoppingCards[index].quantity = count;
    } else {
        shoppingCards[index].quantity += count;
    }
    reloadcard()
}
function reloadcard() {
    shoppingList.innerHTML = '';
    let count = 0;
    shoppingCards.forEach((value,key)=>{
        if (value != null) {
            const afterPrice = Math.round(value.pricebefore * value.discount / 100)
            value.totalPrice = afterPrice * value.quantity
            count = value.quantity

            let newdiv = document.createElement('ul');
            newdiv.classList.add('shopping-cart-content');
            newdiv.innerHTML = `
            <li class="content-detail">
                        <img src="images/${value.class}.jpg" alt="" class="content__img">
                        <p class="content__name">${value.name}</p>
                    </li>
                    <li class="content__price">$${afterPrice}</li>
                    <div class="content-box">
                    <button onclick="changecontent(${key}, ${count - 1})" class="content__btn">-</button>
                    <li class="content__quantity">${count}</li>
                    <button onclick="changecontent(${key}, ${count + 1})" class="content__btn">+</button>
                    </div>
                    <li class="content__total">$${value.totalPrice}</li>
                    <img src="images/delect.png" alt="" onclick="delectcard(${key})" class="content__icon">
            `;
            shoppingList.appendChild(newdiv);
        }
    })
}
function changecontent(key, count) {
    if (count == 0) {
        delectcard(key);
    }else {
        shoppingCards[key].quantity = count;
    }
    reloadcard()
}
function delectcard(key) {
    delete shoppingCards[key]
    reloadcard()
}

//結帳
function settlement() {
    const materialName = document.querySelector('.material__name').value
    const materialAddress = document.querySelector('.material__address').value
    const materialNumber = document.querySelector('.material__number').value
    const materialInput = document.querySelector('input[name="pay"]:checked').value
    const materialBill = document.querySelector('.material__bill').value
    const materialBillnumber = document.querySelector('.material__billnumber').value

    if ((materialName == '')||(materialAddress == '')||(materialNumber == '')||(materialBillnumber == '')) {
        alert('請確認訂購資訊，不能為空白。')
    }else if (materialBill == '請選擇') {
        alert('請選擇發票類別。')
    }else {
        let outprice = 0;
        shoppingCards.forEach((value,key)=>{
            if (value!= null) {
                outprice += value.totalPrice;
            }
        })  
        let outext = `請確認訂購資訊\n
        訂購資訊\n
        收件人姓名: ${materialName}\n
        收件人地址: ${materialAddress}\n
        收件人電話: ${materialNumber}\n
        收件人付款方式: ${materialInput}\n
        收件人發票類別: ${materialBill}\n
        雲端發票號碼: ${materialBillnumber}\n
        總金額: ${outprice}
        `
        let result = confirm(outext);
        if (result == true) {
            shoppingCards.forEach((value,key)=>{
                delectcard(key)
            })  
            reloadcard()
        }
    }
}

//倒數計時器
const time = document.querySelectorAll('.reciprocal__time span');

let tempDate = new Date();
let tempYear = tempDate.getFullYear();
let tempMonth = tempDate.getMonth() + 1;
let tempDay = tempDate.getDate();

const reciprocal = new Date(tempYear, tempMonth, tempDay+1, 0, 0, 0); //倒數時間
const reciprocalTime = reciprocal.getTime();

function remaindingTime() {
    const today = new Date().getTime();

    const t = reciprocalTime - today;

    const oneDay = 24 * 60 * 60 * 1000;
    const oneHour = 60 * 60 * 1000;
    const oneMinute = 60 * 1000;

    let hours = Math.floor((t % oneDay) / oneHour); //小時
    let minutes =  Math.floor((t % oneHour) / oneMinute); //分鐘
    let seconds = Math.floor((t % oneMinute) / 1000); //秒鐘
    
    const values = [hours,minutes,seconds];
    function format(values) {
        if (values < 10) {
            return (values = `0${values}`)
        }
        return values
    };
    
    time.forEach(function (time, index) {
        time.innerHTML = format(values[index])
    });
}

let countdown = setInterval(remaindingTime, 1000);

