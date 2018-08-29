const ejs = require('ejs')
const path = require('path')
const fs = require('fs')
const fse = require('fs-extra')

module.exports = (options) => {
  'use strict'
  fse.remove(path.resolve('./src/code')).then(() => {

    fs.mkdirSync(path.resolve('./src/code'))
    let tempPages = ''
    options.pages.map((v, i) => {
      tempPages+=`import {${v}} from '../code/${v}.js' \n`
      fs.writeFileSync(path.resolve('./src/code/' + v + '.js'), 'export function ' + v + ' (vue,stages) {\n' +
        '//当前舞台对象vue.stageObj' + '\n' +
        '//当前所有舞台数组stages' + '\n' +
        '\n' +
        '}')
      fs.writeFileSync(path.resolve('./src/core/files.js'),`${tempPages} console.log('abc')`)
    })
  })

  return new Promise((resolve, reject) => {
    ejs.renderFile(path.resolve('./init/index.ejs'), options, {debug: false}, (e, s) => {
      'use strict'
      console.log(e)
      fs.writeFile(path.resolve('./src/components/Index.vue'), s, (e) => {
        resolve()
      })

    })
  })

}
