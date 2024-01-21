import express from "express";
import mysql from "mysql";
import sequelizePackage from "sequelize";


//購物車表單&購物清單
const graphicscardList = document.querySelector('#graphicscardlist');
const harddriveList = document.querySelector('#harddrivelist');
const keyboard_mouseList = document.querySelector('#keyboard_mouselist');
const memorycardList = document.querySelector('#memorycardlist');
const screenList = document.querySelector('#screenlist');
const computerList = document.querySelector('#computerlist');
const shoppingList = document.querySelector('.shopping-list');

const productList = [
    {
        id: 0,
        name: 'RTX4060',
        discount: 95,
        pricebefore: 9990,
        class: 'graphicscard'
    },
    {
        id: 1,
        name: 'RTX4070',
        discount: 87,
        pricebefore: 19990,
        class: 'graphicscard'
    },
    {
        id: 2,
        name: 'RTX4080',
        discount: 91,
        pricebefore: 29990,
        class: 'graphicscard'
    },
    {
        id: 3,
        name: 'RTX4090',
        discount: 98,
        pricebefore: 58990,
        class: 'graphicscard'
    },
    {
        id: 4,
        name: 'RTX3050',
        discount: 94,
        pricebefore: 8490,
        class: 'graphicscard'
    },
    {
        id: 5,
        name: 'RTX3060',
        discount: 90,
        pricebefore: 10990,
        class: 'graphicscard'
    },
    {
        id: 6,
        name: 'RTX3060 Ti',
        discount: 96,
        pricebefore: 11990,
        class: 'graphicscard'
    },
    {
        id: 7,
        name: 'RTX3070 Ti',
        discount: 89,
        pricebefore: 17990,
        class: 'graphicscard'
    },
    {
        id: 8,
        name: '2TB 2.5吋行動硬碟',
        discount: 92,
        pricebefore: 2388,
        class: 'harddrive'
    },
    {
        id: 9,
        name: '2TB 移動固態硬碟',
        discount: 91,
        pricebefore: 5500,
        class: 'harddrive'
    },
    {
        id: 10,
        name: '4TB 行動固態硬碟',
        discount: 87,
        pricebefore: 11800,
        class: 'harddrive'
    },
    {
        id: 11,
        name: '1TB 2.5吋行動固態硬碟',
        discount: 95,
        pricebefore: 10590,
        class: 'harddrive'
    },
    {
        id: 12,
        name: 'SSD 512G',
        discount: 83,
        pricebefore: 828,
        class: 'harddrive'
    },
    {
        id: 13,
        name: 'SSD 2TB',
        discount: 99,
        pricebefore: 7730,
        class: 'harddrive'
    },
    {
        id: 14,
        name: 'SSD 4TB',
        discount: 96,
        pricebefore: 9999,
        class: 'harddrive'
    },
    {
        id: 15,
        name: 'SSD 1TB',
        discount: 88,
        pricebefore: 2111,
        class: 'harddrive'
    },
    {
        id: 16,
        name: '無線鍵盤',
        discount: 95,
        pricebefore: 2780,
        class: 'keyboard'
    },
    {
        id: 17,
        name: '機械電競鍵盤 青軸',
        discount: 90,
        pricebefore: 4500,
        class: 'keyboard'
    },
    {
        id: 18,
        name: '無線機械式鍵盤',
        discount: 85,
        pricebefore: 3500,
        class: 'keyboard'
    },
    {
        id: 19,
        name: '電競機械式鍵盤 茶軸',
        discount: 94,
        pricebefore: 4600,
        class: 'keyboard'
    },
    {
        id: 20,
        name: '無線人體工學滑鼠',
        discount: 88,
        pricebefore: 980,
        class: 'mouse'
    },
    {
        id: 21,
        name: '電競滑鼠',
        discount: 97,
        pricebefore: 4200,
        class: 'mouse'
    },
    {
        id: 22,
        name: '無線電競滑鼠',
        discount: 96,
        pricebefore: 5500,
        class: 'mouse'
    },
    {
        id: 23,
        name: '超輕量無線滑鼠',
        discount: 84,
        pricebefore: 1380,
        class: 'mouse',
    },
    {
        id: 24,
        name: '32G 記憶卡',
        discount: 90,
        pricebefore: 299,
        class:'memorycard'
    },
    {
        id: 25,
        name: '256G 記憶卡',
        discount: 91,
        pricebefore: 749,
        class:'memorycard'
    },
    {
        id: 26,
        name: '128G 記憶卡',
        discount: 89,
        pricebefore: 499,
        class:'memorycard'
    },
    {
        id: 27,
        name: '64G 記憶卡',
        discount: 97,
        pricebefore: 299,
        class:'memorycard'
    },
    {
        id: 28,
        name: '1T 記憶卡',
        discount: 99,
        pricebefore: 2399,
        class:'memorycard'
    },
    {
        id: 29,
        name: '64G 高速記憶卡',
        discount: 98,
        pricebefore: 450,
        class:'memorycard'
    },
    {
        id: 30,
        name: '128G 高速記憶卡',
        discount: 89,
        pricebefore: 890,
        class:'memorycard'
    },
    {
        id: 31,
        name: '256G 高速記憶卡',
        discount: 84,
        pricebefore: 999,
        class:'memorycard'
    },
    {
        id: 32,
        name: '32型HDR電競螢幕',
        discount: 96,
        pricebefore: 6990,
        class:'screen'
    },
    {
        id: 33,
        name: '27型 護眼螢幕',
        discount: 95,
        pricebefore: 2988,
        class:'screen'
    },
    {
        id: 34,
        name: '27型 窄邊美型螢幕',
        discount: 98,
        pricebefore: 9990,
        class:'screen'
    },
    {
        id: 35,
        name: '32行曲面螢幕',
        discount: 91,
        pricebefore: 16800,
        class:'screen'
    },
    {
        id: 36,
        name: '27型曲面螢幕',
        discount: 89,
        pricebefore: 3888,
        class:'screen'
    },
    {
        id: 37,
        name: '24型電競螢幕',
        discount: 88,
        pricebefore: 3988,
        class:'screen'
    },
    {
        id: 38,
        name: '49型曲面電競螢幕',
        discount: 93,
        pricebefore: 49900,
        class:'screen'
    },
    {
        id: 39,
        name: '曲面美型螢幕',
        discount: 87,
        pricebefore: 5990,
        class:'screen'
    },
    {
        id: 40,
        name: 'i7-13700KF',
        discount: 95,
        pricebefore: 19793,
        class: 'computer'
    },
    {
        id: 41,
        name: 'i9-12900KF',
        discount: 97,
        pricebefore: 39348,
        class: 'computer'
    },
    {
        id: 42,
        name: 'i5-12400F',
        discount: 91,
        pricebefore: 9990,
        class: 'computer'
    },
    {
        id: 43,
        name: 'i7-13700F',
        discount: 85,
        pricebefore: 22990,
        class: 'computer'
    },
    {
        id: 44,
        name: 'i7-11700',
        discount: 96,
        pricebefore: 33480,
        class: 'computer'
    },
    {
        id: 45,
        name: 'i5-13400F',
        discount: 84,
        pricebefore: 10770,
        class: 'computer'
    },
    {
        id: 46,
        name: 'i5-13400',
        discount: 91,
        pricebefore: 11474,
        class: 'computer'
    },
    {
        id: 47,
        name: 'i9-13900KF',
        discount: 88,
        pricebefore: 27886,
        class: 'computer'
    }
]
let shoppingCards = [];
function intolist(){
    productList.forEach((value,key) =>{
    let newdiv = document.createElement('div');
    let priceafter = Math.round(value.pricebefore*value.discount/100);
    let imageName = 'images/'+value.class+'.jpg';
    newdiv.classList.add('commodity-col');
    newdiv.innerHTML = `
    <div class="commodity-card">
        <div class="card-cover">
            <p class="card__discount ">${value.discount.toLocaleString()}折</p>
            <img src="${imageName}" alt="" class="card__img">
        </div>
        <div class="card-content">
            <p class="card__name">${value.name}</p>
            <select name="${value.class}_${value.id}" id="${value.class}_${value.id}" class="card__select">
                <option value="">1</option>
                <option value="">2</option>
                <option value="">3</option>
                <option value="">4</option>
            </select>
        </div>
        <div class="card-oder">
            <div class="card-price">
                <div class="card-price__priceafter">$${priceafter.toLocaleString()}</div>
                <div class="card-price__pricebefore">$${value.pricebefore.toLocaleString()}</div>
            </div>
            <button onclick="addcard('${value.class}',${value.id})" class="card__btn">加入購物車</button>
        </div>
    </div>`;
    renderProductList(value.class,newdiv)
    })
}
function renderProductList(classtext,newdiv) {
    switch (classtext) {
        case 'graphicscard':{
            graphicscardList.appendChild(newdiv);
            break;
        }
        case 'harddrive':{
            harddriveList.appendChild(newdiv);
            break;
        }
        case 'memorycard':{
            memorycardList.appendChild(newdiv);
            break;
        }
        case 'screen':{
            screenList.appendChild(newdiv);
            break;
        }
        case 'computer':{
            computerList.appendChild(newdiv);
            break;
        }
        default:{
            keyboard_mouseList.appendChild(newdiv);
            break;
        }
    }
}
intolist()


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

