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

const _cliProgress = require('cli-progress')
const initCode = require('./initCode')

const _colors = require('colors')
const error = clc.red.bold
const warn = clc.cyanBright
const notice = clc.magentaBright

let installedPlugins = []
let resources = []
let options = {}

const resBar = new _cliProgress.Bar({
  clearOnComplete: true,
  format: `installing plugins [${_colors.blue('{bar}')}] {percentage}% | resource: {name} | {value}/{total}`
}, _cliProgress.Presets.shades_classic)

const bar = new _cliProgress.Bar({
  clearOnComplete: true,
  format: `installing plugins [${_colors.blue('{bar}')}] {percentage}% | plugin: {name} | {value}/{total}`
}, _cliProgress.Presets.shades_classic)

if (!fs.existsSync(path.resolve('./resource'))) {
  fs.mkdirSync(path.resolve('./resource'))
}

if (!fs.existsSync(path.resolve('./resource/main.json'))) {
  init()
} else {
  prompt({
    type: 'list',
    name: 'resource',
    message: 'Do you want to use the exists resources?',
    choices: ['yes', 'no']
  }).then(answer => {
    'use strict'
    if (answer.resource === 'yes') {
      prompt({type: 'list', name: 'http-server', choices: ['yes', 'no']}).then((answer) => {
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
    } else {
      init()
    }
  })
}

function removeFiles () {
  return new Promise((resolve, reject) => {
    'use strict'
    fs.readdir(path.resolve('./resource'), (e, files) => {
      'use strict'
      if (files.length === 0) resolve()
      files.map((v, i) => {
        fs.unlinkSync(path.resolve('./resource/' + v))
        if (i <= files.length - 1) {
          resolve()
        }
      })
    })
  })
}

function init () {
  removeFiles().then(() => {
    'use strict'
    return prompt({type: 'list', name: 'canvas', message: ['Use canvas renderer or not: '], choices: ['yes', 'no']})
  })
    .then(an => {
      'use strict'
      options.canvas = an.canvas === 'yes'
      return prompt({type: 'input', name: 'resourceID', message: ['please input a resourceID: ']})
    })
    .then(answer => {
      'use strict'
      let chunk = answer.resourceID
      request(config['baseUrl'] + chunk + '/resource.json', (e, data) => {
        if (e || data.statusCode !== 200) {
          console.log(error('resourceID错误，error: ' + e))
        }
        let response = ''
        try {
          console.log(data.body)
          response = JSON.parse(data.body)
        } catch (e) {
          console.log(error('error code: ' + e))
          process.exit()
        }
        let urlList = response.list
        resBar.start(urlList.length + 3, 0, {name: urlList[0].name + '.' + urlList[0].ext})
        urlList.map((url, i) => {
          if (!config.exclude.includes(url.ext)) {
            let temp = url.host + url.src.slice(1)
            resources.push(url.name + '.' + url.ext)
            request(temp).pipe(fs.createWriteStream(tPath + '/' + url.name + '.' + url.ext))
            resBar.update(i, {name: url.name + '.' + url.ext})
          }
        })
        request(config['baseUrl'] + chunk + '/resource.json').pipe(fs.createWriteStream(tPath + '/resource.json'))
        resBar.update(urlList.length + 1, {name: 'resource.json'})
        resources.push('resource.json')
        request(config['baseUrl'] + chunk + '/main.json', (e, data) => {
          let mainData = ''
          try {
            mainData = JSON.parse(data.body)
            options.modelType = mainData.pages[0].modelType
            options.pages = []
            mainData.pages.map((v, i) => {
              let temp = null
              if (v.sourceId === undefined) {temp = 'stage' + i} else {temp = v.sourceId}
              options.pages.push(temp)
            })
          } catch (e) {
            console.log(error('error code: ' + e))
            process.exit()
          }
        }).pipe(fs.createWriteStream(tPath + '/main.json'))
        resBar.update(urlList.length + 2, {name: 'main.json'})
        resources.push('main.json')
        request(config['baseUrl'] + chunk + '/moduleConfig.json').pipe(fs.createWriteStream(tPath + '/moduleConfig.json'))
        resBar.update(urlList.length + 3, {name: 'moduleConfig.json'})
        resources.push('moduleConfig.json')
        resBar.stop()
        console.log(notice('================================================================================================'))
        resources.map(v => console.log(warn(v)))
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
            answer.plugins.push(plugins.innerPlugins[options.modelType - 1])
            answer.plugins = answer.plugins.concat(plugins.dependencePlugins)
            options.plugins = answer.plugins
            return new Promise((resolve, reject) => {
              if (answer.plugins.length === 0) resolve()
              bar.start(answer.plugins.length, 0, {name: null})
              installedPlugins = answer.plugins
              let i = 0
              answer.plugins.map((v) => {
                let cmd = (cnpm ? 'cnpm' : 'npm') + ' install ' + v
                cp.exec(cmd, (e, a) => {
                  if (e === null) {
                    bar.update(i + 1, {name: v})
                    if (i === answer.plugins.length) {
                      resolve(options)
                    }
                  } else {
                    console.log(error(`插件${v}安装失败！code： ${e}`))
                  }
                  i++
                })
              })
              let iRender = (cnpm ? 'cnpm' : 'npm') + ' install ' + plugins.renders[options.canvas ? 0 : 1]
              cp.exec(iRender, (e, a) => {
                if (e === null) {
                  bar.update(i + 1, {name: plugins.renders[options.canvas ? 0 : 1]})
                  if(i===answer.plugins.length){
                    resolve(options)
                  }
                }else {
                  console.log(error(`插件${plugins.renders[options.canvas ? 0 : 1]}安装失败！code： ${e}`))
                }
                i++
              })
            })
          })
          .then((option) => {
            return initCode(option)
          })
          .then(() => {
            'use strict'
            bar.stop()
            console.log(warn(`installed plugins: `) + installedPlugins)
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


