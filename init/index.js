const path = require('path')
const request = require('request')
const fs = require('fs')
const cp = require('child_process')
const clc = require('cli-color')
const config = require('../config/resource.conf.json')
const tPath = path.resolve(config.path)
const inquirer = require('inquirer')
const prompt = inquirer.createPromptModule()
const plugins = require('../config/plugins.conf')

const error = clc.red.bold
const warn = clc.cyanBright
const notice = clc.magentaBright

//266c98ed3638c4eb22c80fb690d108ea
function downloadUrl () {
  if (!fs.existsSync(path.resolve('./resource'))) {
    fs.mkdirSync(path.resolve('./resource'))
  }
  prompt({type: 'input', name: 'resourceID', message: ['please input a resourceID: ']}).then(answer => {
    'use strict'
    let chunk = answer.resourceID
    request('http://testmv.xesimg.com/courseware_pages/' + chunk + '/resource.json', (e, data) => {
      if (e || data.statusCode !== 200) {
        console.log(error('resourceID错误，error: ' + e))
      }
      console.log(notice('================================================================================================'))
      let response = ''
      try {
        response = JSON.parse(data.body)
      } catch (e) {
        console.log(error('error code: ' + e))
        process.exit()
      }
      let urlList = response.list
      urlList.map(url => {
        if (!config.exclude.includes(url.ext)) {
          let temp = url.host + url.src.slice(1)
          console.log(warn('resource:', url.name + '.' + url.ext))
          request(temp).pipe(fs.createWriteStream(tPath + '/' + url.name + '.' + url.ext))
        }
      })
      console.log(warn('resource: resource.json'))
      request('http://testmv.xesimg.com/courseware_pages/' + chunk + '/resource.json').pipe(fs.createWriteStream(tPath + '/resource.json'))
      console.log(warn('resource: main.json'))
      request('http://testmv.xesimg.com/courseware_pages/' + chunk + '/main.json').pipe(fs.createWriteStream(tPath + '/main.json'))
      console.log(warn('resource: moduleConfig.json'))
      request('http://testmv.xesimg.com/courseware_pages/' + chunk + '/moduleConfig.json').pipe(fs.createWriteStream(tPath + '/moduleConfig.json'))
      console.log(notice('================================================================================================'))

      let cnpm = true
      prompt({type: 'list', name: 'cnpm', choices: ['yes', 'no']})
        .then(a => {
          'use strict'
          if (a.cnpm === 'yes') {
            cnpm = true
          } else {
            cnpm = false
          }
          return prompt({type: 'checkbox', name: 'plugins', choices: plugins.plugins})
        })
        .then(answer => {
          'use strict'
          return new Promise((resolve, reject) => {
            if (answer.plugins.length === 0) resolve()
            answer.plugins.map((v, i) => {
              console.log(notice('================================================================================================'))
              console.log(warn('开始安装插件: ' + v))
              console.log(notice('================================================================================================'))
              let cmd = (cnpm ? 'cnpm' : 'npm') + ' install --save ' + v
              cp.exec(cmd, (e) => {
                if (e === null) {
                  console.log(warn('插件' + v + '安装成功！'))
                  if (i === answer.plugins.length - 1) {
                    console.log(warn('所有插件安装完成！'))
                    resolve()
                  }
                }else{
                  console.log(error(`插件${v}安装失败！code： ${e}`))
                }
              })
            })
          })

        })
        .then(() => {
          'use strict'
          return prompt({type: 'list', name: 'http-server', choices: ['yes', 'no']})
        })
        .then((answer) => {
          'use strict'
          if (answer['http-server'] === 'yes') {
            console.log(warn('启动资源server'))
            console.log(warn('正在启动......'))
            let childProcess = cp.exec('http-server -p 5000 ./resource --cors', (e, a) => {

            })
            childProcess.stdout.on('data', (e, a) => {
              console.log(notice(e))
            })
          } else {
            process.exit()
          }
        })
    })

  })

}

downloadUrl()
