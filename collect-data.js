const fs = require('fs') 
const path = require('path')
const yaml = require('js-yaml')

const out = []
let re = /---(.*?)---/sg

function readAll(parentPath) {
    const files = fs.readdirSync(parentPath)
    // console.log(files);
    files.map(item => {
        let tempPath = path.join(parentPath, item);
        // let stats = fs.statSync(tempPath);
        const content = fs.readFileSync(tempPath, 'utf8')
        let s = re.exec(content)
        re.lastIndex = 0
        if (s) {
        let docs = yaml.load(s[1])
        docs.link = tempPath.slice(4, -3) + '.html'

        out.push(docs);
        }
      })
    
    
}

readAll('docs/posts')

if(out){
    // array sort by date asc
    out.sort(function(a, b) {
      var keyA = new Date(a.date),
        keyB = new Date(b.date);
      // Compare the 2 dates
      if (keyA < keyB) return -1;
      if (keyA > keyB) return 1;
      return 0;
    });
    // write json file
    const filePath = 'docs/.vitepress/components/posts.json';
    fs.writeFileSync(
      filePath,
      JSON.stringify(out),
      {
        encoding: 'utf8',
      }
    );
}else{
    console.log('write file error');
}

