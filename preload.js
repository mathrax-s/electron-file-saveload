// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
window.addEventListener('DOMContentLoaded', () => {
  const replaceText = (selector, text) => {
    const element = document.getElementById(selector)
    if (element) element.innerText = text
  }

  for (const type of ['chrome', 'node', 'electron']) {
    replaceText(`${type}-version`, process.versions[type])
  }
})

const { contextBridge, ipcRenderer } = require('electron')
const _fs = require('fs')

contextBridge.exposeInMainWorld(
  "api", {
  fs: _fs,

  // ダイアログを呼び出す
  Dialog: (msg) => ipcRenderer.send("dialog_p5", msg),

  // main.jsから__dirnameを取得する
  GetDirname: () => ipcRenderer.send("get_dirname"),

  // ダイアログのボタンを押した時、関数を呼び出し引数として渡す
  DialogResult: (f) => {
    ipcRenderer.on('result_dialog', (event, arg) => f(arg))
  },

  // main.jsから__dirnameを返し、関数を呼び出して引数として渡す
  DirnameGet: (f) => {
    ipcRenderer.on('dirname', (event, arg) => f(arg))
  }
})

