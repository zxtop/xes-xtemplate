const path = require('path')
const request = require('request')
const fs = require('fs')
const resource = require('../resource/resource.json')
const config = require('../config/resource.conf.json')
const tPath = path.resolve(config.path)
function downloadUrl (urlList) {
  console.log('Start download resources!')
  urlList.map(url => {
    if (!config.exclude.includes(url.ext)) {
      let temp = url.host + url.src.slice(1)
      console.log('resource:', url.name + '.' + url.ext)
      request(temp).pipe(fs.createWriteStream(tPath + '/' + url.name + '.' + url.ext))
    }
  })
  process.stdout.write('是否启动资源服务？ y/n : ')
  process.stdin.resume()
  process.stdin.setEncoding('utf-8')
  process.stdin.on('data',(chunk)=>{
    chunk = chunk.replace(/\s+/,'')
    if(chunk === 'y'){
      console.log('开启服务中......')
      process.exit()
    }else {
      console.log('cancel')
      process.exit()
    }
  })
  process.stdin.on('end',()=>{
    'use strict'
    console.log('aaaaa')
  })
}

downloadUrl(resource.list)
