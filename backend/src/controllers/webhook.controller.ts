import { Webhook } from "svix";
import { Request, Response } from "express";
import UserModel from "../models/user.model";

export const clerkWebhookHandler = async (req: Request, res: Response) => {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    throw new Error(
      "Please add CLERK_WEBHOOK_SECRET from Clerk Dashboard to .env"
    );
  }

  const headers = req.headers;
  const payload = req.body;

  const svix_id = headers["svix-id"] as string;
  const svix_timestamp = headers["svix-timestamp"] as string;
  const svix_signature = headers["svix-signature"] as string;

  const wh = new Webhook(WEBHOOK_SECRET);

  let evt: any;

  try {
    evt = wh.verify(JSON.stringify(payload), {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    });
  } catch (err) {
    return res.status(400).json({ message: "Webhook verification failed" });
  }

  const eventType = evt.type;
  if (eventType === "user.created") {
    const { id, email_addresses, username } = evt.data;

    // Create the user in your MongoDB
   await UserModel.findOneAndUpdate(
    { clerkId: id }, // Find by Clerk ID
    {
      clerkId: id,
      email: email_addresses[0].email_address,
      username: username || email_addresses[0].email_address.split("@")[0],
    },
    { upsert: true, new: true } // Create if doesn't exist, update if it does
  );

  console.log(`User ${id} synced to DB`);
  }

  return res.status(200).json({ success: true });
};
