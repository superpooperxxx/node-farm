const http = require('http');
const fs = require('fs');
const url = require('url');
const { placeholders } = require('./dev-data/placeholders');
const { replaceTemplate } = require('./utils/replaceTemplate/replaceTamplate');

// SERVER
const data = fs.readFileSync('./dev-data/data.json', 'utf-8');
const dataObj = JSON.parse(data);

// PORT
const PORT = process.env.PORT;

const server = http.createServer((req, res) => {
  const { query, pathname } = url.parse(req.url, true);

  // OVERVIEW page
  if (pathname === '/' || pathname === '/overview') {
    fs.readFile('./templates/template-overview.html', 'utf-8', (err, overviewTemplate) => {
      fs.readFile('./templates/template-card.html', 'utf-8', (err, cardTemplate) => {
        const cardsHTML = dataObj
          .map(product => replaceTemplate(cardTemplate, product, placeholders))
          .join('');

        const overviewPage = overviewTemplate.replace('{%PRODUCT__CARDS%}', cardsHTML);
        
        res.writeHead(200, {
          'Content-Type': 'text/html',
        });
  
        res.end(overviewPage);
      });
    });

    // PRODUCT page
  } else if (pathname === '/product') {
    fs.readFile('./templates/template-product.html', 'utf-8', (err, productTemplate) => {
      const productData = dataObj.find(product => product.id === +query.id);
      
      const productPage = replaceTemplate(productTemplate, productData, placeholders);

      res.writeHead(200, {
        'Content-Type': 'text/html',
      });

      res.end(productPage);
    });

    // API
  } else if (pathname === '/api') {
    fs.readFile('./dev-data/data.json', 'utf-8', (err, data) => {
      res.writeHead(200, {
        'Content-Type': 'application/json',
      })
      res.end(data);
    });

    // NOT FOUND
  } else {
    res.writeHead(404, {
      'Content-Type': 'text/html',
    })
    res.end('<h1>Page not found</h1>');
  }
});

server.listen(PORT, () => {
  console.log(`Server is now running at http://localhost:${PORT}`);
});
