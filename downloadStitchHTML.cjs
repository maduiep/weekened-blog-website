const fs = require('fs');
const https = require('https');
const path = require('path');

const screens = [
  {"name":"projects/7607396395592791184/screens/5fd668bd15d54821929b45a21431dd52","title":"Mobile Money Payment Modal","htmlCode":{"downloadUrl":"https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ7Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpaCiVodG1sXzNhMjBkYmVjYjBiYTRjNTg5NjY4MmE1ODdjNTVhNzgxEgsSBxCfvL6DuxYYAZIBIwoKcHJvamVjdF9pZBIVQhM3NjA3Mzk2Mzk1NTkyNzkxMTg0&filename=&opi=96797242"}},
  {"name":"projects/7607396395592791184/screens/c3dd4bc2f7764263a95d61863e66cae1","title":"Secure Checkout","htmlCode":{"downloadUrl":"https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ7Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpaCiVodG1sXzhjNjQ4YzRmZjRkYjRmYTA4MjAxN2VhNDdlNDQ5NmE5EgsSBxCfvL6DuxYYAZIBIwoKcHJvamVjdF9pZBIVQhM3NjA3Mzk2Mzk1NTkyNzkxMTg0&filename=&opi=96797242"}},
  {"name":"projects/7607396395592791184/screens/bf92775652d745098298005adf8a137c","title":"Homepage","htmlCode":{"downloadUrl":"https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ7Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpaCiVodG1sXzkwODY3MjJhMmE1ZDQ0NDJiMmMzMjA0Yzk4ODgwNzUxEgsSBxCfvL6DuxYYAZIBIwoKcHJvamVjdF9pZBIVQhM3NjA3Mzk2Mzk1NTkyNzkxMTg0&filename=&opi=96797242"}},
  {"name":"projects/7607396395592791184/screens/27322a1cd6cb4ccfb32af74d1b7dff8f","title":"Authentication","htmlCode":{"downloadUrl":"https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ7Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpaCiVodG1sXzc0NWM3OGNjODgyMjQ4Nzc5N2RlMmRhODc2MjQyZWYyEgsSBxCfvL6DuxYYAZIBIwoKcHJvamVjdF9pZBIVQhM3NjA3Mzk2Mzk1NTkyNzkxMTg0&filename=&opi=96797242"}},
  {"name":"projects/7607396395592791184/screens/2a3defcd99824e7b8cf42f342441e30b","title":"Split-Screen Authentication Mobile","htmlCode":{"downloadUrl":"https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ7Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpaCiVodG1sX2U3NDNjODE5MDA2ZTQ5OWFiOWI2ZTY0OTQzOWFhYTdiEgsSBxCfvL6DuxYYAZIBIwoKcHJvamVjdF9pZBIVQhM3NjA3Mzk2Mzk1NTkyNzkxMTg0&filename=&opi=96797242"}},
  {"name":"projects/7607396395592791184/screens/bd108a8612fc4cd080b2abfc327f10fe","title":"User Dashboard","htmlCode":{"downloadUrl":"https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ7Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpaCiVodG1sXzQ1ZjFmNjQ3Zjg0NzQ0Y2NhMWVmZDc3NmQyOWVhMmU1EgsSBxCfvL6DuxYYAZIBIwoKcHJvamVjdF9pZBIVQhM3NjA3Mzk2Mzk1NTkyNzkxMTg0&filename=&opi=96797242"}},
  {"name":"projects/7607396395592791184/screens/64a8c4c95b2749e489f47737512eebf8","title":"Subscription Pricing","htmlCode":{"downloadUrl":"https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ7Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpaCiVodG1sXzNiZDU3N2FmNjk4NjRiZjg5OGQ3ZWQ1N2YxZWM4ZjM5EgsSBxCfvL6DuxYYAZIBIwoKcHJvamVjdF9pZBIVQhM3NjA3Mzk2Mzk1NTkyNzkxMTg0&filename=&opi=96797242"}},
  {"name":"projects/7607396395592791184/screens/1143ee331794430aa5c58c6d6d17368b","title":"Article Reading Page","htmlCode":{"downloadUrl":"https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ7Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpaCiVodG1sXzEwMDM5ZTM4MjNiZTQ2NDVhMDY5ODVmMjBiZGI5ZWEzEgsSBxCfvL6DuxYYAZIBIwoKcHJvamVjdF9pZBIVQhM3NjA3Mzk2Mzk1NTkyNzkxMTg0&filename=&opi=96797242"}},
  {"name":"projects/7607396395592791184/screens/3fb50eb0e5234c809139d1b2d65be928","title":"Business News Listing","htmlCode":{"downloadUrl":"https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ7Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpaCiVodG1sX2Y0MWFlYTk5NzdmNzQwMGM5MWQ1MzUwOWQ5Y2ZhMzljEgsSBxCfvL6DuxYYAZIBIwoKcHJvamVjdF9pZBIVQhM3NjA3Mzk2Mzk1NTkyNzkxMTg0&filename=&opi=96797242"}},
  {"name":"projects/7607396395592791184/screens/a905a5ee055249b9b67c92a57f298bb9","title":"Contact Us","htmlCode":{"downloadUrl":"https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ7Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpaCiVodG1sXzFlMWQyZDZmNTBiNjQyMjM4YjliNGQ2OGU0NTZkMGI1EgsSBxCfvL6DuxYYAZIBIwoKcHJvamVjdF9pZBIVQhM3NjA3Mzk2Mzk1NTkyNzkxMTg0&filename=&opi=96797242"}},
  {"name":"projects/7607396395592791184/screens/6b8293555db648678167ed543ee908e3","title":"EPaper Archive","htmlCode":{"downloadUrl":"https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ7Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpaCiVodG1sXzM1NDc0NjYwYmIwNzQzNGE5NmQ1NzQxZjZlMTFlYTAwEgsSBxCfvL6DuxYYAZIBIwoKcHJvamVjdF9pZBIVQhM3NjA3Mzk2Mzk1NTkyNzkxMTg0&filename=&opi=96797242"}},
  {"name":"projects/7607396395592791184/screens/723c8d217fcc41aca290922dbe60af5d","title":"Card Payment Modal","htmlCode":{"downloadUrl":"https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ7Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpaCiVodG1sXzU1ZDNkYzhiM2YyNjQ0YTE4Y2E3MjdlOTA2YjY1MmY2EgsSBxCfvL6DuxYYAZIBIwoKcHJvamVjdF9pZBIVQhM3NjA3Mzk2Mzk1NTkyNzkxMTg0&filename=&opi=96797242"}}
];

const targetFolder = path.join(__dirname, 'stitch-designs-html-export');
if (!fs.existsSync(targetFolder)) {
  fs.mkdirSync(targetFolder);
}

const sanitize = (name) => name.replace(/[^a-zA-Z0-9-]/g, '_').toLowerCase();

Promise.all(screens.map((screen) => {
  return new Promise((resolve, reject) => {
    const filename = `${sanitize(screen.title)}.html`;
    const filepath = path.join(targetFolder, filename);
    const file = fs.createWriteStream(filepath);
    
    https.get(screen.htmlCode.downloadUrl, (response) => {
      response.pipe(file);
      file.on('finish', () => {
        file.close();
        console.log(`Downloaded: ${filename}`);
        resolve();
      });
    }).on('error', (err) => {
      fs.unlink(filepath, () => {});
      console.error(`Error downloading ${filename}: ${err.message}`);
      reject(err);
    });
  });
})).then(() => {
  console.log('All downloads completed!');
});
