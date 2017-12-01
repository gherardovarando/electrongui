//to spawn npm process
//
//
//
const npm = require('npm')
const {Duplex} = require('stream')

npm.load({
  json: true,
  logstream: process.stdout
},()=>{
  npm.search(process.argv[2], (err) => {
    if (err) process.exit(1)
    else process.exit(0)
  })
})
