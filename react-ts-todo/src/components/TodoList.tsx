import React from 'react';
import { useSelector, useDispatch} from 'react-redux';
import { removeTodo } from '../actions/ActionCreator';
import { Link } from 'react-router-dom';
import axios from 'axios';

import { stateType, todoType } from './ComponentsTypes';

import { createStyles, makeStyles } from '@material-ui/styles';

const useStyle = makeStyles( ()=> {

    return createStyles({
        "text":{
            textAlign:"center",
            fontWeight:600
        },
        "title":{
            width:"100%",
            textAlign:"center",
            color:"#3399FF",
            fontSize:"40px"
          },
        "tableWidth":{
            width:"80%",
            margin:"3px auto",
            paddingTop:"30px",
            paddingBottom:"30px",
            //border:"solid 3px",
            borderColor: "#3399FF",
        },
        "todoTitle":{
            background:"#3399FF",
            fontSize:"20px",
            color:"white",
            //border:"solid 3px",
            borderColor: "#3399FF"
        },
        "tableBody":{
            background:"#EEEEEE",
            //border:"solid 3px",
            borderColor: "#3399FF",
        },
        "button": {
            borderColor: "#3399FF",
            color: "#3399FF",
            fontWeight: 600,
            margin: "12px",
            backgroundColor: "white",
            padding: "10px",
            "&:hover": {
                backgroundColor: "#3399FF",
                color: "white"
            }
        },

    });
});

const todoSelector = (state: stateType)=> {
    return state.StoreState.todolist;
};

const loginUserSelector = (state: stateType)=> {
    return state.StoreState.user;
};

export const TodoList: React.FC = ()=> {

    const classes: any = useStyle();

    const user = useSelector(loginUserSelector);

    const dispatch = useDispatch();

    const todoData = useSelector(todoSelector);
    //console.log(todoData);

    const remove = (id: number)=> {

        const server = `http://localhost:8000/api/delete/${id}`;

        const user_id = user?.id;

        // 第二引数は、オブジェクトの形で渡す！ => サーバー側は、req.bodyで取り出す！
        axios.post(server,{ user_id }) // { user_id:user_id }の省略
            .then( (res: any)=> {

                let axiosData:any = [];
                
                axiosData.push(...res.data);
            
                dispatch(removeTodo(axiosData));

            }).catch( (error)=>{
                console.log(error);
            });
    };

    return (
        <React.Fragment>
            {
                user === null ? 
                <h2 className={classes.title} >まずはログイン！</h2> :
                <React.Fragment>
                    {
                        todoData.length === 0 ? <h2>Todoの登録がありません！</h2>:
                        <React.Fragment>
                            <h2 className={classes.title} >Todo一覧画面</h2>
                            <div className={classes.text} >
                                <table className={classes.tableWidth} >
                                    <thead className={classes.todoTitle} >
                                        <tr>
                                            <th>登録 No</th>
                                            <th>チケット</th>
                                            <th>担当者</th>
                                            <th>期日</th>
                                            <th>開始日</th>
                                            <th></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            todoData.map(
                                                (todo: todoType, index: number)=>{
                                                    return (
                                                        <tr key={todo.id} className={classes.tableBody} >
                                                            <td>{index + 1}</td>
                                                            <td><Link to={`/detail/${todo.id}`} >{todo.todo}</Link></td>
                                                            <td>{todo.handler}</td>
                                                            <td>{todo.date}</td>
                                                            <td>{todo.start}</td>
                                                            <td><button onClick={ ()=>{remove(todo.id)} } className={classes.button} >削除</button></td>
                                                        </tr>
                                                    )
                                                }
                                            )
                                        }
                                    </tbody>
                                </table>
                                <p>チケット名をクリックすると、登録チケットの詳細確認および編集ができます！！</p>
                            </div>
                        </React.Fragment>
                    }
                </React.Fragment>
            }
        </React.Fragment>
    );
};

// ・チケット一覧画面
// 　・表示項目はID、チケット名、担当者 => クリア
// 　・一覧から削除ボタンを押すと削除可能 => クリア
// 　・チケット名を選択すると対象のチケット詳細画面を表示する => クリア