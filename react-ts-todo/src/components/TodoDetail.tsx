import React,{ useState,useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { useSelector,useDispatch } from "react-redux";
import { stateType,parameter,detailType } from './ComponentsTypes';
import axios from 'axios';

import { submitTodo } from './ComponentsTypes';

import { updateTodo } from '../actions/ActionCreator';

import { createStyles, makeStyles } from '@material-ui/styles';

const useStyle = makeStyles( ()=> {
    return createStyles({
        "title":{
            width:"100%",
            textAlign:"center",
            color:"#3399FF",
            fontSize:"40px"
        },
        "text":{
            textAlign:"center",
            fontWeight:600
        },
        "tableWidth":{
            width:"80%",
            margin:"3px auto",
            paddingTop:"30px",
            paddingRight:"430px",
            paddingBottom:"30px",
            // border:"solid 3px",
            // borderColor: "#3399FF",
        },
        "h3":{
            fontSize:"25px"
        },
        "button": {
            borderColor: "#3399FF",
            color: "#3399FF",
            fontWeight: 600,
            marginRight:"8px",
            marginBottom: "8px",
            backgroundColor: "white",
            padding: "10px",
            "&:hover": {
                backgroundColor: "#3399FF",
                color: "white"
            }
        },
        "input": {
            width: "100%",
        },
        "error1": {
            color:"black",
            fontSize:"22px"
        },
        "error2": {
            color:"blue",
            fontSize:"20px"
        }

    });
});

const todoSelector = (state: stateType)=> {
    return state.StoreState.todolist;
};

const loginUserSelector = (state: stateType)=> {
    return state.StoreState.user;
};

export const TodoDetail: React.FC = ()=> {

    const classes = useStyle();

    const todoData = useSelector(todoSelector);

    const user = useSelector(loginUserSelector);

    const dispatch = useDispatch();

    const history = useHistory();
    const handleLink = (path: string)=> { return history.push(path) };

    const {id}: parameter = useParams();
    // console.log(id);
    // console.log(typeof id);

    
    const detailTodo: detailType | undefined = todoData.find( (todo: detailType) => todo.id === Number(id));
    //console.log(detailTodo)

    useEffect(()=>{
        //console.log(detailTodo);
        typeof detailTodo === 'object' && setTodo(detailTodo.todo);
        typeof detailTodo === 'object' && setTodoDetail(detailTodo.detail);
        typeof detailTodo === 'object' && setHandler(detailTodo.handler);
        typeof detailTodo === 'object' && setDate(detailTodo.date);
        typeof detailTodo === 'object' && setStart(detailTodo.start);
    },[]);

    const [inputtodo,setTodo] = useState<string>('');
    const inputTodo = (event: any)=>{
        setTodo(event.target.value); // チケット名
    };

    const [inputdetail,setTodoDetail] = useState<string>('');
    const inputDetail = (event: any)=>{
        setTodoDetail(event.target.value); // チケット詳細
    };

    const [inputhandler,setHandler] = useState<string>('');
    const inputHandler = (event: any)=>{
        setHandler(event.target.value); // 担当者
    };

    const [inputdate,setDate] = useState<string>('');
    const inputDate = (event: any)=> {
        setDate(event.target.value); // 期日
    };

    const [inputstart,setStart] = useState<string>('')
    const inputStart = (event: any)=> {
        setStart(event.target.value); // 開始日
    };

    // チケット名のバリデーション
    const inputTodoValidate = (inputtodo: string)=> {
        let pattern = /^[\s\S\d]{1,20}$/  // 正規表現パターン(法則性)の作成  //「行頭から行末まで文字列・数字が1文字以上20以内のパターン」
        return pattern.test(inputtodo)
    }

    // 詳細内容のバリデーション
    const inputDetailValidate = (inputdetail: string)=> {
        let pattern = /^[\s\S\d]{1,300}$/
        return pattern.test(inputdetail)
    }

    // 担当者のバリデーション
    const inputHandlerValidate = (inputhandler: string)=> {
        let pattern = /^[\s\S\d]{1,10}$/
        return pattern.test(inputhandler)
    }

    // 期日のバリデーション
    const inputDateValidate = (inputdate: string)=>{

        let today = new Date(); // 現在時刻の取得 => Dateオブジェクトを呼び出す！

        let today2: any = new Date(
            today.getFullYear(), //年
            today.getMonth(), //月
            today.getDate(), //日
        );

        let nowDay = Date.parse(today2);
        
        let limitDate:any = new Date(inputdate);

        let limitDay = Date.parse(limitDate);

       if(limitDay - nowDay >= 0){
            return true;
       } else {
           return false;
       };

    };

    // 開始日のバリデーション
    const inputStartValidate = (inputstart: string)=> {

        let today: Date = new Date();

        let today2 = new Date( // 「年・月・日」までの日付情報(文字列)を生成する！
            today.getFullYear(), //年
            today.getMonth(), //月
            today.getDate() //日
        );

        let nowDay: number = Number(today2);
        
        let startDate: Date = new Date(inputstart);

        let startDay: number = Number(startDate);
        
       if(startDay - nowDay >= 0){
            return true;
       } else {
           return false;
       };

    };

    // 期日と開始日のバリデーション
    const compareLimitStart = (inputdate: string, inputstart: string)=> {

        //console.log('期日と開始日のバリデーション');
        
        let limitDate = new Date(inputdate);

        let limit = Number(limitDate);
        //console.log(limit);

        let startDate = new Date(inputstart);

        let start = Number(startDate);
        //console.log(start);

        console.log(limit - start);
        if(limit - start >= 0){
            return true;
        } else {
            return false;
        };


    };

    const [errors, setError] = useState<string[]>([]) // string型の配列が入るよと型定義


    // バリデーション・チェック
    const update = ()=>{

        setError([]) // 初期化

        let errorlist: string[] = []

        if(inputtodo === ''){
            errorlist.push('チケット名を入力してください')
        } else if(!inputTodoValidate(inputtodo)){ // マッチしなかったら実行
            errorlist.push('チケット名は、1文字以上20文字以内で入力をしてください')
        }

        if(inputdetail === ''){
            errorlist.push('詳細内容を入力してください')
        } else if(!inputDetailValidate(inputdetail)){ // マッチしなかったら実行
            errorlist.push('詳細内容は、1文字以上300文字以内で入力をしてください')
        }

        if(inputhandler === ''){
            errorlist.push('担当者を入力してください')
        } else if(!inputHandlerValidate(inputhandler)){ // マッチしなかったら実行
            errorlist.push('担当者は、1文字以上10文字以内で入力をしてください')
        }

        if(inputdate === ''){
            errorlist.push('期日を選択してください')
        } else if(!inputDateValidate(inputdate)) { // マッチしなかったら実行
            errorlist.push('期日は、今日以降の日付にしてください')
        }

        if(inputstart === ''){
            errorlist.push('開始日を選択してください') 
        } else if(!inputStartValidate(inputstart)) { // マッチしなかったら実行
            errorlist.push('開始日は、今日以降の日付にしてください')
        };

        if(inputdate === '' || inputstart === ''){
            console.log('ロボ玉');
        } else if( !compareLimitStart(inputdate, inputstart) ){ // falseが返ってきたら実行する！
            errorlist.push('期日は、開始日以降の日付にしてください');
        };

        setError(errorlist);

        const server = `http://localhost:8000/api/update/${Number(id)}` 

        if(errorlist.length === 0 && user ){ // userがnullの場合はfalseとなる！ => typeof演算子だとnullはobject判定される！(instanceof Objectなら大丈夫)

            const submitData: submitTodo = {
                user_id: user.id,
                todo:inputtodo,
                detail:inputdetail,
                handler:inputhandler,
                date:inputdate,
                start:inputstart
            };

            axios.post(server,submitData)
                .then( (response: any)=> {

                    let axiosData:any = [];
                
                    axiosData.push(...response.data);

                    dispatch(
                        updateTodo(axiosData)
                    );

                })
                .catch( (error)=>{
                    console.log(error);
                });

            handleLink('/list');
        };

    };

     // チケット名、詳細（内容）、担当者、期日、開始日
    return (
        <React.Fragment>
            <h2 className={ classes.title } >Todo詳細・編集画面</h2>

            <div className={ classes.text} >
                <table className={ classes.tableWidth } >
                    <tbody>
                        <tr>
                            <th>
                                <h3 className={ classes.h3 } >Todo名</h3>
                            </th>
                            <td>
                                <h5>{ typeof detailTodo === 'object' ? <input value={inputtodo} placeholder='チケットのタイトル' onChange={(event)=>{ inputTodo(event) }} className={ classes.input} /> : false }</h5>
                            </td>
                        </tr>
                        <tr>
                            <th>
                                <h3 className={ classes.h3 } >チケット詳細</h3>
                            </th>
                            <td>
                                <h5>{ typeof detailTodo === 'object' ? <textarea value={inputdetail} placeholder='タスクの詳細' onChange={(event)=>{ inputDetail(event) }} className={ classes.input} /> : false }</h5>
                            </td>
                        </tr>
                        <tr>
                            <th>
                                <h3 className={ classes.h3 } >担当者</h3>
                            </th>
                            <td>
                                <h5>{ typeof detailTodo === 'object' ? <input value={inputhandler} placeholder='担当者を入力' onChange={(event)=>{ inputHandler(event) }} className={ classes.input} /> : false }</h5>
                            </td>
                        </tr>
                        <tr>
                            <th>
                                <h3 className={ classes.h3 } >期日</h3>
                            </th>
                            <td>
                                <h5>{ typeof detailTodo === 'object' ? <input type='date' value={inputdate} onChange={(event)=>{ inputDate(event) }} className={ classes.input} /> : false }</h5>
                            </td>
                        </tr>
                        <tr>
                            <th>
                                <h3 className={ classes.h3 } >開始日</h3>
                            </th>
                            <td>
                                <h5>{ typeof detailTodo === 'object' ? <input type='date' value={inputstart} onChange={(event)=>{ inputStart(event) }} className={ classes.input} /> : false }</h5>
                            </td>
                        </tr>
                    </tbody>
                </table>

                <div>
                    <button onClick={ ()=> { update() } } className={ classes.button } >更新</button>
                    <button onClick={ ()=> { handleLink('/list') } } className={ classes.button } >Todo一覧に戻る</button>
                </div>
                <div>
                    {errors.map(
                        (error,index)=> {
                            return (
                                <div key={index}>
                                    <h4 className={classes.error1} >入力エラー{index + 1}</h4>
                                    <h5 className={classes.error2} >{error}</h5>
                                </div>
                            )
                        }
                    )}
                </div>

            </div>
        </React.Fragment>
    )
}


// ・チケット詳細画面（更新処理をしたい場合はここで行う）
// 　・チケットの詳細情報を全て画面に表示することができる => クリア
// 　・戻るボタンを押すと一覧画面に遷移 => クリア
// 　・更新ボタンを押すと内容を更新し、一覧画面に遷移（更新機能を付けたい場合）