// ------------------------------
// 定数
// ------------------------------
// 真偽値
// TRUE
var TRUE = 'TRUE';
// FALSE
var FALSE = 'FALSE';

// フィールド
// 最小幅
var MIN = 0;
// 最大幅
var MAX = 8;

// ターン
// 先行
var SENKOU = 'SENKOU';
// 後攻
var KOUKOU = 'KOUKOU';

// メッセージ
// 駒が置けない時
var MSG_CANNOT_SET = 'そこには置けません。';
// AIがパスするとき
var MSG_PASS_AI = 'AIはターンをパスします。';

// 色
// 無し
var NASI = 'NASI';
// 白
var SIRO = 'SIRO';
// 黒
var KURO = 'KURO';

// タイムアウト時間
// AI実行までの時間(ミリ秒)
var TIME_EXECAI = 1000;


// ------------------------------
// グローバル変数
// ------------------------------
// フィールド
var field;
// ターン
var turn;
// 人間 先行
var humanSenkou;
// 人間 後攻
var humanKoukou;
// キー無効フラグ
var flgKillInput;


// ------------------------------
// 初期化
// onload時(画面表示時)に呼び出されることを想定
// ------------------------------
function init() {
    // フィールドを生成
    field = createFiled();
    
    // ターンを設定
    turn = SENKOU;
    
    // 人間を生成
    humanSenkou = new Human(SENKOU);
    humanKoukou = new Human(KOUKOU);
    
    // AIボタンをFALSEに設定
    isSelectedAi = FALSE;
    
    // キー無効フラグをFALSEに設定
    flgKillInput = FALSE;
    
    // メッセージを設定
    document.getElementById('message').innerHTML = '先攻の番です。';
    
    // フィールドを描画
    viewField();
}

// ------------------------------
// フィールドの生成
// 二次元配列を生成する
// ------------------------------
function createFiled() {
    var field = new Array(MAX + 2);
    
    // (MIN - 2)～(MAX + 2)の範囲を初期化
    for (i = (MIN - 2); i < (MAX + 2); i++) {
        field[i] = new Array(MAX + 2);
    }
    
    // (MIN - 2)～(MAX + 2)の範囲をマスにする
    for (i = (MIN - 2); i < (MAX + 2); i++) {
        for (j = (MIN - 2); j < (MAX + 2); j++) {
            field[i][j] = new Masu();
        }
    }
    
    // 初期位置を設定
    field[MAX / 2 - 1] [MAX / 2 - 1].koma.iro = SIRO;
    field[MAX / 2]     [MAX / 2 - 1].koma.iro = KURO;
    field[MAX / 2 - 1] [MAX / 2].koma.iro = KURO;
    field[MAX / 2]     [MAX / 2].koma.iro = SIRO;
    
    return field;
}

// ------------------------------
// マスがクリックされた時の処理
// 現在のターンによって押した人間を判断する
// ------------------------------
function onClickMasu(x, y, isAi) {
    // キー無効フラグがTRUEの場合は処理を実行しない
    if (flgKillInput === TRUE) {
        return;
    }
    
    // 人間
    var human;
    
    // 現在のターンによって押した人間を判断
    if (turn === SENKOU) {
        human = humanSenkou;
    } else {
        human = humanKoukou;
    }
    
    // 駒を置けるか判定、返せる駒は返す
    var canKomaWoOku = human.canKomaWoOku(x, y);
    
    // 駒が置ければ駒を置く
    // 置けない場合はアラート出力して終了
    if (canKomaWoOku === TRUE) {
        human.komaWoOku(x, y);
    } else {
        alert(MSG_CANNOT_SET);
        
        return;
    }
    
    // フィールドを描画
    viewField();
    
    // ゲーム終了を判定
    // ゲーム終了の場合は結果を表示して終了
    if (isGameset() === TRUE) {
        // 結果を表示
        viewResultMessage();
        
        return;
    }
    
    // ターンを切り替え
    switchTurn();
    
    // メッセージを表示
    viewMessage();
    
    // AIがクリックしていない場合はAIを実行する
    if (isAi !== TRUE) {
        // キー無効フラグをTRUEにする
        flgKillInput = TRUE;
        // 指定された時間後にAIを実行する
        setTimeout(execAi, TIME_EXECAI);
    }
    
    // 処理終了
    return;
}

