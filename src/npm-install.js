//to spawn npm process
//
//
//
const npm = require('npm')

npm.load({
  progress: false,
  force: true,
  color: false
},()=>{
  npm.install(process.argv[2], (a, b) => {
    process.send({
      status: 'completed',
      a: a,
      b: b
    })
  })
})
