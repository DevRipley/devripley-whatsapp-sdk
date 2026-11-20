# DevRipley WhatsApp SDK (prototype)

A minimal TypeScript client for the official WhatsApp Cloud API. This is an **unpublished prototype**, not affiliated with Meta. No live messages are sent by tests.

## Setup

```bash
npm ci
npm run check
```

## Example

```ts
import { WhatsAppClient } from './dist/index.js';
const client = new WhatsAppClient({
  accessToken: process.env.WHATSAPP_ACCESS_TOKEN!,
  phoneNumberId: process.env.WHATSAPP_PHONE_NUMBER_ID!,
  graphVersion: process.env.WHATSAPP_GRAPH_VERSION ?? 'v23.0',
});
await client.sendText('RECIPIENT_NUMBER', 'Hello from DevRipley');
```

Use a Graph API version supported by Meta for your deployment. Production work still needed: webhook signature verification, retries with backoff, rate-limit handling, templates, integration tests, changelog, and package release configuration. Do not send unsolicited messages.
