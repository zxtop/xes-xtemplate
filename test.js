process.stdout.write('ssss')
// process.stdin.resume()
process.stdin.setEncoding('utf8');
process.stdin.on('data',(chunk)=>{
  chunk = chunk.replace(/\s+/,'')
  console.log(chunk === 'y')
  process.exit()
})
