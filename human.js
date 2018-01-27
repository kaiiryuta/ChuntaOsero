// ------------------------------
// 人間
// ------------------------------
// コンストラクタ
// 引数のターンによって自分の色と相手の色を設定
var Human = function(inTurn){
    if (inTurn === SENKOU) {
        this.iroZibun = SIRO;
        this.iroAite = KURO;
    } else {
        this.iroZibun = KURO;
        this.iroAite = SIRO;
    }
};

// メソッド
Human.prototype = {
    // 駒を置く
    komaWoOku: function (x, y) {
        field[x][y].koma.iro = this.iroZibun;
    },
    
    // 駒を返す
    komaWoKaesu: function (x, y) {
        field[x][y].koma.iro = this.iroZibun;
    },
    
    // 駒が置けるかどうか判定する
    // 駒が置けたら、ついでに返すことのできる駒を返す
    canKomaWoOku: function (x, y) {
        // フラグ
        var isAble = FALSE;
        
        // クリックしたマスに駒が存在する場合はFALSEを返却する
        if (field[x][y].koma.iro !== NASI) {
            return FALSE;
        }
        
        // 上方向に返すことができる駒を探す
        if (this.sagasuUe(x, y) === TRUE) {
            // 上方向の駒を返す
            this.kaesuUe(x, y);
            isAble = TRUE;
        }
        
        // 右方向に返すことができる駒を探す
        if (this.sagasuMigi(x, y) === TRUE) {
            // 右方向の駒を返す
            this.kaesuMigi(x, y);
            isAble = TRUE;
        }
        
        // 下方向に返すことができる駒を探す
        if (this.sagasuSita(x, y) === TRUE) {
            // 下方向の駒を返す
            this.kaesuSita(x, y);
            isAble = TRUE;
        }
        
        // 左方向に返すことができる駒を探す
        if (this.sagasuHidari(x, y) === TRUE) {
            // 左方向の駒を返す
            this.kaesuHidari(x, y);
            isAble = TRUE;
        }
        
        // 右上方向に返すことができる駒を探す
        if (this.sagasuMigiUe(x, y) === TRUE) {
            // 右上方向の駒を返す
            this.kaesuMigiUe(x, y);
            isAble = TRUE;
        }
        
        // 右下方向に返すことができる駒を探す
        if (this.sagasuMigiSita(x, y) === TRUE) {
            // 右下方向の駒を返す
            this.kaesuMigiSita(x, y);
            isAble = TRUE;
        }
        
        // 左下方向に返すことができる駒を探す
        if (this.sagasuHidariSita(x, y) === TRUE) {
            // 左下方向の駒を返す
            this.kaesuHidariSita(x, y);
            isAble = TRUE;
        }
        
        // 左上方向に返すことができる駒を探す
        if (this.sagasuHidariUe(x, y) === TRUE) {
            // 左上方向の駒を返す
            this.kaesuHidariUe(x, y);
            isAble = TRUE;
        }
        
        // 一つの方向でも返した駒があればTRUE
        if (isAble === TRUE) {
            return TRUE;
        }
        
        // 返した駒がなければFALSE
        return FALSE;
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
    
    // 上方向の駒を返す
    // 1つ上より上のフィールドの反対の色の駒を返す
    // 反対の色の駒に達したら処理を抜ける
    kaesuUe: function (x, y) {
        for (i = y + 1; i < MAX; i++) {
            if (field[x][i].koma.iro === this.iroAite) {
                this.komaWoKaesu(x, i);
            } else {
                break;
            }
        }
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
    
    // 右方向の駒を返す
    // 1つ右より右のフィールドの反対の色の駒を返す
    // 反対の色の駒に達したら処理を抜ける
    kaesuMigi: function (x, y) {
        for (i = x + 1; i < MAX; i++) {
            if (field[i][y].koma.iro === this.iroAite) {
                this.komaWoKaesu(i, y);
            } else {
                break;
            }
        }
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
    
    // 下方向の駒を返す
    // 1つ下より下のフィールドの反対の色の駒を返す
    // 反対の色の駒に達したら処理を抜ける
    kaesuSita: function (x, y) {
        for (i = y - 1; i > MIN; i--) {
            if (field[x][i].koma.iro === this.iroAite) {
                this.komaWoKaesu(x, i);
            } else {
                break;
            }
        }
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
    
    // 左方向の駒を返す
    // 1つ左より左のフィールドの反対の色の駒を返す
    // 反対の色の駒に達したら処理を抜ける
    kaesuHidari: function (x, y) {
        for (i = x - 1; i > MIN; i--) {
            if (field[i][y].koma.iro === this.iroAite) {
                this.komaWoKaesu(i, y);
            } else {
                break;
            }
        }
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
    
    // 右上方向の駒を返す
    // 1つ右上より右上のフィールドの反対の色の駒を返す
    // 反対の色の駒に達したら処理を抜ける
    kaesuMigiUe: function (x, y) {
        var i = 1;
        while (1) {
            if (field[x + i][y + i].koma.iro === this.iroAite) {
                this.komaWoKaesu(x + i, y + i);
            } else {
                break;
            }
            // xもしくはyがMAXに達したらループを抜ける
            if ((x + i) > MAX || (y + i) > MAX) {
                break;
            }
            
            i++;
        }
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
    
    // 右下方向の駒を返す
    // 1つ右下より右下のフィールドの反対の色の駒を返す
    // 反対の色の駒に達したら処理を抜ける
    kaesuMigiSita: function (x, y) {
        var i = 1;
        while (1) {
            if (field[x + i][y - i].koma.iro === this.iroAite) {
                this.komaWoKaesu(x + i, y - i);
            } else {
                break;
            }
            // xがMAXもしくはyがMINに達したらループを抜ける
            if ((x + i) > MAX || (y - i) < MIN) {
                break;
            }
            
            i++;
        }
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
    
    // 左下方向の駒を返す
    // 1つ左下より左下のフィールドの反対の色の駒を返す
    // 反対の色の駒に達したら処理を抜ける
    kaesuHidariSita: function (x, y) {
        var i = 1;
        while (1) {
            if (field[x - i][y - i].koma.iro === this.iroAite) {
                this.komaWoKaesu(x - i, y - i);
            } else {
                break;
            }
            // xもしくはyがMINに達したらループを抜ける
            if ((x - i) < MIN || (y - i) < MIN) {
                break;
            }
            
            i++;
        }
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
    
    // 左上方向の駒を返す
    // 1つ左上より左上のフィールドの反対の色の駒を返す
    // 反対の色の駒に達したら処理を抜ける
    kaesuHidariUe: function (x, y) {
        var i = 1;
        while (1) {
            if (field[x - i][y + i].koma.iro === this.iroAite) {
                this.komaWoKaesu(x - i, y + i);
            } else {
                break;
            }
            // xがMINもしくはyがMAXに達したらループを抜ける
            if ((x - i) < MIN || (y + i) > MAX) {
                break;
            }
            
            i++;
        }
    }
};