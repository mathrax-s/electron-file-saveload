// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// No Node.js APIs are available in this process because
// `nodeIntegration` is turned off. Use `preload.js` to
// selectively enable features needed in the rendering
// process.

// p5js
const s = (p) => {
  let saveButton;
  let loadButton;
  let savedata = { "data1": 100, "data2": 200, "data3": 300 };
  let loaddata;
  let pref_path;



  p.setup = () => {
    p.createCanvas(p.windowWidth, p.windowHeight);

    saveButton = p.createButton("save");
    saveButton.position(30, 30);
    saveButton.size(60, 60);
    saveButton.mousePressed(p.saveFile);

    loadButton = p.createButton("load");
    loadButton.position(90, 30);
    loadButton.size(60, 60);
    loadButton.mousePressed(p.loadFile);

    // main.jsへ、__dirnameを取得するための関数を呼び出す
    window.api.GetDirname();
    // __dirnameを取得できたら、呼ばれる関数を登録しておく
    window.api.DirnameGet((arg) => p.dirnameGet(arg));

    // ダイアログ選択したあと、呼ばれる関数を登録しておく
    window.api.DialogResult((arg) => p.dialogResult(arg));
  }

  p.draw = () => {
    p.background(50, 200, 100);

    p.textSize(14);
    p.textAlign(p.LEFT, p.CENTER);
    p.fill(255);
    p.noStroke();
    p.text(JSON.stringify(loaddata), 30, 150);
  }

  // __dirnameを取得できたとき
  p.dirnameGet = (arg) => {
    // console.group(arg);
    pref_path = arg + '/pref.json';;
  }

  // 設定の保存
  p.saveFile = () => {
    let exists = 0;
    // ファイルの存在を確認する
    if (window.api.fs.existsSync((pref_path))) {
      // console.log('存在する');
      exists = 1;
      window.api.Dialog('設定を上書きしますか？');
      //このあと、dialogのボタン選択が「OK」なら、
      // p.dialogResult 関数へ
    } else {
      // console.log('存在しない');
    }

    if (exists == 0) {
      // 書き込み実行
      p.saveProcess(pref_path, savedata);
    }

  }

  // ダイアログの返答があったとき呼ばれる
  // main.js の event.reply
  p.dialogResult = (arg) => {
    // OK のとき
    if (arg == 1) {
      //書き込み実行
      p.saveProcess(pref_path, savedata);
    }
  }

  // ファイル書き込み
  // JSONを文字列にして保存
  p.saveProcess = (_path, _data) => {
    const fs = window.api.fs;
    try {
      fs.writeFileSync(
        _path,
        JSON.stringify(_data),
        'utf8'
      )
    } catch (err) {
      // console.log(err)
    }
  }


  // ファイルの読み込み
  // 同階層に'pref.json'ファイルが存在していなければ、新規作成
  // 存在していれば、loaddataに読み込み
  p.loadFile = () => {

    let exists = 0;
    // ファイルの存在を確認する
    if (window.api.fs.existsSync((pref_path))) {
      // console.log('存在する');
      exists = 1;
    } else {
      // console.log('存在しない');
    }

    // 'pref.json'が存在していれば、JSON形式で読み込み
    if (exists == 1) {
      loaddata = p.loadJSON(pref_path);
      console.log(loaddata);
    } else {
      // 存在しないとき、'pref.json'を新規作成して書き込み実行
      p.saveProcess(pref_path, savedata);
    }
  }
}
const app = new p5(s)

