import { useState } from "react";

// 値をローカルストレージに保管して、持続させるためのカスタムフック => persist(持続する・保持する)
const usePersist = (ky: any, initVal: any)=> { // 2つの引数をとる

    const key = 'hooks' + ky;

    const value = ()=> {
        try {
            const item = window.localStorage.getItem(key); // ローカルストレージから値を取得する

            return item ? JSON.parse(item) : initVal; // 値を取得できていれば、

        } catch(err){ // errがでたとしても初期値を返す
            console.log(err);
            return initVal;
        };
    };

    const [savedValue ,setSavedValue] = useState(value);

    const setValue = (val: any)=> {
        try {
            setSavedValue(val);

            window.localStorage.setItem(key,JSON.stringify(val)); // 値を指定のkeyで保管する => valueは、JSON文字列に変換する(ローカルストレージは文字列保管！)

        } catch(err){
            console.log(err);
        };
    };

    return [savedValue, setValue]
};

export default usePersist;