import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addNewTodo } from '../actions/ActionCreator';
import { useHistory } from 'react-router-dom';
import axios from 'axios';

import { submitTodo, stateType } from './ComponentsTypes';

import { createStyles, makeStyles } from '@material-ui/styles';

const useStyle = makeStyles(()=>{
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
            marginTop: "20px",
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
            width: "30%",
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

const loginUserSelector = (state: stateType)=> {
    return state.StoreState.user;
    
};

export const TodoCreate: React.FC = ()=> {

    const classes = useStyle();

    const user = useSelector(loginUserSelector);

    const dispatch = useDispatch();

    const history = useHistory();
    const handleLink = (path: string)=> { return history.push(path)};
    
    const [inputtodo,setTodo] = useState<string>('');
    const inputTodo = (event: React.ChangeEvent<HTMLInputElement>)=>{
        setTodo(event.target.value); // チケット名
    };

    const [inputdetail,setTodoDetail] = useState<string>('')
    const inputDetail = (event: any)=>{
        setTodoDetail(event.target.value) // チケット詳細
    }

    const [inputhandler,setHandler] = useState<string>('')
    const inputHandler = (event: React.ChangeEvent<HTMLInputElement>)=>{
        setHandler(event.target.value) // 担当者
    }

    const [inputdate,setDate] = useState<string>('')
    const inputDate = (event: React.ChangeEvent<HTMLInputElement>)=> {
        setDate(event.target.value) // 期日
    }

    const [inputstart,setStart] = useState<string>('')
    const inputStart = (event: React.ChangeEvent<HTMLInputElement>)=> {
        setStart(event.target.value) // 開始日
    }

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

        //console.log('期日のバリデーション');

        let today = new Date(); // 現在時刻の取得 => Dateオブジェクトを呼び出す！
        //console.log(today);

        let today2: any = new Date( // 「年・月・日」までの日付情報(文字列)を生成する！
            today.getFullYear(), //年
            today.getMonth(), //月
            today.getDate() //日
        );

        let nowDay = Date.parse(today2);
        //console.log(nowDay);

        //console.log(inputdate);
        let limitDate: any = new Date(inputdate);
        //console.log(limitDate);

        let limitDay = Date.parse(limitDate);
        //console.log(limitDay);

        //console.log(limitDay - nowDay);

       if(limitDay - nowDay >= 0){
            return true;
       } else {
           return false;
       };

    }

    // 開始日のバリデーション
    const inputStartValidate = (inputstart: string)=> {

        //console.log('開始日のバリデーション');

        let today = new Date(); // 現在時刻の取得 => Dateオブジェクトを呼び出す！

        let today2 = new Date( // 「年・月・日」までの日付情報(文字列)を生成する！
            today.getFullYear(), //年
            today.getMonth(), //月
            today.getDate() //日
        );

        let nowDay = Number(today2);
        //console.log(nowDay);

        let startDate = new Date(inputstart);

        let startDay = Number(startDate);
        //console.log(startDay);
        
        //console.log(startDay - nowDay);
       if(startDay - nowDay >= 0){
            return true
       } else {
           return false
       };

    };

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
    const submitTask = ()=>{

        setError([]) // 初期化

        let errorlist: string[] = []

        if(inputtodo === ''){
            errorlist.push('チケット名を入力してください')
        } else if( !inputTodoValidate(inputtodo) ){ // マッチしなかったら実行
            errorlist.push('チケット名は、1文字以上20文字以内で入力をしてください')
        }

        if(inputdetail === ''){
            errorlist.push('詳細内容を入力してください')
        } else if( !inputDetailValidate(inputdetail) ){ // マッチしなかったら実行
            errorlist.push('詳細内容は、1文字以上300文字以内で入力をしてください')
        }

        if(inputhandler === ''){
            errorlist.push('担当者を入力してください')
        } else if( !inputHandlerValidate(inputhandler) ){ // マッチしなかったら実行
            errorlist.push('担当者は、1文字以上10文字以内で入力をしてください')
        }

        if(inputdate === ''){
            errorlist.push('期日を選択してください')
        } else if( !inputDateValidate(inputdate) ) { // マッチしなかったら実行
            errorlist.push('期日は、今日以降の日付にしてください')
        }

        if(inputstart === ''){
            errorlist.push('開始日を選択してください') 
        } else if( !inputStartValidate(inputstart) ) { // マッチしなかったら実行
            errorlist.push('開始日は、今日以降の日付にしてください')
        };

        if(inputdate === '' || inputstart === ''){
            console.log('ロボ玉');
        } else if( !compareLimitStart(inputdate, inputstart) ){ // falseが返ってきたら実行する！
            errorlist.push('期日は、開始日以降の日付にしてください');
        };

        setError(errorlist); // セットされたエラー情報がリアルタイムで表示される！

        const server = 'http://localhost:8000/api/create';

        if(errorlist.length === 0 && user instanceof Object){ // typeof演算子だとnullはobject判定される！

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
                        addNewTodo(axiosData)
                    );

                })
                .catch( (error)=>{
                    console.log(error);
                });

            handleLink('/list');
        };

    };

    return (
        <React.Fragment>

            { user === null ? <h2 className={ classes.title} >まずはログイン！</h2>:
                <React.Fragment>
                    <h2 className={ classes.title} >Todo作成画面</h2>

                    <div className={ classes.text} >
                        <table className={ classes.tableWidth }>
                            <tbody>
                                <tr>
                                    <td>
                                        <h3 className={ classes.h3 } >チケット名</h3>
                                        <input value={inputtodo} placeholder='チケットのタイトル' onChange={(event)=>{ inputTodo(event) }} className={ classes.input } />
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <h3 className={ classes.h3 } >チケット詳細</h3>
                                        <textarea value={inputdetail} placeholder='タスクの詳細' onChange={(event)=>{ inputDetail(event) }} className={ classes.input } />
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <h3 className={ classes.h3 } >担当者</h3>
                                        <input value={inputhandler} placeholder='担当者を入力' onChange={(event)=>{ inputHandler(event) }} className={ classes.input } />
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <h3 className={ classes.h3 } >期日(Todoの期限を設定してください)</h3>
                                        <input type='date' value={inputdate} onChange={(event)=>{ inputDate(event) }} className={ classes.input } />
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <h3  className={ classes.h3 } >開始日</h3>
                                        <input type='date' value={inputstart} onChange={(event)=>{ inputStart(event) }} className={ classes.input } />
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <button onClick={ ()=>{submitTask()} } className={ classes.button } >Todoチケット作成</button>
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
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </React.Fragment>
            }
            
        </React.Fragment>
    )
}

// ・チケット作成画面
// 　・チケット名、詳細（内容）、担当者、期日、開始日　を入力して保存ができる => クリア
// 　・保存ボタン押下後は一覧画面に遷移 => クリア

// チケット作成画面　　　条件詳細 => 条件に合っているかどうか？ => バリデーション・チェック

// -チケット名　← 1文字以上20文字以内　=> クリア

// -詳細（内容）　←1文字以上300文字以内 => クリア

// -担当者　1文字以上10文字以内 => クリア

// -期日、開始日　←yyyy/mm/dd の記載方法でなければならない => 選択されているかどうかのチェック 現在との確認 => クリア