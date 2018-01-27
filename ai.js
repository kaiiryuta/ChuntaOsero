// ------------------------------
// 置けるマスのリスト
// ------------------------------
// コンストラクタ
var CanMasuList = function(){
    this.canList = new Array();
};

CanMasuList.prototype = {
    // リストにマスを追加する
    push: function (canMasu) {
        this.canList.push(canMasu);
    },
    
    // マスを取得する
    get: function (num) {
        return this.canList[num];
    }
};


// ------------------------------
// 置けるマス
// ------------------------------
// コンストラクタ
var CanMasu = function(x, y, canNumKaesu){
    // x
    this.x = x;
    // y
    this.y = y;
    // 返すことのできる数
    this.canNumKaesu = canNumKaesu;
};


// ------------------------------
// ランダム君
// ランダムで配置可能なマスに駒を置く
// ------------------------------
// コンストラクタ
var RandomKun = function(inTurn){
    if (inTurn === SENKOU) {
        this.iroZibun = SIRO;
        this.iroAite = KURO;
    } else {
        this.iroZibun = KURO;
        this.iroAite = SIRO;
    }
};

RandomKun.prototype = {
    // 実行
    exec: function () {
        // 置けるマスのリストを取得する
        var canMasuList = new CanMasuList();
        canMasuList = this.getCanMasuList();
        
        // 置けるマスのリストが存在しない場合パスする
        if (canMasuList === "undefined" || canMasuList.length === 0) {
            alert(MSG_PASS_AI);
            switchTurn();
            
            // 処理終了
            return;
        }
        
        // 置くマスを決定する
        var masu = new CanMasu(-99, -99, -99);
        masu = this.decideOkuMasu(canMasuList);
        
        // キー無効フラグをFALSEにする
        flgKillInput = FALSE;
        
        // マスをクリックする
        onClickMasu(masu.x, masu.y, TRUE);
    },
    
    // 置けるマスのリストを取得する
    getCanMasuList: function () {
        // 置けるマスのリストを生成
        var canMasuList = new CanMasuList();
        // 返すことのできる数
        var canKaesuNum = 0;
        
        for (var x = MIN; x < MAX; x++) {
            for (var y = MIN; y < MAX; y++) {
                // 返すことのできる数を取得する
                canKaesuNum = this.getCanKaesuNum(x, y);
                
                // 返すことのできるマスが存在する場合
                if (canKaesuNum > 0) {
                    // 置けるマスのインスタンスを生成
                    var canMasu = new CanMasu(x, y, canKaesuNum);
                    // 置けるマスのリストにおけるマスのインスタンスを追加
                    canMasuList.push(canMasu);
                }
            }
        }
        
        return canMasuList;
    },
    
    // 置くマスを決定する
    // 置けるマスのリストからランダムで一つを選択する
    decideOkuMasu: function (canMasuList) {
        // リストの数を取得する
        var canListLength = canMasuList.canList.length;
        
        // ランダムで添え字を決定
        var decideSoezi = Math.floor( Math.random() * canListLength );
        
        // 置けるマスのリストから決定した添え字のマスを取得して返却
        return canMasuList.get(decideSoezi);
    },
    
    // 返すことのできる数を取得する
    getCanKaesuNum: function (x, y) {
        // 返すことのできる数
        var num = 0;
        
        // 選択したマスに駒が存在する場合は0を返却する
        if (field[x][y].koma.iro !== NASI) {
            return 0;
        }
        
        // 上方向に返すことができる駒を探す
        if (this.sagasuUe(x, y) === TRUE) {
            // 上方向の返すことのできる駒の数を取得する
            num += this.getCanKaesuNumUe(x, y, num);
        }
        
        // 右方向に返すことができる駒を探す
        if (this.sagasuMigi(x, y) === TRUE) {
            // 右方向の返すことのできる駒の数を取得する
            num += this.getCanKaesuNumMigi(x, y, num);
        }
        
        // 下方向に返すことができる駒を探す
        if (this.sagasuSita(x, y) === TRUE) {
            // 下方向の返すことのできる駒の数を取得する
            num += this.getCanKaesuNumSita(x, y, num);
        }
        
        // 左方向に返すことができる駒を探す
        if (this.sagasuHidari(x, y) === TRUE) {
            // 左方向の返すことのできる駒の数を取得する
            num += this.getCanKaesuNumHidari(x, y, num);
        }
        
        // 右上方向に返すことができる駒を探す
        if (this.sagasuMigiUe(x, y) === TRUE) {
            // 右上方向の返すことのできる駒の数を取得する
            num += this.getCanKaesuNumMigiUe(x, y, num);
        }
        
        // 右下方向に返すことができる駒を探す
        if (this.sagasuMigiSita(x, y) === TRUE) {
            // 右下方向の返すことのできる駒の数を取得する
            num += this.getCanKaesuNumMigiSita(x, y, num);
        }
        
        // 左下方向に返すことができる駒を探す
        if (this.sagasuHidariSita(x, y) === TRUE) {
            // 左下方向の返すことのできる駒の数を取得する
            num += this.getCanKaesuNumHidariSita(x, y, num);
        }
        
        // 左上方向に返すことができる駒を探す
        if (this.sagasuHidariUe(x, y) === TRUE) {
            // 左上方向の返すことのできる駒の数を取得する
            num += this.getCanKaesuNumHidariUe(x, y, num);
        }
        
        // 返すことのできる数を返却する
        return num;
    },
    
    // 上方向を探す
    sagasuUe: function (x, y) {
        // 1つ上のフィールドの駒の色が逆か判定
        if (field[x][y + 1].koma.iro === this.iroAite) {
            // 2つ上より上のフィールドに同じ色の駒があるか探す 
            for (i = y + 2; i < MAX; i++) {
                // 先に無色の駒がある場合はFALSE
                if (field[x][i].koma.iro === NASI) {
                    return FALSE;
                }
                // 発見したらTRUEを返却
                if (field[x][i].koma.iro === this.iroZibun) {
                    return TRUE;
                }
            }
        }
        
        return FALSE;
    },
    
    // 上方向の返すことのできる駒の数を取得する
    // 反対の色の駒に達したら処理を抜ける
    // 返すことのできる駒の数を返却する
    getCanKaesuNumUe: function (x, y, num) {
        for (i = y + 1; i < MAX; i++) {
            if (field[x][i].koma.iro === this.iroAite) {
                num++;
            } else {
                break;
            }
        }
        
        return num;
    },
    
    // 右方向を探す
    sagasuMigi: function (x, y) {
        // 1つ右のフィールドの駒の色が逆か判定
        if (field[x + 1][y].koma.iro === this.iroAite) {
            // 2つ右より右のフィールドに同じ色の駒があるか探す 
            for (i = x + 2; i < MAX; i++) {
                // 先に無色の駒がある場合はFALSE
                if (field[i][y].koma.iro === NASI) {
                    return FALSE;
                }
                // 発見したらTRUEを返却
                if (field[i][y].koma.iro === this.iroZibun) {
                    return TRUE;
                }
            }
        }
        
        return FALSE;
    },
    
    // 右方向の返すことのできる駒の数を取得する
    // 反対の色の駒に達したら処理を抜ける
    // 返すことのできる駒の数を返却する
    getCanKaesuNumMigi: function (x, y, num) {
        for (i = x + 1; i < MAX; i++) {
            if (field[i][y].koma.iro === this.iroAite) {
                 num++;
            } else {
                break;
            }
        }
        
        return num;
    },
    
    // 下方向を探す
    sagasuSita: function (x, y) {
        // 1つ下のフィールドの駒の色が逆か判定
        if (field[x][y - 1].koma.iro === this.iroAite) {
            // 2つ下より下のフィールドに同じ色の駒があるか探す 
            for (i = y - 2; i > MIN; i--) {
                // 先に無色の駒がある場合はFALSE
                if (field[x][i].koma.iro === NASI) {
                    return FALSE;
                }
                // 発見したらTRUEを返却
                if (field[x][i].koma.iro === this.iroZibun) {
                    return TRUE;
                }
            }
        }
        
        return FALSE;
    },
    
    // 下方向の返すことのできる駒の数を取得する
    // 反対の色の駒に達したら処理を抜ける
    // 返すことのできる駒の数を返却する
    getCanKaesuNumSita: function (x, y, num) {
        for (i = y - 1; i > MIN; i--) {
            if (field[x][i].koma.iro === this.iroAite) {
                 num++;
            } else {
                break;
            }
        }
        
        return num;
    },
    
    // 左方向を探す
    sagasuHidari: function (x, y) {
        // 1つ左のフィールドの駒の色が逆か判定
        if (field[x - 1][y].koma.iro === this.iroAite) {
            // 2つ左より左のフィールドに同じ色の駒があるか探す 
            for (i = x - 2; i > MIN; i--) {
                // 先に無色の駒がある場合はFALSE
                if (field[i][y].koma.iro === NASI) {
                    return FALSE;
                }
                // 発見したらTRUEを返却
                if (field[i][y].koma.iro === this.iroZibun) {
                    return TRUE;
                }
            }
        }
        
        return FALSE;
    },
    
    // 左方向の返すことのできる駒の数を取得する
    // 反対の色の駒に達したら処理を抜ける
    // 返すことのできる駒の数を返却する
    getCanKaesuNumHidari: function (x, y, num) {
        for (i = x - 1; i > MIN; i--) {
            if (field[i][y].koma.iro === this.iroAite) {
                 num++;
            } else {
                break;
            }
        }
        
        return num;
    },
    
    // 右上方向を探す
    sagasuMigiUe: function (x, y) {
        // 1つ右上のフィールドの駒の色が逆か判定
        if (field[x + 1][y + 1].koma.iro === this.iroAite) {
            // 2つ右上より右上のフィールドに同じ色の駒があるか探す
            var i = 2;
            while(1) {
                // 先に無色の駒がある場合はFALSE
                if (field[x + i][y + i].koma.iro === NASI) {
                    return FALSE;
                }
                // 発見したらTRUEを返却
                if (field[x + i][y + i].koma.iro === this.iroZibun) {
                    return TRUE;
                }
                // xもしくはyがMAXに達したらループを抜ける
                if ( (x + i) > MAX || (y + i) > MAX  ) {
                    break;
                }
                
                i++;
            }
        }
        
        return FALSE;
    },
    
    // 右上方向の返すことのできる駒の数を取得する
    // 反対の色の駒に達したら処理を抜ける
    // 返すことのできる駒の数を返却する
    getCanKaesuNumMigiUe: function (x, y, num) {
        var i = 1;
        while (1) {
            if (field[x + i][y + i].koma.iro === this.iroAite) {
                 num++;
            } else {
                break;
            }
            // xもしくはyがMAXに達したらループを抜ける
            if ((x + i) > MAX || (y + i) > MAX) {
                break;
            }
            
            i++;
        }
        
        return num;
    },
    
    // 右下方向を探す
    sagasuMigiSita: function (x, y) {
        // 1つ右下のフィールドの駒の色が逆か判定
        if (field[x + 1][y - 1].koma.iro === this.iroAite) {
            // 2つ右下より右下のフィールドに同じ色の駒があるか探す
            var i = 2;
            while(1) {
                // 先に無色の駒がある場合はFALSE
                if (field[x + i][y - i].koma.iro === NASI) {
                    return FALSE;
                }
                // 発見したらTRUEを返却
                if (field[x + i][y - i].koma.iro === this.iroZibun) {
                    return TRUE;
                }
                // xがMAXもしくはyがMINに達したらループを抜ける
                if ( (x + i) > MAX || (y - i) < MIN  ) {
                    break;
                }
                
                i++;
            }
        }
        
        return FALSE;
    },
    
    // 右下方向の返すことのできる駒の数を取得する
    // 反対の色の駒に達したら処理を抜ける
    // 返すことのできる駒の数を返却する
    getCanKaesuNumMigiSita: function (x, y, num) {
        var i = 1;
        while (1) {
            if (field[x + i][y - i].koma.iro === this.iroAite) {
                 num++;
            } else {
                break;
            }
            // xがMAXもしくはyがMINに達したらループを抜ける
            if ((x + i) > MAX || (y - i) < MIN) {
                break;
            }
            
            i++;
        }
        
        return num;
    },
    
    // 左下方向を探す
    sagasuHidariSita: function (x, y) {
        // 1つ左下のフィールドの駒の色が逆か判定
        if (field[x - 1][y - 1].koma.iro === this.iroAite) {
            // 2つ左下より左下のフィールドに同じ色の駒があるか探す
            var i = 2;
            while(1) {
                // 先に無色の駒がある場合はFALSE
                if (field[x - i][y - i].koma.iro === NASI) {
                    return FALSE;
                }
                // 発見したらTRUEを返却
                if (field[x - i][y - i].koma.iro === this.iroZibun) {
                    return TRUE;
                }
                // xもしくはyがMINに達したらループを抜ける
                if ( (x - i) < MIN || (y - i) < MIN  ) {
                    break;
                }
                
                i++;
            }
        }
        
        return FALSE;
    },
    
    // 左下方向の返すことのできる駒の数を取得する
    // 反対の色の駒に達したら処理を抜ける
    // 返すことのできる駒の数を返却する
    getCanKaesuNumHidariSita: function (x, y, num) {
        var i = 1;
        while (1) {
            if (field[x - i][y - i].koma.iro === this.iroAite) {
                 num++;
            } else {
                break;
            }
            // xもしくはyがMINに達したらループを抜ける
            if ((x - i) < MIN || (y - i) < MIN) {
                break;
            }
            
            i++;
        }
        
        return num;
    },
    
    // 左上方向を探す
    sagasuHidariUe: function (x, y) {
        // 1つ左上のフィールドの駒の色が逆か判定
        if (field[x - 1][y + 1].koma.iro === this.iroAite) {
            // 2つ左上より左上のフィールドに同じ色の駒があるか探す
            var i = 2;
            while(1) {
                // 先に無色の駒がある場合はFALSE
                if (field[x - i][y + i].koma.iro === NASI) {
                    return FALSE;
                }
                // 発見したらTRUEを返却
                if (field[x - i][y + i].koma.iro === this.iroZibun) {
                    return TRUE;
                }
                // xがMINもしくはyがMAXに達したらループを抜ける
                if ( (x - i) < MIN || (y + i) > MAX  ) {
                    break;
                }
                
                i++;
            }
        }
        
        return FALSE;
    },
    
    // 左上方向の返すことのできる駒の数を取得する
    // 反対の色の駒に達したら処理を抜ける
    // 返すことのできる駒の数を返却する
    getCanKaesuNumHidariUe: function (x, y, num) {
        var i = 1;
        while (1) {
            if (field[x - i][y + i].koma.iro === this.iroAite) {
                 num++;
            } else {
                break;
            }
            // xがMINもしくはyがMAXに達したらループを抜ける
            if ((x - i) < MIN || (y + i) > MAX) {
                break;
            }
            
            i++;
        }
        
        return num;
    }
};
