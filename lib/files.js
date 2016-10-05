const fs = require('fs');

const readFile = filename => new Promise((resolve, reject) => {
  fs.readFile(filename, 'utf-8', (err, content) => {
    if (err) {
      reject(err);
      return;
    }
    resolve({
      filename,
      content,
    });
  });
});


const readDir = dirname => new Promise((resolve, reject) => {
  fs.readdir(dirname, (err, filenames) => {
    if (err) {
      reject(err);
      return;
    }
    resolve(filenames.map(filename => dirname + filename));
  });
});

module.exports = {
  readDir,
  readFile,
};
