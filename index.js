import http from 'http';
import url from 'url';

let dataStore = {
  data: { id: 1, message: 'Hello, World!', timestamp: new Date().toISOString() },
};

// List of random facts
const facts = [
  'The earth is round!',
  'Honey never spoils.',
  'A single cloud can weigh over a million pounds.',
  'Bananas are berries, but strawberries aren’t.',
  'Wombat poop is cube-shaped!'
];

const sendResponse = (res, statusCode, data) => {
  res.writeHead(statusCode, { 'Content-Type': 'application/json' });
  if (data) {
    res.end(JSON.stringify(data));
  } else {
    res.end();
  }
};

// To generate a new ID for messages
let messageId = 2;

const generateNewId = () => {
  return messageId++;
};

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const method = req.method;
  const path = parsedUrl.pathname;

  // GET request
  if (method === 'GET') {
    if (path === '/data') {
      return sendResponse(res, 200, dataStore);
    } else if (path === '/random-fact') {
      const randomFact = facts[Math.floor(Math.random() * facts.length)];
      return sendResponse(res, 200, { fact: randomFact });
    }
  }

  // POST request
  if (method === 'POST' && path === '/data') {
    let body = '';

    req.on('data', (chunk) => {
      body += chunk.toString();
    });

    req.on('end', () => {
      try {
        const newData = JSON.parse(body);
        newData.id = generateNewId();  // Generate a new incremental ID
        newData.timestamp = new Date().toISOString();  // Add a timestamp
        dataStore.data = newData;
        return sendResponse(res, 201, { message: 'Data saved successfully!', data: newData }); 
      } catch {
        return sendResponse(res, 400, { message: 'Invalid JSON format' });
      }
    });

    return;
  }

  // DELETE request
  if (method === 'DELETE' && path === '/data') {
    if (dataStore.data) {
      dataStore.data = null;
      return sendResponse(res, 200, { message: 'Data deleted successfully.' });
    } else {
      return sendResponse(res, 404, { message: 'Data not found.' });
    }
  }

  // PUT request
  if (method === 'PUT' && path === '/data') {
    let body = '';

    req.on('data', (chunk) => {
      body += chunk.toString();
    });

    req.on('end', () => {
      try {
        const updatedData = JSON.parse(body);
        if (dataStore.data) {
          updatedData.id = dataStore.data.id;  // Keep the original ID
          updatedData.timestamp = new Date().toISOString();  // Update timestamp
          dataStore.data = updatedData;
          return sendResponse(res, 200, { message: 'Data updated successfully.', data: updatedData }); 
        } else {
          return sendResponse(res, 404, { message: 'Data not found.' }); 
        }
      } catch {
        return sendResponse(res, 400, { message: 'Invalid JSON format' });
      }
    });

    return;
  }

  // Send 404
  return sendResponse(res, 404, { message: 'Resource not found' });
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
