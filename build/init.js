const path = require('path')
const request = require('request')
const fs = require('fs')
const config = require('../config/resource.conf.json')
const tPath = path.resolve(config.path)
let counter = 0

function downloadUrl () {
  if(!fs.existsSync(path.resolve('./resource'))){
    fs.mkdirSync(path.resolve('./resource'))
  }
  process.stdin.setEncoding('utf-8')
  process.stdout.write('请输入resourceID : ')
  process.stdin.on('data', (chunk) => {
    chunk = chunk.replace(/\s+/, '')
    switch (counter) {
      case 0:
        request('http://testmv.xesimg.com/courseware_pages/' + chunk + '/resource.json', (e, data) => {
          if (e || data.statusCode !== 200) {
            console.log('resourceID错误，error: ', e)
          }
          console.log("================================================")
          let response = ''
          let urlList = ''
          try {
            response = JSON.parse(data.body)
          }catch (e){
            console.log('error code: ',e)
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
          process.stdout.write('是否开启服务： y/n : ')
          counter++
        })
        break
      case 1:
        if (chunk === 'y') {
          console.log('开启服务中......')
          console.log('启动服务成功！')
          console.log('请打开另外的terminal or cmd窗口执行 npm run dev')
          console.log('您可通过 http://localhost:5000 访问资源')
          console.log('回车停止服务')
          process.exit()
        } else {
          console.log('cancel')
          process.exit()
        }
    }

  })

}

downloadUrl()
