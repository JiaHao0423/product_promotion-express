const express = require("express");
const app = express();
const path = require("path");
const exphbs = require("express-handlebars");


app.engine("handlebars",exphbs.engine());
app.set("view engine", "handlebars");

app.use(express.static(path.join(__dirname, "/public")));
app.get("/",(req, res) => {
    res.render("home")
});

app.get("/*",(req, res) =>{
    res.send("not found");
});
app.listen(8081,() => {
    console.log("express app listening on 8081")
});

// 串接資料庫
const {DataTypes,Model,Sequelize} = require('sequelize');

const sqlize = new Sequelize('productpromotion','root','0000',{
    host: 'localhost',
    dialect: 'mysql',
});
// 建立資料表
class users extends Model{};
class cart extends Model{};
class order extends Model{};
class cart_product extends Model{};
class order_product extends Model{};
class payment_log extends Model{};
class product extends Model{};

users.init(
    {   
    id: {type: DataTypes.INTEGER,primaryKey: true},
    username: {type: DataTypes.STRING},
    passhash: {type: DataTypes.STRING},
    first_name: {type: DataTypes.STRING},
    last_name: {type: DataTypes.STRING},
    phone: {type: DataTypes.STRING},
    email: {type: DataTypes.STRING},
    address: {type: DataTypes.STRING},
},{sequelize: sqlize,modelName: "users",tableName: "users",timestamps: false});

cart.init(
    {
    id: {type: DataTypes.INTEGER,primaryKey: true},
    user_id: {type: DataTypes.INTEGER},
    image: {type: DataTypes.INTEGER},
    },
{sequelize: sqlize,modelName: "cart",tableName: "cart",timestamps: false});

order.init(
    {
    id: {type: DataTypes.INTEGER,primaryKey: true},
    user_id: {type: DataTypes.INTEGER},
    order_amount: {type: DataTypes.INTEGER},
    payment_method: {type: DataTypes.INTEGER},
    invoice_category: {type: DataTypes.INTEGER},
    invoice_number: {type: DataTypes.STRING},
    address: {type: DataTypes.STRING},
    created_at: {type: DataTypes.STRING},
    status: {type: DataTypes.STRING},
    },
{sequelize: sqlize,modelName: "order",tableName: "order",timestamps: false});

cart_product.init(
    {
    id: {type: DataTypes.INTEGER,primaryKey: true},
    cart_id: {type: DataTypes.INTEGER},
    product_id: {type: DataTypes.INTEGER},
    price: {type: DataTypes.INTEGER},
    quantity: {type: DataTypes.INTEGER},
    },
{sequelize: sqlize,modelName: "cart_product",tableName: "cart_product",timestamps: false});

order_product.init(
    {
    id: {type: DataTypes.INTEGER,primaryKey: true},
    order_id: {type: DataTypes.INTEGER},
    product_id: {type: DataTypes.INTEGER},
    price: {type: DataTypes.INTEGER},
    quantity: {type: DataTypes.INTEGER},
    },
{sequelize: sqlize,modelName: "order_product",tableName: "order_product",timestamps: false});

payment_log.init(
    {
    id: {type: DataTypes.INTEGER,primaryKey: true},
    order_id: {type: DataTypes.INTEGER},
    created_at: {type: DataTypes.DATE},
    payment_method: {type: DataTypes.INTEGER},
    status: {type: DataTypes.STRING},
    },
{sequelize: sqlize,modelName: "payment_log",tableName: "payment_log",timestamps: false});

product.init(
    {
    id: {type: DataTypes.INTEGER,primaryKey: true},
    name: {type: DataTypes.STRING},
    image: {type: DataTypes.INTEGER},
    price: {type: DataTypes.INTEGER},
    sale_price: {type: DataTypes.INTEGER},
    class: {type: DataTypes.STRING},
    sale_start: {type: DataTypes.DATE},
    sale_end: {type: DataTypes.DATE},
    },
{sequelize: sqlize,modelName: "product",tableName: "product",timestamps: false});
// 同步所有模型
sqlize.sync()
// 新增users資料
const usersData = [
    {
        id: '1',
        username: 'user1',
        passhash: '0000',
        first_name: 'JiIAHAO',
        last_name: 'ZHONG',
        phone: '0987654321',
        email: 'test1@gmail.com',
        address: '台中市西區自由路一段91號',
    },
    {
        id: '2',
        username: 'user2',
        passhash: '12345',
        first_name: 'Ben',
        last_name: 'Johnson',
        phone: '0123456789',
        email: 'test2@gmail.com',
        address: '台中市西屯區台灣大道三段99號',
    }
];
users.bulkCreate(usersData, { timestamps: false })
.then((createdUsers) => {
    console.log('Users created:', createdUsers);
  })
  .catch((error) => {
    console.error('Error creating users:', error);
  });
