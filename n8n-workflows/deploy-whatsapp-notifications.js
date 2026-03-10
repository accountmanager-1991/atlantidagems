// Deploy Atlantida Order Notifications (WhatsApp) workflow to n8n
// Usage: node n8n-workflows/deploy-whatsapp-notifications.js

const https = require('https');

// Set N8N_API_KEY env var before running: export N8N_API_KEY="your-key-here"
const API_KEY = process.env.N8N_API_KEY;
if (!API_KEY) { console.error('Error: N8N_API_KEY environment variable is required'); process.exit(1); }
const BASE = 'emozca.app.n8n.cloud';

const workflow = {
  name: 'Atlantida - Order Notifications (WhatsApp)',
  nodes: [
    {
      parameters: {
        httpMethod: 'POST',
        path: 'atlantida-order-webhook',
        responseMode: 'onReceived',
        options: {}
      },
      name: 'Order Webhook',
      type: 'n8n-nodes-base.webhook',
      typeVersion: 2,
      position: [250, 300],
      webhookId: 'atlantida-order-webhook'
    },
    {
      parameters: {
        resource: 'message',
        operation: 'send',
        phoneNumberId: '1017967411400401',
        recipientPhoneNumber: '18099194205',
        textBody: '={{ $json.body.message }}'
      },
      name: 'WhatsApp Notification',
      type: 'n8n-nodes-base.whatsApp',
      typeVersion: 1.1,
      position: [500, 300],
      credentials: {
        whatsAppApi: {
          id: '',
          name: 'WhatsApp API account'
        }
      }
    }
  ],
  connections: {
    'Order Webhook': {
      main: [
        [
          {
            node: 'WhatsApp Notification',
            type: 'main',
            index: 0
          }
        ]
      ]
    }
  },
  settings: {
    executionOrder: 'v1'
  }
};

const data = JSON.stringify(workflow);

const options = {
  hostname: BASE,
  path: '/api/v1/workflows',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-N8N-API-KEY': API_KEY,
    'Content-Length': Buffer.byteLength(data)
  }
};

console.log('Deploying workflow to', BASE, '...');

const req = https.request(options, (res) => {
  let body = '';
  res.on('data', (chunk) => { body += chunk; });
  res.on('end', () => {
    if (res.statusCode === 200 || res.statusCode === 201) {
      const result = JSON.parse(body);
      console.log('\n--- SUCCESS ---');
      console.log('Workflow ID:', result.id);
      console.log('Name:', result.name);
      console.log('\nNext steps:');
      console.log('1. Open the workflow in n8n');
      console.log('2. Open "WhatsApp Notification" node → select your WhatsApp credential');
      console.log('3. Activate the workflow');
      console.log('4. Copy the Production webhook URL');
      console.log('5. Add it as N8N_ORDER_WEBHOOK_URL on Vercel');
    } else {
      console.error('Failed:', res.statusCode, body);
    }
  });
});

req.on('error', (e) => {
  console.error('Error:', e.message);
});

req.write(data);
req.end();