// ------------------------------
// ターンを切り替える
// ------------------------------
function switchTurn() {
    if (turn === SENKOU) {
        turn = KOUKOU;
    } else {
        turn = SENKOU;
    }
}

// ------------------------------
// メッセージを表示する
// ------------------------------
function viewMessage() {
    if (turn === SENKOU) {
        document.getElementById('message').innerHTML = '先攻の番です。';
    } else {
        document.getElementById('message').innerHTML = '後攻の番です。';
    }
}

// ------------------------------
// ゲーム終了を判定
// 全てのフィールドの駒が色無しでなければTRUE
// ------------------------------
function isGameset() {
    for (i = MIN; i < MAX; i++) {
        for (j = MIN; j < MAX; j++) {
            if (field[i][j].koma.iro === NASI) {
                return FALSE;
            }
        }
    }
    
    return TRUE;
}

// ------------------------------
// フィールドを描画
// ------------------------------
function viewField() {
    for (i = MIN; i < MAX; i++) {
        for (j = MIN; j < MAX; j++) {
            if (field[i][j].koma.iro === SIRO) {
                document.getElementById(String(i) + '-' +  String(j)).innerHTML = '〇';
            } else if (field[i][j].koma.iro === KURO) {
                document.getElementById(String(i) + '-' +  String(j)).innerHTML = '●';
            } else {
                document.getElementById(String(i) + '-' +  String(j)).innerHTML = '-';
            }
        }
    }
}

// ------------------------------
// 結果を表示
// ------------------------------
function viewResultMessage() {
    var numSiro = 0;
    var numKuro = 0;
    
    // 白と黒の数をカウント
    for (i = MIN; i < MAX; i++) {
        for (j = MIN; j < MAX; j++) {
            if (field[i][j].koma.iro === SIRO) {
                numSiro++;
            }
            if (field[i][j].koma.iro === KURO) {
                numKuro++;
            }
        }
    }
    
    // メッセージを表示
    document.getElementById('message').innerHTML = 'お疲れさまでした。　　先攻 :' + numSiro + ' 後攻 :' + numKuro;
}

// ------------------------------
// 「パス」ボタン押下時の処理
// ------------------------------
function onClickNextTurn(isAi) {
    // キー無効フラグがTRUEの場合は処理を実行しない
    if (flgKillInput === TRUE) {
        return;
    }
    
    if (window.confirm('パスします。よろしいですか？')) {
        switchTurn();
        viewMessage();
    }
    
    // AIがクリックしていない場合はAIを実行する
    if (isAi !== TRUE) {
        // キー無効フラグをTRUEにする
        flgKillInput = TRUE;
        // 指定された時間後にAIを実行する
        setTimeout(execAi, TIME_EXECAI);
    }
    
    return;
}

// ------------------------------
// 「やり直す」ボタン押下時の処理
// ------------------------------
function onClickInit() {
    // キー無効フラグがTRUEの場合は処理を実行しない
    if (flgKillInput === TRUE) {
        return;
    }
    
    if (window.confirm('初めからやり直します。よろしいですか？')) {
        init();
    }
    
    return;
}

// ------------------------------
// 「AI」が選択されていればAIを実行する
// ------------------------------
var execAi = function () {
    var isSelectedAi = false;
    
    // htmlからチェックボックスの選択状態を取得
    isSelectedAi = document.getElementById("isSelectedAi").checked;
    
    // AIモード選択時の場合にAIを実行
    if (isSelectedAi === true) {
        var ai;
        
        // htmlからAIの種類を取得
        // TODO 現在はランダム君のみ
        ai = new RandomKun(turn);
        
        // 取得したAIを実行
        ai.exec();
    } else {
        // AIモード選択時でない場合はキー無効フラグを解除する
        flgKillInput = FALSE;
    }
};
