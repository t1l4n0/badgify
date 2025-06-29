import type { ActionFunctionArgs } from "@remix-run/node";
import { authenticate } from "../shopify.server";
import { json } from "@remix-run/node";

export const action = async ({ request }: ActionFunctionArgs) => {
  try {
    const { topic, shop, body } = await authenticate.webhook(request);

    if (topic !== "CUSTOMERS_DATA_REQUEST") {
      throw new Response("Unhandled webhook topic", { status: 422 });
    }

    console.log(`Received ${topic} webhook for ${shop}`);
    
    // Parse the webhook payload
    const payload = JSON.parse(body);
    const customerId = payload.customer?.id;
    const shopDomain = payload.shop_domain;
    
    console.log(`Customer data request for customer ${customerId} from shop ${shopDomain}`);
    
    // GDPR Compliance: Handle customer data request
    // In a real app, you would:
    // 1. Collect all customer data from your database
    // 2. Format it according to GDPR requirements
    // 3. Send it to the customer or make it available for download
    // 4. Log the request for compliance records
    
    // For this demo app, we'll just log the request
    // In production, implement proper data collection and delivery
    
    const complianceData = {
      request_id: payload.data_request?.id,
      customer_id: customerId,
      shop_domain: shopDomain,
      requested_at: new Date().toISOString(),
      status: "processed",
      data_collected: {
        // Example of what data you might collect:
        // subscription_data: "Any subscription information stored",
        // billing_history: "Any billing records",
        // app_usage: "Any usage analytics stored"
        note: "This app stores minimal customer data. Only subscription status and billing information."
      }
    };
    
    console.log("GDPR Data Request processed:", complianceData);
    
    // In production, you would:
    // 1. Store this request in your compliance log
    // 2. Actually collect and send the customer data
    // 3. Notify relevant parties
    
    return json({ success: true, processed_at: new Date().toISOString() });
    
  } catch (error) {
    console.error("Error processing customers/data_request webhook:", error);
    return json({ error: "Failed to process webhook" }, { status: 500 });
  }
};

