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
const _path = require('path')

contextBridge.exposeInMainWorld(
  "api", {
  fs: _fs,
  path: _path,

  //ダイアログを呼び出す
  Dialog: (msg) => ipcRenderer.send("dialog_p5", msg),

  //ダイアログのボタンを押した時、関数を呼び出し、引数を渡す
  DialogResult: (f) => {
    ipcRenderer.on('result_dialog', (event, arg) => f(arg))
  }
})

