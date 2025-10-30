const axios = require("axios");
const { envConfig } = require("../../config");
const { WA_BOT_API_KEY } = envConfig;

class WhatsappService {
  async sendMessage(phoneNumber) {
    try {
      if (!phoneNumber) {
        throw new Error("Phone number is required");
      }

      const response = await axios.get(
        "https://app.wtbotbuilder.com/api/v1/whatsapp/send/template",
        {
          params: {
            apiToken: WA_BOT_API_KEY,
            phone_number_id: "563918603461441",
            template_id: "156754",
            phone_number: phoneNumber,
          },
        }
      );

      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error("Error sending WhatsApp message:", error);
      return {
        success: false,
        error: error.message || "Failed to send WhatsApp message",
      };
    }
  }
}

module.exports = WhatsappService;
