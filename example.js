const multipart = require('./multipart1');

const 	body = "------WebKitFormBoundaryvef1fLxmoUdYZWXp\r\n";
body += "Content-Disposition: form-data; name=\"uploads[]\"; filename=\"A.txt\"\r\n";
body += "Content-Type: text/plain\r\n",
body += "\r\n\r\n";
body += "@11X";
body += "111Y\r\n";
body += "111Z\rCCCC\nCCCC\r\nCCCCC@\r\n\r\n";
body += "------WebKitFormBoundaryvef1fLxmoUdYZWXp\r\n";
body += "Content-Disposition: form-data; name=\"uploads[]\"; filename=\"B.txt\"\r\n";
body += "Content-Type: text/plain\r\n",
body += "\r\n\r\n";
body += "@22X";
body += "222Y\r\n";
body += "222Z\r222W\n2220\r\n666@\r\n";
body += "------WebKitFormBoundaryvef1fLxmoUdYZWXp--\r\n";
const bodyData = Buffer.from(body,'utf-8'); 
const headers = 
{ 'cache-Control': 'no-cache',
  connection: 'Keep-Alive',
  accept: '*/*',
  'accept-Encoding': 'gzip, deflate, br',
  'accept-Language': 'en-US, en; q=0.9',
  host: 'device-provision.azurewebsites.net',
  'max-Forwards': '10',
  'user-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/67.0.3396.87 Safari/537.36',
  origin: 'chrome-extension://fhbjgbiflinjbdggehcddcbncdddomop',
  'postman-Token': 'f53c6bc6-1b93-b6d6-d2e6-f770efa00332',
  'x-WAWS-Unencoded-URL': '/api/v2',
  'cLIENT-IP': '103.254.244.202:59372',
  'iS-SERVICE-TUNNELED': '0',
  'x-ARR-LOG-ID': 'fc9cc38a-d8f4-4c6c-a8b3-f4f886f40ab7',
  'dISGUISED-HOST': 'device-provision.azurewebsites.net',
  'x-SITE-DEPLOYMENT-ID': 'device-provision',
  'wAS-DEFAULT-HOSTNAME': 'device-provision.azurewebsites.net',
  'x-Original-URL': '/api/provision/123',
  'x-Forwarded-For': '103.254.244.202:59372',
  'x-ARR-SSL': '2048|256|C=US, S=Washington, L=Redmond, O=Microsoft Corporation, OU=Microsoft IT, CN=Microsoft IT TLS CA 4|CN=*.azurewebsites.net',
  'x-Forwarded-Proto': 'https',
  'content-Length': '2481',
  'content-Type': 'multipart/form-data; boundary=----WebKitFormBoundaryEQunGaVccSvSBfrT' },
  
const contentType = multipart.getBoundary(headers['content-Type']);
const parts = multipart.Parse(new Buffer(body, 'utf-8'), contentType);
console.log(parts);
