/**
 *
 * Parse file & name
 *
 * @param  {string} str
 */
const parseFileName = (str) => {
  const k = str.split('=');
  const b = JSON.parse(k[1].trim());
  return b;
};

/**
 *
 * Process part and generate json
 *
 * @param  {buffer} part
 */
const processPart = (part) => {
  const header = part.header.split(';');
  const filename = parseFileName(header[2]);
  const name = parseFileName(header[1]);
  const contentType = part.info.split(':')[1].trim();
  const file = { filename, name };
  Object.defineProperty(file, 'type', { value: contentType, writable: true, enumerable: true, configurable: true });
  Object.defineProperty(file, 'type', { value: contentType, writable: true, enumerable: true, configurable: true });
  Object.defineProperty(file, 'data', { value: Buffer.from(part.part), writable: true, enumerable: true, configurable: true });
  return file;
};

/**
 * Multipart Parser (Finite State Machine)
 *
 * usage:
 *
 * var multipart = require('./multipart.js');
 * var body = new Buffer(event['body-json'].toString(),'base64'); // AWS case
 * var body = new Buffer(req.body.toString(),'base64'); // Azure case
 *
 * var boundary = multipart.getBoundary(event.params.header['content-type']);
 * var parts = multipart.Parse(body,boundary);
 *
 * @param  {buffer} multipartBodyBuffer - Multipart Buffer
 * @param  {string} boundary - boundery value
 * @returns {Array}
 * [
 *  {
 *    filename: 'ca.pem',
 *    type: 'application/x-x509-ca-cert',
 *    name: 'cert'
 *    data: <Buffer 41 41 41 41 42 42 42 42>
 *  }
 * ]
 */
exports.Parse = (multipartBodyBuffer, boundary) => {
  let lastline = '';
  let header = '';
  let info = ''; let state = 0; let buffer = [];
  const allParts = [];

  for (let i = 0; i < multipartBodyBuffer.length; i += 1) {
    const oneByte = multipartBodyBuffer[i];
    const prevByte = i > 0 ? multipartBodyBuffer[i - 1] : null;
    const newLineDetected = !!(((oneByte === 0x0a) && (prevByte === 0x0d)));
    const newLineChar = !!(((oneByte === 0x0a) || (oneByte === 0x0d)));

    if (!newLineChar) {
      lastline += String.fromCharCode(oneByte);
    }

    if ((state === 0) && newLineDetected) {
      if ((`--${boundary}`) === lastline) {
        state = 1;
      }
      lastline = '';
    } else if ((state === 1) && newLineDetected) {
      header = lastline;
      state = 2;
      lastline = '';
    } else if ((state === 2) && newLineDetected) {
      info = lastline;
      state = 3;
      lastline = '';
    } else if ((state === 3) && newLineDetected) {
      state = 4;
      buffer = [];
      lastline = '';
    } else if (state === 4) {
      if (lastline.length > (boundary.length + 4)) lastline = ''; // mem save
      if ((((`--${boundary}`) === lastline))) {
        const j = buffer.length - lastline.length;
        const part = buffer.slice(0, j - 1);
        const p = { header, info, part };
        allParts.push(processPart(p));
        buffer = []; lastline = ''; state = 5; header = ''; info = '';
      } else {
        buffer.push(oneByte);
      }
      if (newLineDetected) lastline = '';
    } else if (state === 5) {
      if (newLineDetected) {
        state = 1;
      }
    }
  }
  return allParts;
};

/**
 *
 * read the boundary from the content-type header sent by the http client
 * this value may be similar to:
 * 'multipart/form-data; boundary=----WebKitFormBoundaryvm5A9tzU1ONaGP5B',
 *
 * @param  {string} header
 */
exports.getBoundary = (header) => {
  const items = header.split(';');
  if (items) {
    for (let i = 0; i < items.length; i += 1) {
      const item = (items[i].toString()).trim();
      if (item.indexOf('boundary') >= 0) {
        const k = item.split('=');
        return (k[1].toString()).trim();
      }
    }
  }
  return '';
};

