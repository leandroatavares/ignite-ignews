import { NextApiRequest, NextApiResponse } from "next";
import { Readable } from 'stream';
import Stripe from "stripe";
import { stripe } from "../../services/stripe";
import { saveSubscription } from "./_lib/manage-subscription";

async function buffer(readable: Readable) {
  const chunks = [];

  for await (const chunk of readable) {
    chunks.push(
      typeof chunk === 'string' ? Buffer.from(chunk) : chunk
    );
  }

  return Buffer.concat(chunks);
}

export const config = {
  api: {
    bodyParser: false
  }
}

//eventos relevantes do webhook
const relevantEvents = new Set([
  'checkout.session.completed',
  'customer.subscription.updated',
  'customer.subscription.deleted',
])

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if(req.method === 'POST') {
    const buff = await buffer(req) //buff representa a requisiçao
    const secret = req.headers['stripe-signature']
    
    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(buff, secret, process.env.STRIPE_WEBHOOK_SECRET); //metodo para verificar se a requisiçao veio do stripe
    } catch(err) {
      return res.status(400).send(`Webhook error: ${err.message}`)
    }

    const { type } = event; // == const type = event.type;
    if(relevantEvents.has(type)) {
      try {
        console.log(type);
        switch(type) {
          case 'checkout.session.completed':
            const checkSession = event.data.object as Stripe.Checkout.Session;
            await saveSubscription(
              checkSession.subscription.toString(),
              checkSession.customer.toString(),
              true
            )
            break;
          case 'customer.subscription.updated':
          case 'customer.subscription.deleted':
            const subscription = event.data.object as Stripe.Subscription;

            await saveSubscription(
              subscription.id.toString(),
              subscription.customer.toString(),
              false //type === 'customer.subscription.created'
            );

          default:
            throw new Error('Unhundled event.')
        }
      } catch(err) {
        //TODO -> estudar sentry, bugsnag
        return res.json({ error: 'Webhook handler failed.' })
      }
    }
    
    res.json({received: true})
  } else {
    res.setHeader('Allow', 'POST')
    res.status(405).end('Method not allowed')
  }
}