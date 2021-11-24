import { useDispatch,useSelector } from 'react-redux';
import { deleteLoginUser } from '../actions/ActionCreator';
import { useHistory } from 'react-router-dom';
import { stateType } from './ComponentsTypes';
import { createStyles,makeStyles } from '@material-ui/styles';

// スタイルの関数
const useStyle = makeStyles(() =>
  createStyles(
        {
            "right":{
            textAlign:"left",
            },
            "buttonStyle":{
                fontWeight:700,
                fontSize:"25px",
                color: "white",
                borderColor: "#3399FF",
                backgroundColor:"#3399FF",
                margin:"5px 5px",
                outline: "none", /* クリックしたときに表示される枠線を消す */
                background:"transparent", /* 背景の灰色を消す */
                "&:hover":{
                backgroundColor:"white",
                color:"#3399FF"
                }
            },
        }
    )
);

const loginUserSelector = (state: stateType)=> {
    return state.StoreState.user;
  };

export const Nav: React.FC = ()=> {

    const classes = useStyle();

    const user = useSelector(loginUserSelector);

    const history = useHistory();
    const handleLink = (path: string) => { return history.push(path)};

    const dispatch = useDispatch();

    const logout = ()=> {
        dispatch(deleteLoginUser());
        window.localStorage.removeItem('username');
        window.localStorage.removeItem('pass');
        //console.log('ログアウト');
        handleLink('/user');
    };

    return (
        <nav>
            <div className={classes.right}>
                <button onClick={ ()=>{handleLink('/list') }} className={classes.buttonStyle} >Todo一覧画面</button>
                <button onClick={ ()=>{handleLink('/create') }} className={classes.buttonStyle} >Todo作成画面</button>
                { user === null ? <button onClick={ ()=>{handleLink('/user') }} className={classes.buttonStyle} >ログイン・新規登録画面</button> : false }
                { user === null ? true : <button onClick={ ()=>{ logout() } } className={classes.buttonStyle} >ログアウト</button> }
            </div>
        </nav>
    )
}