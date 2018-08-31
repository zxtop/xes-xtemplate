const ejs = require('ejs')
const path = require('path')
const fs = require('fs')
const fse = require('fs-extra')

module.exports = (options) => {
  'use strict'
  fse.remove(path.resolve('./src/code')).then(() => {

    fs.mkdirSync(path.resolve('./src/code'))
    let tempPages = '';
    let tempPages2 = "import * as stagesEvent from '../code/index.js'";
    options.pages.map((v, i) =>{
      tempPages+=`export {${v}} from '../code/${v}.js' \n`;
      fs.writeFileSync(path.resolve('./src/code/' + v + '.js'), 'export function ' + v + ' (vue,stages) {\n' +
        '//更改vue.stageObj可以切换舞台' + '\n' +
        '//this.stage是当前舞台' + '\n' +
        '//当前所有舞台数组stages' + '\n' +
        '}');
      fs.writeFileSync(path.resolve('./src/code/index.js'),tempPages);
      fs.writeFileSync(path.resolve('./src/core/bindStageEvent.js'),`${tempPages2}\n`+
        `export function bindStages(vue,stages){\n`+
        `stages.map((obj)=>{\n`+
            `if(obj.sourceId in stagesEvent){\n`+
              `stagesEvent[obj.sourceId].bind(obj.toObj())(vue,stages)\n`+
              `}\n`+
        `})}`)
    })
  });

  return new Promise((resolve, reject) => {
    ejs.renderFile(path.resolve('./init/index.ejs'), options, {debug: false}, (e, s) => {
      'use strict'
      console.log(e);
      fs.writeFile(path.resolve('./src/components/Index.vue'), s, (e) => {
        resolve()
      })

    })
  })

}
