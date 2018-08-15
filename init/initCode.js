const ejs = require('ejs')
const path = require('path')
const fs = require('fs')
const fse = require('fs-extra')

module.exports = (options) => {
  'use strict'
  fse.remove(path.resolve('./src/code')).then(()=>{

    fs.mkdirSync(path.resolve('./src/code'))
    options.pages.map((v, i) => {
      fs.writeFileSync(path.resolve('./src/code/main' + i + '.js'), 'export function main' + i + ' () {\n' +
        '\n' +
        '}')
    })
  })



  return new Promise((resolve, reject) => {
    ejs.renderFile(path.resolve('./init/index.ejs'), options, {debug: false}, (e, s) => {
      'use strict'
      fs.writeFile(path.resolve('./src/components/Index.vue'), s, (e) => {
        resolve()
      })

    })
  })

}
