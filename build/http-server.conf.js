const fs = require('fs')
const cmd = require('node-cmd')
const child = require('child_process').exec
console.log('启动服务成功！')
console.log('请打开另外的terminal or cmd窗口执行 npm run dev')
console.log('您可通过 http://localhost:5000 访问资源')
console.log('ctrl-c 停止服务')
child('http-server ./resource -p 5000 --cors', (error, stdout, stderr) => {
  if (error) {
    console.error(`http-server命令错误: ${error}`)
    return
  }
  console.log(`http-server输出日志: ${stdout}`)
  console.log(`http-server启动错误: ${stderr}`)
})

