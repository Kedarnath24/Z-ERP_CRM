// WhatsApp E-Bill Service using Waha API
export interface WhatsAppConfig {
  enabled: boolean;
  apiUrl: string;
  sessionName: string;
  phoneNumber: string;
  apiKey?: string;
  billTemplate: string;
}

export interface BillData {
  invoiceNumber: string;
  customerName: string;
  customerPhone: string;
  date: string;
  time: string;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  subtotal: number;
  discount?: number;
  tax?: number;
  total: number;
  paymentMethod: string;
  businessName: string;
  businessPhone?: string;
  businessAddress?: string;
}

class WhatsAppService {
  private getConfig(workspaceId: string = 'default'): WhatsAppConfig | null {
    try {
      const saved = localStorage.getItem(`whatsapp_config_${workspaceId}`);
      if (!saved) return null;
      return JSON.parse(saved);
    } catch {
      return null;
    }
  }

  private formatPhoneNumber(phone: string): string {
    // Remove all non-numeric characters
    const cleaned = phone.replace(/[^0-9]/g, '');
    
    // Add country code if not present
    let formatted = cleaned;
    if (!formatted.startsWith('91') && formatted.length === 10) {
      formatted = '91' + formatted;
    }
    
    // Add WhatsApp suffix
    return formatted + '@c.us';
  }

