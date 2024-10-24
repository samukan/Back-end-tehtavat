import http from 'http';
import url from 'url';

let dataStore = {
  data: { id: 1, message: 'Hello, World!' },
};

const sendResponse = (res, statusCode, data) => {
  res.writeHead(statusCode, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(data));
};

// Create server
const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const method = req.method;
  const path = parsedUrl.pathname;

  // GET request
  if (method === 'GET' && path === '/data') {
    return sendResponse(res, 200, dataStore);
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
        dataStore.data = newData;
        return sendResponse(res, 201, { message: 'Data saved successfully.', data: newData });
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
      return sendResponse(res, 200, { message: 'Data deleted.' });
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
          dataStore.data = updatedData;
          return sendResponse(res, 200, { message: 'Data updated.', data: updatedData });
        } else {
          return sendResponse(res, 404, { message: 'Data not found.' });
        }
      } catch {
        return sendResponse(res, 400, { message: 'Invalid JSON format' });
      }
    });

    return;
  }

  // Send 404 response for non-existing resources
  return sendResponse(res, 404, { message: 'Resource not found' });
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