// 新增product資料

  const startTime = new Date('2024-01-18T23:59:59')
  const endtTime = new Date('2024-01-31T23:59:59')
  startTime.setMinutes(startTime.getMinutes() - startTime.getTimezoneOffset());
  endtTime.setMinutes(endtTime.getMinutes() - endtTime.getTimezoneOffset());
  const productData = [
    {
        id: 1,
        name: 'RTX4060',
        image: 1,
        discount: 95,
        price: 9990,
        sale_price: 9491,
        class: 'graphicscard',
        sale_start: startTime,
        sale_end: endtTime
    },
    {
        id: 2,
        name: 'RTX4070',
        image: 1,
        discount: 87,
        price: 19990,
        sale_price: 17391,
        class: 'graphicscard',
        sale_start: startTime,
        sale_end: endtTime
    },
    {
        id: 3,
        name: 'RTX4080',
        image: 1,
        discount: 91,
        price: 29990,
        sale_price: 27291,
        class: 'graphicscard',
        sale_start: startTime,
        sale_end: endtTime
    },
    {
        id: 4,
        name: 'RTX4090',
        image: 1,
        discount: 98,
        price: 58990,
        sale_price: 57810,
        class: 'graphicscard',
        sale_start: startTime,
        sale_end: endtTime
    },
    {
        id: 5,
        name: 'RTX3050',
        image: 1,
        discount: 94,
        price: 8490,
        sale_price: 7981,
        class: 'graphicscard',
        sale_start: startTime,
        sale_end: endtTime
    },
    {
        id: 6,
        name: 'RTX3060',
        image: 1,
        discount: 90,
        price: 10990,
        sale_price: 9891,
        class: 'graphicscard',
        sale_start: startTime,
        sale_end: endtTime
    },
    {
        id: 7,
        name: 'RTX3060 Ti',
        image: 1,
        discount: 96,
        price: 11990,
        sale_price: 11510,
        class: 'graphicscard',
        sale_start: startTime,
        sale_end: endtTime
    },
    {
        id: 8,
        name: 'RTX3070 Ti',
        image: 1,
        discount: 89,
        price: 17990,
        sale_price: 16011,
        class: 'graphicscard',
        sale_start: startTime,
        sale_end: endtTime
    },
    {
        id: 9,
        name: '2TB 2.5吋行動硬碟',
        image: 2,
        discount: 92,
        price: 2388,
        sale_price: 2197,
        class: 'harddrive',
        sale_start: startTime,
        sale_end: endtTime
    },
    {
        id: 10,
        name: '2TB 移動固態硬碟',
        image: 2,
        discount: 91,
        price: 5500,
        sale_price: 5005,
        class: 'harddrive',
        sale_start: startTime,
        sale_end: endtTime
    },
    {
        id: 11,
        name: '4TB 行動固態硬碟',
        image: 2,
        discount: 87,
        price: 11800,
        sale_price: 10266,
        class: 'harddrive',
        sale_start: startTime,
        sale_end: endtTime
    },
    {
        id: 12,
        name: '1TB 2.5吋行動固態硬碟',
        image: 2,
        discount: 95,
        price: 10590,
        sale_price: 10061,
        class: 'harddrive',
        sale_start: startTime,
        sale_end: endtTime
    },
    {
        id: 13,
        name: 'SSD 512G',
        image: 2,
        discount: 83,
        price: 828,
        sale_price: 687,
        class: 'harddrive',
        sale_start: startTime,
        sale_end: endtTime
    },
    {
        id: 14,
        name: 'SSD 2TB',
        image: 2,
        discount: 99,
        price: 7730,
        sale_price: 7653,
        class: 'harddrive',
        sale_start: startTime,
        sale_end: endtTime
    },
    {
        id: 15,
        name: 'SSD 4TB',
        image: 2,
        discount: 96,
        price: 9999,
        sale_price: 9599,
        class: 'harddrive',
        sale_start: startTime,
        sale_end: endtTime
    },
    {
        id: 16,
        name: 'SSD 1TB',
        image: 2,
        discount: 88,
        price: 2111,
        sale_price: 1858,
        class: 'harddrive',
        sale_start: startTime,
        sale_end: endtTime
    },
    {
        id: 17,
        name: '無線鍵盤',
        image: 3,
        discount: 95,
        price: 2780,
        sale_price: 2641,
        class: 'keyboard',
        sale_start: startTime,
        sale_end: endtTime
    },
    {
        id: 18,
        name: '機械電競鍵盤 青軸',
        image: 3,
        discount: 90,
        price: 4500,
        sale_price: 4050,
        class: 'keyboard',
        sale_start: startTime,
        sale_end: endtTime
    },
    {
        id: 19,
        name: '無線機械式鍵盤',
        image: 3,
        discount: 85,
        price: 3500,
        sale_price: 2975,
        class: 'keyboard',
        sale_start: startTime,
        sale_end: endtTime
    },
    {
        id: 20,
        name: '電競機械式鍵盤 茶軸',
        image: 3,
        discount: 94,
        price: 4600,
        sale_price: 4324,
        class: 'keyboard',
        sale_start: startTime,
        sale_end: endtTime
    },
    {
        id: 21,
        name: '無線人體工學滑鼠',
        image: 4,
        discount: 88,
        price: 980,
        sale_price: 862,
        class: 'mouse',
        sale_start: startTime,
        sale_end: endtTime
    },
    {
        id: 22,
        name: '電競滑鼠',
        image: 4,
        discount: 97,
        price: 4200,
        sale_price: 4074,
        class: 'mouse',
        sale_start: startTime,
        sale_end: endtTime
    },
    {
        id: 23,
        name: '無線電競滑鼠',
        image: 4,
        discount: 96,
        price: 5500,
        sale_price: 5280,
        class: 'mouse',
        sale_start: startTime,
        sale_end: endtTime
    },
    {
        id: 24,
        name: '超輕量無線滑鼠',
        image: 4,
        discount: 84,
        price: 1380,
        sale_price: 1159,
        class: 'mouse',
        sale_start: startTime,
        sale_end: endtTime
    },
    {
        id: 25,
        name: '32G 記憶卡',
        image: 5,
        discount: 90,
        price: 299,
        sale_price: 269,
        class:'memorycard',
        sale_start: startTime,
        sale_end: endtTime
    },
    {
        id: 26,
        name: '256G 記憶卡',
        image: 5,
        discount: 91,
        price: 749,
        sale_price: 682,
        class:'memorycard',
        sale_start: startTime,
        sale_end: endtTime
    },
    {
        id: 27,
        name: '128G 記憶卡',
        image: 5,
        discount: 89,
        price: 499,
        sale_price: 444,
        class:'memorycard',
        sale_start: startTime,
        sale_end: endtTime
    },
    {
        id: 28,
        name: '64G 記憶卡',
        image: 5,
        discount: 97,
        price: 299,
        sale_price: 290,
        class:'memorycard',
        sale_start: startTime,
        sale_end: endtTime
    },
    {
        id: 29,
        name: '1T 記憶卡',
        image: 5,
        discount: 99,
        price: 2399,
        sale_price: 2375,
        class:'memorycard',
        sale_start: startTime,
        sale_end: endtTime
    },
    {
        id: 30,
        name: '64G 高速記憶卡',
        image: 5,
        discount: 98,
        price: 450,
        sale_price: 441,
        class:'memorycard',
        sale_start: startTime,
        sale_end: endtTime
    },
    {
        id: 31,
        name: '128G 高速記憶卡',
        image: 5,
        discount: 89,
        price: 890,
        sale_price: 792,
        class:'memorycard',
        sale_start: startTime,
        sale_end: endtTime
    },
    {
        id: 32,
        name: '256G 高速記憶卡',
        image: 5,
        discount: 84,
        price: 999,
        sale_price: 839,
        class:'memorycard',
        sale_start: startTime,
        sale_end: endtTime
    },
    {
        id: 33,
        name: '32型HDR電競螢幕',
        image: 6,
        discount: 96,
        price: 6990,
        sale_price: 6710,
        class:'screen',
        sale_start: startTime,
        sale_end: endtTime
    },
    {
        id: 34,
        name: '27型 護眼螢幕',
        image: 6,
        discount: 95,
        price: 2988,
        sale_price: 2839,
        class:'screen',
        sale_start: startTime,
        sale_end: endtTime
    },
    {
        id: 35,
        name: '27型 窄邊美型螢幕',
        image: 6,
        discount: 98,
        price: 9990,
        sale_price: 9790,
        class:'screen',
        sale_start: startTime,
        sale_end: endtTime
    },
    {
        id: 36,
        name: '32行曲面螢幕',
        image: 6,
        discount: 91,
        price: 16800,
        sale_price: 15288,
        class:'screen',
        sale_start: startTime,
        sale_end: endtTime
    },
    {
        id: 37,
        name: '27型曲面螢幕',
        image: 6,
        discount: 89,
        price: 3888,
        sale_price: 3460,
        class:'screen',
        sale_start: startTime,
        sale_end: endtTime
    },
    {
        id: 38,
        name: '24型電競螢幕',
        image: 6,
        discount: 88,
        price: 3988,
        sale_price: 3509,
        class:'screen',
        sale_start: startTime,
        sale_end: endtTime
    },
    {
        id: 39,
        name: '49型曲面電競螢幕',
        image: 6,
        discount: 93,
        price: 49900,
        sale_price: 46407,
        class:'screen',
        sale_start: startTime,
        sale_end: endtTime
    },
    {
        id: 40,
        name: '曲面美型螢幕',
        image: 6,
        discount: 87,
        price: 5990,
        sale_price: 5211,
        class:'screen',
        sale_start: startTime,
        sale_end: endtTime
    },
    {
        id: 41,
        name: 'i7-13700KF',
        image: 7,
        discount: 95,
        price: 19793,
        sale_price: 18803,
        class: 'computer',
        sale_start: startTime,
        sale_end: endtTime
    },
    {
        id: 42,
        name: 'i9-12900KF',
        image: 7,
        discount: 97,
        price: 39348,
        sale_price: 38168,
        class: 'computer',
        sale_start: startTime,
        sale_end: endtTime
    },
    {
        id: 43,
        name: 'i5-12400F',
        image: 7,
        discount: 91,
        price: 9990,
        sale_price: 9091,
        class: 'computer',
        sale_start: startTime,
        sale_end: endtTime
    },
    {
        id: 44,
        name: 'i7-13700F',
        image: 7,
        discount: 85,
        price: 22990,
        sale_price: 19542,
        class: 'computer',
        sale_start: startTime,
        sale_end: endtTime
    },
    {
        id: 45,
        name: 'i7-11700',
        image: 7,
        discount: 96,
        price: 33480,
        sale_price: 32141,
        class: 'computer',
        sale_start: startTime,
        sale_end: endtTime
    },
    {
        id: 46,
        name: 'i5-13400F',
        image: 7,
        discount: 84,
        price: 10770,
        sale_price: 9047,
        class: 'computer',
        sale_start: startTime,
        sale_end: endtTime
    },
    {
        id: 47,
        name: 'i5-13400',
        image: 7,
        discount: 91,
        price: 11474,
        sale_price: 10441,
        class: 'computer',
        sale_start: startTime,
        sale_end: endtTime
    },
    {
        id: 48,
        name: 'i9-13900KF',
        image: 7,
        discount: 88,
        price: 27886,
        sale_price: 24540,
        class: 'computer',
        sale_start: startTime,
        sale_end: endtTime
    }
]

product.bulkCreate(productData, { timestamps: false })
.then((createdUsers) => {
    console.log('Users created:', createdUsers);
  })
  .catch((error) => {
    console.error('Error creating users:', error);
  });