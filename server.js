const http = require('http');
const fs = require('fs');
const path = require('path');

// Content type mapping including audio
//Köszi copilot :D (nem én írtam)
const CONTENT_TYPES = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'text/javascript',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.mp3': 'audio/mpeg',
    '.ogg': 'audio/ogg',
    '.ico': 'image/x-icon',
    '.svg': 'image/svg+xml',
    '.woff': 'font/woff',
    '.woff2': 'font/woff2',
    '.ttf': 'font/ttf'
};

const RATE_LIMIT = 20; // request percenként
const requestLog = new Map();

function isValidPath(filePath, rootDir) {
    return filePath.startsWith(rootDir) && !filePath.includes('..');
}

function sanitizeUrl(url) {
    return path.normalize(url).replace(/^(\.\.[\/\\])+/, '');
}

function checkRateLimit(ip) {
    const now = Date.now();
    const windowStart = now - 60000; // 1 perces ablak
    
    if (!requestLog.has(ip)) {
        requestLog.set(ip, [now]);
        return true;
    }

    const requests = requestLog.get(ip).filter(time => time > windowStart);
    requests.push(now);
    requestLog.set(ip, requests);

    return requests.length <= RATE_LIMIT;
}

var server = http.createServer(function(request, response) {
    const clientIp = request.socket.remoteAddress;
    if (!checkRateLimit(clientIp)) {
        response.writeHead(429, {'Content-Type': 'text/plain'});
        response.end('Too Many Requests');
        return;
    }

    const securityHeaders = { // A büdös kurva anyját hogy erre nincs module!
        'Content-Security-Policy': [
            "default-src 'self'",
            "script-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net https://cdn.tailwindcss.com",
            "style-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net",
            "font-src 'self' https://cdn.jsdelivr.net",
            "img-src 'self' data: https:",
            "connect-src 'self'"
        ].join('; '),
        'X-Content-Type-Options': 'nosniff',
        'X-Frame-Options': 'DENY',
        'X-XSS-Protection': '1; mode=block',
        'Strict-Transport-Security': 'max-age=31536000; includeSubDomains'
    };

    const sanitizedUrl = sanitizeUrl(request.url);
    const websiteRoot = path.join(__dirname, 'website');
    let filePath;

    if (sanitizedUrl === '/' || sanitizedUrl === '') {
        filePath = path.join(websiteRoot, 'index.html');
    } else {
        filePath = path.join(websiteRoot, sanitizedUrl.slice(1));
        if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
            filePath = path.join(filePath, 'index.html');
        }
    }

    if (!isValidPath(filePath, websiteRoot)) {
        response.writeHead(403, {'Content-Type': 'text/plain'});
        response.end('Forbidden');
        return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = CONTENT_TYPES[ext] || 'text/plain';

    fs.readFile(filePath, function(error, content) {
        if (error) {
            if (error.code === 'ENOENT') {
                console.log(`[${new Date().toISOString()}] 404: ${filePath}`);
                response.writeHead(404, {'Content-Type': 'text/plain'});
                response.end('File not found');
            } else {
                console.log(`[${new Date().toISOString()}] 500: ${filePath}`);
                response.writeHead(500, {'Content-Type': 'text/plain'});
                response.end('Server error');
            }
        } else {
            console.log(`[${new Date().toISOString()}] 200: ${filePath}`);
            response.writeHead(200, { 
                'Content-Type': contentType,
                ...securityHeaders 
            });
            response.end(content);
        }
    });
});

server.listen(3000, function() {
    console.log('Server running at http://localhost:3000');
});