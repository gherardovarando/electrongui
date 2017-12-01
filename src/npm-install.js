//to spawn npm process
//
//
//
const npm = require('npm')

npm.load({
  progress: false,
  force: true,
  color: false
}, () => {
  npm.install(process.argv[2], (err, p) => {
    if (err) process.exit(1)
    else process.exit(0)
  })
})
