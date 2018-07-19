const fs = require('fs')
const cmd = require('node-cmd')
const child = require('child_process').exec
console.log('启动服务成功！')
console.log('请打开另外的terminal or cmd窗口执行 npm run dev')
console.log('请通过 http://localhost:5000 访问资源')
child('http-server -p 5000 ./resource',(a,b,c)=>{
  'use strict'
  console.log(a)
  console.log(b)
  console.log(c)
})

