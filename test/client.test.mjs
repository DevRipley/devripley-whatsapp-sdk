import test from 'node:test';
import assert from 'node:assert/strict';
import { WhatsAppClient, WhatsAppApiError } from '../dist/index.js';

const options = { accessToken: 'test-token', phoneNumberId: '123', graphVersion: 'v23.0' };

test('sends text with the expected Cloud API request', async () => {
  const client = new WhatsAppClient({ ...options, fetchImpl: async (url, request) => {
    assert.equal(url, 'https://graph.facebook.com/v23.0/123/messages');
    assert.equal(request.method, 'POST');
    assert.equal(request.headers.Authorization, 'Bearer test-token');
    assert.deepEqual(JSON.parse(request.body), {
      messaging_product: 'whatsapp', to: '18095550123', type: 'text', text: { body: 'Hello' },
    });
    return Response.json({ messaging_product: 'whatsapp', messages: [{ id: 'msg1' }] });
  }});
  const result = await client.sendText('18095550123', 'Hello');
  assert.equal(result.messages[0].id, 'msg1');
});

test('exposes HTTP status and API error details', async () => {
  const details = { error: { message: 'Unauthorized' } };
  const client = new WhatsAppClient({ ...options, fetchImpl: async () => Response.json(details, { status: 401 }) });
  await assert.rejects(client.sendText('123', 'Hello'), error => {
    assert.ok(error instanceof WhatsAppApiError);
    assert.equal(error.status, 401);
    assert.deepEqual(error.details, details);
    return true;
  });
});
