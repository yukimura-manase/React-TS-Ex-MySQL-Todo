import React, { useState, useEffect} from 'react';
import { useSelector } from 'react-redux';
import { stateType, loginUser } from './ComponentsTypes';
import { createStyles,makeStyles } from '@material-ui/styles'; //materialUI

const loginUserSelector = (state: stateType)=> {
    return state.StoreState.user;
  };

const useStyles = makeStyles(()=> {
    return createStyles({
        "title": {
            color:"#3399FF",
            textAlign:"left",
            fontSize:"35px",
            marginTop: "10px",
            marginLeft:"50px",
            marginBottom:"10px"
        },

    });
});


export const Home = ()=> {

    const user = useSelector(loginUserSelector);
    console.log(user);

    const [login_user, setUser] = useState<loginUser>(null);

    useEffect(()=>{
        
        if(user){
            setUser(user);
        };
    },[user]);


    const classes = useStyles();

    return (
             <div>  
                {
                    user === null ? true : <h3 className={classes.title} >{ user.name }さんのTodoアプリ✨</h3> 
                }
            </div>
    );
};