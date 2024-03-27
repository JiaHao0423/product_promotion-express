# product_promotion-express


運行express sever
指令 npm run dev

建立Table
指令 npm run migrate

刪除Table
指令 npm run down

建立資料
指令 npm run seed


首頁網址:1.localhost:8081/index   2.http://127.0.0.1:8081/index

1.pagination實作於header替換之前移動到各個區塊超連結，點按相對應按鈕會連結到相對應頁面

2.search功能於header右方，可以輸入文字查詢相似名稱之商品。

3.點擊商品卡上圖片會連結到相對應單一商品頁。

4.註冊按鈕可以註冊會員資料，需注意帳號及信箱具有唯一性，密碼最小長度為6，註冊完成後會跳轉到首頁並保持登入狀態，點擊會員中心可進入查看並可以重設密碼。

5.密碼重設需確認舊密碼正確之後才會重設為新密碼，新密碼一樣具有密碼最小長度為6的限制，並且會重新賦予新的JWT。

6.註冊後及登入後皆會保持登入狀態。
