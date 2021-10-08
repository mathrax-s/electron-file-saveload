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
  let message = '';

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
  }

  p.draw = () => {
    p.background(50, 200, 100);

    p.textSize(14);
    p.textAlign(p.LEFT, p.CENTER);
    p.fill(255);
    p.noStroke();
    p.text(JSON.stringify(loaddata), 30, 150);
  }

  // 設定の保存
  p.saveFile = () => {
    //JSONで保存
    p.save(savedata, "pref.json");
  }

  // 設定の読み込み
  p.loadFile = () => {
    // 同階層に'pref.json'ファイルが存在していなければ、新規作成
    // 存在していれば、loaddataに読み込み

    const path = window.api.path;
    const pref_path = path.resolve('') + '/pref.json';
    // console.log(pref_path);

    let exists = 0;
    // ファイルの存在を確認する
    if (window.api.fs.existsSync((pref_path))) {
      // console.log('存在する');
      exists = 1;
    } else {
      // console.log('存在しない');
      // 存在しないとき
      const fs = window.api.fs;
      // 'pref.json'を新規作成
      try {
        fs.writeFileSync(
          pref_path,
          JSON.stringify(savedata),
          'utf8'
        )
      } catch (err) {
        // console.log(err)
      }
    }

    // 'pref.json'が存在していれば、JSON形式で読み込み
    if (exists == 1) {
      loaddata = p.loadJSON(pref_path);
      console.log(loaddata);
    }
  }
}
const app = new p5(s)

