export interface ClientOptions {
  accessToken: string;
  phoneNumberId: string;
  graphVersion: string;
  fetchImpl?: typeof fetch;
}

export interface TextResponse {
  messaging_product: string;
  contacts?: Array<{ input: string; wa_id: string }>;
  messages?: Array<{ id: string }>;
}

export class WhatsAppApiError extends Error {
  constructor(public readonly status: number, public readonly details: unknown) {
    super('WhatsApp API returned HTTP ' + status);
    this.name = 'WhatsAppApiError';
  }
}

export class WhatsAppClient {
  private readonly fetchImpl: typeof fetch;

  constructor(private readonly options: ClientOptions) {
    if (!options.accessToken || !options.phoneNumberId || !/^v\d+\.\d+$/.test(options.graphVersion)) {
      throw new Error('Valid accessToken, phoneNumberId and graphVersion are required');
    }
    this.fetchImpl = options.fetchImpl ?? fetch;
  }

  async sendText(to: string, body: string): Promise<TextResponse> {
    if (!to || !body) throw new Error('Recipient and message body are required');
    const { graphVersion, phoneNumberId, accessToken } = this.options;
    const url = 'https://graph.facebook.com/' + graphVersion + '/' + encodeURIComponent(phoneNumberId) + '/messages';
    const response = await this.fetchImpl(url, {
      method: 'POST',
      headers: { Authorization: 'Bearer ' + accessToken, 'Content-Type': 'application/json' },
      body: JSON.stringify({ messaging_product: 'whatsapp', to, type: 'text', text: { body } }),
    });
    const data: unknown = await response.json();
    if (!response.ok) throw new WhatsAppApiError(response.status, data);
    return data as TextResponse;
  }
}
