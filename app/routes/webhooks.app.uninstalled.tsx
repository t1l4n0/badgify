import type { ActionFunctionArgs } from "@remix-run/node";
import { authenticate } from "../shopify.server";
import pkg from "@prisma/client";
const { PrismaClient } = pkg;

const prisma = new PrismaClient();

export const action = async ({ request }: ActionFunctionArgs) => {
  const { topic, shop, session, admin } = await authenticate.webhook(request);

  if (!admin) {
    // The admin context isn't returned if the webhook fired after a shop was uninstalled.
    throw new Response();
  }

  switch (topic) {
    case "APP_UNINSTALLED":
      if (session) {
        // Cancel subscription when app is uninstalled
        await prisma.subscription.updateMany({
          where: { shop },
          data: { 
            status: "cancelled",
            updatedAt: new Date(),
          },
        });

        // Optionally, you could also delete the subscription record entirely
        // await prisma.subscription.deleteMany({
        //   where: { shop },
        // });

        console.log(`App uninstalled for shop: ${shop}, subscription cancelled`);
      }
      break;
    default:
      throw new Response("Unhandled webhook topic", { status: 404 });
  }

  throw new Response();
};