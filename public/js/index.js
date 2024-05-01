//購物車表單&購物清單

var shoppingList = document.querySelector('.shopping-list');
var session = require('express-session');
var shoppingCards = [];
var productList = [
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
        class: 'memorycard'
    },
    {
        id: 25,
        name: '256G 記憶卡',
        discount: 91,
        pricebefore: 749,
        class: 'memorycard'
    },
    {
        id: 26,
        name: '128G 記憶卡',
        discount: 89,
        pricebefore: 499,
        class: 'memorycard'
    },
    {
        id: 27,
        name: '64G 記憶卡',
        discount: 97,
        pricebefore: 299,
        class: 'memorycard'
    },
    {
        id: 28,
        name: '1T 記憶卡',
        discount: 99,
        pricebefore: 2399,
        class: 'memorycard'
    },
    {
        id: 29,
        name: '64G 高速記憶卡',
        discount: 98,
        pricebefore: 450,
        class: 'memorycard'
    },
    {
        id: 30,
        name: '128G 高速記憶卡',
        discount: 89,
        pricebefore: 890,
        class: 'memorycard'
    },
    {
        id: 31,
        name: '256G 高速記憶卡',
        discount: 84,
        pricebefore: 999,
        class: 'memorycard'
    },
    {
        id: 32,
        name: '32型HDR電競螢幕',
        discount: 96,
        pricebefore: 6990,
        class: 'screen'
    },
    {
        id: 33,
        name: '27型 護眼螢幕',
        discount: 95,
        pricebefore: 2988,
        class: 'screen'
    },
    {
        id: 34,
        name: '27型 窄邊美型螢幕',
        discount: 98,
        pricebefore: 9990,
        class: 'screen'
    },
    {
        id: 35,
        name: '32行曲面螢幕',
        discount: 91,
        pricebefore: 16800,
        class: 'screen'
    },
    {
        id: 36,
        name: '27型曲面螢幕',
        discount: 89,
        pricebefore: 3888,
        class: 'screen'
    },
    {
        id: 37,
        name: '24型電競螢幕',
        discount: 88,
        pricebefore: 3988,
        class: 'screen'
    },
    {
        id: 38,
        name: '49型曲面電競螢幕',
        discount: 93,
        pricebefore: 49900,
        class: 'screen'
    },
    {
        id: 39,
        name: '曲面美型螢幕',
        discount: 87,
        pricebefore: 5990,
        class: 'screen'
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




//倒數計時器
var time = document.querySelectorAll('.reciprocal__time span');

var tempDate = new Date();
var tempYear = tempDate.getFullYear();
var tempMonth = tempDate.getMonth() + 1;
var tempDay = tempDate.getDate();

var reciprocal = new Date(tempYear, tempMonth, tempDay + 1, 0, 0, 0); //倒數時間
var reciprocalTime = reciprocal.getTime();

function remaindingTime() {
    var today = new Date().getTime();

    var t = reciprocalTime - today;

    var oneDay = 24 * 60 * 60 * 1000;
    var oneHour = 60 * 60 * 1000;
    var oneMinute = 60 * 1000;

    var hours = Math.floor((t % oneDay) / oneHour); //小時
    var minutes = Math.floor((t % oneHour) / oneMinute); //分鐘
    var seconds = Math.floor((t % oneMinute) / 1000); //秒鐘

    var values = [hours, minutes, seconds];
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

var countdown = setInterval(remaindingTime, 1000);

