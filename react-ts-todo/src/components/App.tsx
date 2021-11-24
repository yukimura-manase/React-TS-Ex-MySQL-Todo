import React,{ useEffect } from 'react';
import {　BrowserRouter as Router,　Switch,　Route } from 'react-router-dom';
import { Home } from './Home';
import { TodoList } from './TodoList';
import { TodoCreate } from './TodoCreate';
import { TodoDetail } from './TodoDetail';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { feachTodo, setLoginUser } from '../actions/ActionCreator';
import { User } from './User';
import { stateType, submitUserType } from './ComponentsTypes';
import { Nav } from './Nav';
import { createStyles,makeStyles } from '@material-ui/styles'; //materialUI

const useStyle = makeStyles(()=> {  // 1. 変数「useStyle」を生成、makeStylesメソッドを呼び出して代入する！
    return createStyles({           // 2. createStylesメソッドで、styleの設定をする！ => styleオブジェクトを作成してreturnする！

      "header": {
        background:"#3399FF",
      },
      "title": {
        width:"100%",
        textAlign:"center",
        color:"white",
        fontSize:"40px"
      },

    });
});

const loginUserSelector = (state: stateType)=> {
  return state.StoreState.user;
};

const App: React.FC = ()=> { // React.FCは関数コンポーネントであることを型定義している。

  const classes = useStyle();

  const user = useSelector(loginUserSelector);
  //console.log(user);

  const dispatch = useDispatch();

  // axios通信で、APIサーバー経由でDBからデータを取得する！
  useEffect(()=>{

    if(user){
      //console.log('動作確認');
      const id = user.id;
      //console.log(id);
      const server = `http://localhost:8000/api/todolist/${id}`; // ログインユーザーのリストを取得する

      axios.post(server)
        .then( (res:any)=> { // AxiosResponse
            //console.log(res);
            let axiosData:any = [];
            //console.log(res.data);
            axiosData.push(...res.data);
            dispatch(feachTodo(axiosData));

            // ユーザーログイン時に、ローカルストレージにデータを保存
            localStorage.setItem('username',user.name); // ローカルストレージにkey名と値の保存
            localStorage.setItem('pass',user.password);
            //console.log(localStorage);
            
        })
        .catch(console.error);

    } else if(localStorage.getItem('username') && localStorage.getItem('pass')){

      //console.log('ローカルストレージを使ったログイン処理実行！！');

      const storage = getLocalStorage();

      const server = `http://localhost:8000/api/userlogin`;

      if(storage.storageUser && storage.storagePass){ // nullの可能性否定

        //console.log('ローカルストレージにデータあり！');

        const submitUser: submitUserType = {
          user: storage.storageUser,
          password: storage.storagePass
        };

        axios.get(server,{params:submitUser})
                .then( (response: any)=> {
                    //console.log(response);
                    //console.log(response.data);
                    //console.log(response.config.params);
                    //console.log(response.data[0]);

                    let axiosUserData:any = response.data.shift(); // または、response.data[0]
                    //console.log(axiosUserData);

                    dispatch(
                        setLoginUser(axiosUserData)
                    );
                    //console.log('ログイン処理完了');
                    
                })
                .catch( (error)=>{
                    //console.log(error);
                });
      };

    };
    
  });

  const getLocalStorage = ()=> {

    const storageUser = window.localStorage.getItem('username'); // ローカルストレージにkey名でアクセスして、値を取得する！
    const storagePass = window.localStorage.getItem('pass');

    //console.log(`ローカルストレージから、ユーザー名:${storageUser}と、そのパス：${storagePass}を取得`);

    let storageData = { storageUser,storagePass };

    return storageData;
  };

  
  return (
    <React.Fragment> 
       <header className={classes.header} >
        <h1 className={classes.title} >React-TypeScript-Express-MySQLで作るタスク管理ツール</h1>
       </header>

       <Router>

        <Home />
        <Nav />

        {/* Switchによるルーティングで、パスが指定された場合に登録コンポーネントが表示される！ */}
        <Switch>
          <Route path='/user' exact component={User} />
          <Route path='/list' exact component={TodoList} />
          <Route path='/create' exact component={TodoCreate} />
          <Route path='/detail/:id' exact component={TodoDetail} />
        </Switch>

      </Router>
    </React.Fragment>
  )
}

export default App;
