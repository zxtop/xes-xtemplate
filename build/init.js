const path = require('path')
const request = require('request')
const fs = require('fs')
const resource = require('../resource/resource.json')
const config = require('../config/resource.conf.json')
const tPath = path.resolve(config.path)

function downloadUrl (urlList) {
  console.log('Start download resources!')
  urlList.map(url => {
    if(!config.exclude.includes(url.ext)){
      let temp = url.host + url.src.slice(1)
      console.log('resource:',url.name+'.'+url.ext)
      request(temp).pipe(fs.createWriteStream(tPath+'/'+url.name+'.'+url.ext))
    }
  })
}

downloadUrl(resource.list)
