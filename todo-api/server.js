// 使用するモジュールの読み込み
const express = require('express');
const mysql = require('mysql');
const session = require('express-session'); // express専用のセッション機能を利用するためのモジュール
//const bcrypt = require("bcrypt"); // パスワードをハッシュ化するためのモジュール

//expressアプリの作成
const app = express();

// セッション機能の設定
const session_config = {
    secret: 'robotama', // 秘密キーとなるテキスト => 暗号化(ハッシュ化)の時に使用する
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 24 * 60 * 60 * 1000 } // 24 hours => 24 * 60 * 60 * 1000 = 86400000 (ミリ秒) = 24時間を指定
};

app.use(session(session_config)); // セッション機能を利用する

// CORSの解決！
app.use((req, res, next)=> {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, OPTIONS');
  next();
});

// app.useメソッドによる関数の組み込み => アプリケーションに必要な機能を組み込んでいる！
app.use(express.json());
app.use(express.urlencoded({ extended: false })); // フォームの値を受け取るために必要な定型文

// mysqlとの接続設定
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'masahiro5271',
    database: 'ts_todo'
});

// Todo一覧を取得するget通信の設定
app.post(`/api/todolist/:id`, (req, res) => {
    console.log('API通信起動！');

    console.log(req.params);

    // const userId = req.session.userid; // セッションに保存されているuseridを格納する変数 userId
    // const auth = Boolean(userId);  // userIdに値が入れば、trueとなるログイン認証変数 auth

    // console.log(userId);
    // console.log(`isAuth:${auth}`);

    connection.query(`select * from todos where user_id = ?;`,
    [req.params.id],
    (error, results)=> {
        console.log(error);
        console.log(results);
        res.json(results); // JSON形式でレスポンスを返す！
    });
});

// TodoCreateからのpost通信 & 新規作成の処理
app.post('/api/create',(req, res)=> {
    console.log('post通信！ Todo新規作成');
    console.log(req.body);
    // console.log(req.body.todo);

    const user_id = req.body.user_id;
    const todo = req.body.todo;
    const detail = req.body.detail;
    const handler = req.body.handler;
    const date = req.body.date;
    const start = req.body.start;

    connection.query(`insert into todos(user_id,todo,detail,handler,date,start) values('${user_id}', '${todo}', '${detail}', '${handler}', '${date}', '${start}')`,
        (error, results)=>  {
            console.log(error);
            console.log(results);
            //res.json(results); //resをjson形式で返す！
            //res.redirect('/');
        }
    );

    connection.query(`select * from todos where user_id = ?;`,
    [user_id],
    (error, results)=> {
        console.log(error);
        console.log(results);
        res.json(results); // JSON形式でレスポンスを返す！
    });

});

// todoの削除処理・通信
app.post(`/api/delete/:id`,(req, res)=> {
    console.log('post通信！ Todo削除');
    console.log(req.params.id);
    console.log(req.body);
    console.log(req.body.user_id);

    const user_id = req.body.user_id;

    //const id = req.params.id;

    connection.query(`delete from todos where id = ?`,
        [ req.params.id ],
        (error, results)=> {
            console.log(error);
            console.log(results);
            //res.json(results); //resをjson形式で返す！
        }
    );
    
    connection.query(`select * from todos where user_id = ?;`,
    [user_id],
    (error, results)=> {
        console.log(error);
        console.log(results);
        res.json(results); // JSON形式でレスポンスを返す！
    });

});

// todoの更新処理・通信
app.post(`/api/update/:id`,(req, res)=> {
    console.log('post通信！ Todo更新');
    console.log(req.params.id);

    const user_id = req.body.user_id;
    const todo = req.body.todo;
    const detail = req.body.detail;
    const handler = req.body.handler;
    const date = req.body.date;
    const start = req.body.start;

    connection.query(`update todos set todo='${todo}', detail='${detail}', handler='${handler}',date='${date}',start='${start}' where id = ?`,
        [ req.params.id ],
        (error, results)=> {
            console.log(error);
            console.log(results);
            //res.json(results); //resをjson形式で返す！
        }
    );
    
    connection.query(`select * from todos where user_id = ?;`,
    [user_id],
    (error, results)=> {
        console.log(error);
        console.log(results);
        res.json(results); // JSON形式でレスポンスを返す！
    });

});

// user情報の新規登録
app.post(`/api/newuser`,(req, res)=> {
    console.log('post通信！ ユーザーの新規登録');
    console.log(req.body);

    const user = req.body.user;
    const password = req.body.password;

    connection.query(`select * from users where name = '${user}';`,(error, results)=> {
        console.log(error);
        console.log(results);

        if(results.length !== 0){
            console.log('このユーザー名は使用されています！');
            let message = 'このユーザー名は使用されています！';
            res.json(message);
        } else if(results.length === 0){
            connection.query(`insert into users(name,password) values('${user}','${password}');`,(error, results)=>{
                console.log(error);
                console.log(results);
                console.log('ユーザー登録完了！');
                res.json(results); // JSON形式でレスポンスを返す！
            });
        };

    });


});

// userのログイン
app.get(`/api/userlogin`,(req, res)=> {
    console.log('get通信！ ユーザー・ログイン');
    // console.log(req);
    // console.log(req.params);
    // console.log(req.body);
    console.log(req.query);

    const user = req.query.user;
    const password = req.query.password;

    // ログインのタイミングでセッションを生成する！
    req.session.user = user; // sessionオブジェクトにuserキーを設定 & 変数userを代入
    req.session.password = password; // sessionオブジェクトにpasswordキーを設定 & 変数passwordを代入

    console.log(req.session);

    connection.query(`select * from users where name = '${user}' and password = '${password}';`,(error, results)=> {

        console.log(error);
        console.log(results);

        if(results.length !== 0){ // ユーザー登録があったら、resultsにはデータが入る
            console.log('ユーザーログイン実行！');
             
            // let session_data = {
            //     session_user: req.session.user,
            //     session_password: req.session.password
            // };
            // console.log(session_data);

            res.json(results); // JSON形式でレスポンスを返す！ => { results, session_data } (key:value 同一形)を返す！

        } else {
            console.log('ユーザー登録がありません！');
            res.json('ユーザー登録がありません！');
        };

    });

});


// 待ち受け状態の設定
app.listen(8000, () => {
  console.log(`listening on port ${8000}`);
});




