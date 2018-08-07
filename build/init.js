const path = require('path')
const request = require('request')
const fs = require('fs')
const cp = require('child_process')

const config = require('../config/resource.conf.json')
const tPath = path.resolve(config.path)
const inquirer = require('inquirer')
const prompt = inquirer.createPromptModule()
const plugins = require('../config/plugins.conf')
let packageJson = require('../package.json')
let counter = 0

//266c98ed3638c4eb22c80fb690d108ea
function downloadUrl () {
  if (!fs.existsSync(path.resolve('./resource'))) {
    fs.mkdirSync(path.resolve('./resource'))
  }
  // process.stdin.setEncoding('utf-8')
  // process.stdout.write('请输入resourceID : ')
  prompt({type:'input',name:'resourceID',message:['please input a resourceID: ']}).then(answer=>{
    'use strict'
    console.log(answer)
      let chunk = answer.resourceID
      request('http://testmv.xesimg.com/courseware_pages/' + chunk + '/resource.json', (e, data) => {
        if (e || data.statusCode !== 200) {
          console.log('resourceID错误，error: ', e)
        }
        console.log('================================================')
        let response = ''
        let urlList = ''
        try {
          response = JSON.parse(data.body)
        } catch (e) {
          console.log('error code: ', e)
          process.exit()
        }
        urlList = response.list
        urlList.map(url => {
          if (!config.exclude.includes(url.ext)) {
            let temp = url.host + url.src.slice(1)
            console.log('resource:', url.name + '.' + url.ext)
            request(temp).pipe(fs.createWriteStream(tPath + '/' + url.name + '.' + url.ext))
          }
        })
        console.log('resource: resource.json')
        request('http://testmv.xesimg.com/courseware_pages/' + chunk + '/resource.json').pipe(fs.createWriteStream(tPath + '/resource.json'))
        console.log('resource: main.json')
        request('http://testmv.xesimg.com/courseware_pages/' + chunk + '/main.json').pipe(fs.createWriteStream(tPath + '/main.json'))
        console.log('resource: moduleConfig.json')
        request('http://testmv.xesimg.com/courseware_pages/' + chunk + '/moduleConfig.json').pipe(fs.createWriteStream(tPath + '/moduleConfig.json'))
        console.log('================================================')

        let cnpm = true
        prompt({type: 'list', name: 'cnpm', choices: ['yes', 'no']})
          .then(a => {
            'use strict'
            // if(a.choice)
            console.log(a)
            if (a.cnpm === 'yes') {
              cnpm = true
            } else {
              cnpm = false
            }
            return prompt({type: 'checkbox', name: 'choice', choices: plugins.plugins})
          })
          .then(answer => {
            'use strict'
            return new Promise((resolve, reject) => {
              answer.choice.map((v, i) => {
                console.log('================================================')
                console.log('正在安装插件: ' + v)
                console.log('================================================')
                cp.exec(cnpm ? 'cnpm' : 'npm' + ' install --save ' + v, (e, a) => {
                  if (e !== null) {
                    console.log(a)
                    if (i === answer.choice.length - 1) {
                      resolve()
                    }
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

            } else {

            }
          })
      })

  })


}

downloadUrl()
