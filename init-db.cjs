const fs = require('fs');
fetch('https://jsonblob.com/api/jsonBlob', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
  body: fs.readFileSync('./store.json', 'utf8')
}).then(res => {
  console.log("LOCATION:", res.headers.get('location'));
});
