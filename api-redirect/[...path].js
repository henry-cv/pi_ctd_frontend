// api-redirect/[...path].js
export default function handler(req, res) {
    // Obtener la URL del backend directamente de las variables de entorno
    const backendUrl = process.env.BACKEND_URL || 'http://44.195.185.220:8080';
    
    // Log para depuración
    console.log(`Current environment: ${process.env.VERCEL_ENV}`);
    console.log(`Current branch: ${process.env.VERCEL_GIT_COMMIT_REF}`);
    console.log(`Using backend URL: ${backendUrl}`);
  
    // Construir la URL del backend
    const path = req.url.replace(/^\/api-redirect/, '');
    const targetUrl = `${backendUrl}${path}`;
    
    console.log(`Redirecting ${req.url} to ${targetUrl}`);
  
    // Redirigir la solicitud al backend
    return fetch(targetUrl, {
      method: req.method,
      headers: {
        ...req.headers,
        host: new URL(backendUrl).host,
      },
      body: req.method !== 'GET' && req.method !== 'HEAD' ? req.body : undefined,
    })
      .then(backendRes => {
        // Copiar el estado y los encabezados de la respuesta del backend
        const responseHeaders = {};
        backendRes.headers.forEach((value, key) => {
          responseHeaders[key] = value;
        });
  
        return backendRes.arrayBuffer().then(buffer => {
          const data = Buffer.from(buffer);
          
          // Devolver la respuesta al cliente
          res.status(backendRes.status);
          Object.entries(responseHeaders).forEach(([key, value]) => {
            res.setHeader(key, value);
          });
          res.send(data);
        });
      })
      .catch(error => {
        console.error('Error forwarding request:', error);
        res.status(500).json({ error: 'Error forwarding request to backend' });
      });
  }