  private formatBillMessage(template: string, data: BillData): string {
    let message = template;
    
    // Replace simple variables
    message = message.replace(/\{\{businessName\}\}/g, data.businessName);
    message = message.replace(/\{\{invoiceNumber\}\}/g, data.invoiceNumber);
    message = message.replace(/\{\{date\}\}/g, data.date);
    message = message.replace(/\{\{time\}\}/g, data.time);
    message = message.replace(/\{\{subtotal\}\}/g, data.subtotal.toFixed(2));
    message = message.replace(/\{\{total\}\}/g, data.total.toFixed(2));
    message = message.replace(/\{\{paymentMethod\}\}/g, data.paymentMethod);
    message = message.replace(/\{\{phone\}\}/g, data.businessPhone || '');
    message = message.replace(/\{\{address\}\}/g, data.businessAddress || '');
    
    // Handle optional fields with conditional blocks
    if (data.discount && data.discount > 0) {
      message = message.replace(/\{\{#discount\}\}/g, '');
      message = message.replace(/\{\{\/discount\}\}/g, '');
      message = message.replace(/\{\{discount\}\}/g, data.discount.toFixed(2));
    } else {
      message = message.replace(/\{\{#discount\}\}[\s\S]*?\{\{\/discount\}\}/g, '');
    }
    
    if (data.tax && data.tax > 0) {
      message = message.replace(/\{\{#tax\}\}/g, '');
      message = message.replace(/\{\{\/tax\}\}/g, '');
      message = message.replace(/\{\{tax\}\}/g, data.tax.toFixed(2));
    } else {
      message = message.replace(/\{\{#tax\}\}[\s\S]*?\{\{\/tax\}\}/g, '');
    }
    
    // Format items list
    const itemsList = data.items
      .map((item, idx) => 
        `${idx + 1}. ${item.name} x${item.quantity} - ₹${(item.price * item.quantity / 100).toFixed(2)}`
      )
      .join('\n');
    message = message.replace(/\{\{items\}\}/g, itemsList);
    
    return message;
  }

  async sendBill(
    billData: BillData,
    workspaceId: string = 'default'
  ): Promise<{ success: boolean; message: string; messageId?: string }> {
    try {
      // Get configuration
      const config = this.getConfig(workspaceId);
      
      if (!config || !config.enabled) {
        return {
          success: false,
          message: 'WhatsApp integration is not enabled'
        };
      }

      // Validate customer phone
      if (!billData.customerPhone) {
        return {
          success: false,
          message: 'Customer phone number is required'
        };
      }

      // Format phone number
      const chatId = this.formatPhoneNumber(billData.customerPhone);

      // Format message using template
      const message = this.formatBillMessage(config.billTemplate, billData);

      // Send via Waha API
      const response = await fetch(`${config.apiUrl}/api/sendText`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(config.apiKey && { 'X-Api-Key': config.apiKey })
        },
        body: JSON.stringify({
          session: config.sessionName,
          chatId: chatId,
          text: message
        })
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(error || 'Failed to send WhatsApp message');
      }

      const result = await response.json();

      // Log the sent bill
      this.logSentBill(billData.invoiceNumber, billData.customerPhone, workspaceId);

      return {
        success: true,
        message: 'Bill sent successfully via WhatsApp',
        messageId: result.id || result.messageId
      };

    } catch (error: any) {
      console.error('WhatsApp send error:', error);
      return {
        success: false,
        message: error.message || 'Failed to send WhatsApp message'
      };
    }
  }

  async sendTestMessage(
    phoneNumber: string,
    workspaceId: string = 'default'
  ): Promise<{ success: boolean; message: string }> {
    try {
      const config = this.getConfig(workspaceId);
      
      if (!config) {
        return {
          success: false,
          message: 'WhatsApp configuration not found'
        };
      }

      const chatId = this.formatPhoneNumber(phoneNumber);
      const businessName = localStorage.getItem('zervos_company') 
        ? JSON.parse(localStorage.getItem('zervos_company')!).name 
        : 'Zervos';

      const response = await fetch(`${config.apiUrl}/api/sendText`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(config.apiKey && { 'X-Api-Key': config.apiKey })
        },
        body: JSON.stringify({
          session: config.sessionName,
          chatId: chatId,
          text: `🧪 *Test Message from ${businessName}*\n\nYour WhatsApp E-Bill system is working perfectly! ✅\n\nYou'll receive your bills automatically via WhatsApp.`
        })
      });

      if (!response.ok) {
        throw new Error('Failed to send test message');
      }

      return {
        success: true,
        message: 'Test message sent successfully'
      };

    } catch (error: any) {
      return {
        success: false,
        message: error.message || 'Failed to send test message'
      };
    }
  }

  async checkConnection(
    workspaceId: string = 'default'
  ): Promise<{ connected: boolean; status?: string; message: string }> {
    try {
      const config = this.getConfig(workspaceId);
      
      if (!config) {
        return {
          connected: false,
          message: 'Configuration not found'
        };
      }

      const response = await fetch(`${config.apiUrl}/api/sessions/${config.sessionName}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...(config.apiKey && { 'X-Api-Key': config.apiKey })
        }
      });

      if (!response.ok) {
        throw new Error('Connection failed');
      }

      const data = await response.json();
      const isActive = data.status === 'WORKING' || data.status === 'ACTIVE';

      return {
        connected: isActive,
        status: data.status,
        message: isActive ? 'Connected successfully' : 'Session not active'
      };

    } catch (error: any) {
      return {
        connected: false,
        message: error.message || 'Connection failed'
      };
    }
  }

  private logSentBill(invoiceNumber: string, customerPhone: string, workspaceId: string): void {
    try {
      const key = `whatsapp_sent_bills_${workspaceId}`;
      const existing = JSON.parse(localStorage.getItem(key) || '[]');
      
      existing.push({
        invoiceNumber,
        customerPhone,
        sentAt: new Date().toISOString()
      });

      // Keep only last 100 records
      if (existing.length > 100) {
        existing.shift();
      }

      localStorage.setItem(key, JSON.stringify(existing));
    } catch (error) {
      console.error('Failed to log sent bill:', error);
    }
  }

  getSentBillsHistory(workspaceId: string = 'default'): Array<{
    invoiceNumber: string;
    customerPhone: string;
    sentAt: string;
  }> {
    try {
      const key = `whatsapp_sent_bills_${workspaceId}`;
      return JSON.parse(localStorage.getItem(key) || '[]');
    } catch {
      return [];
    }
  }

  isBillSent(invoiceNumber: string, workspaceId: string = 'default'): boolean {
    const history = this.getSentBillsHistory(workspaceId);
    return history.some(record => record.invoiceNumber === invoiceNumber);
  }
}

// Export singleton instance
export const whatsappService = new WhatsAppService();
