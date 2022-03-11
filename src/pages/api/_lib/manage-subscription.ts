import { fauna } from "../../../services/fauna";
import { query as q } from 'faunadb';
import { stripe } from "../../../services/stripe";

export async function saveSubscription(
  subscriptionId: string,
  customerId: string
) {  
  //Busca o user no faunadb pelo customerId (stripeCustomerId) index: user_by_stripe_customer_id
  const useRef = await fauna.query(
    q.Select(
      "ref",
      q.Get(
        q.Match(
          q.Index('user_by_stripe_customer_id'),
          customerId
        )
      )
    )
  )
  // Busca todos os dados da subscription
  const subscription = await stripe.subscriptions.retrieve(subscriptionId)
  const subscriptionData = {
    id: subscription.id,
    userId: useRef,
    status: subscription.status,
    priceId: subscription.items.data[0].price.id
  }

  // Salva dados da subscription no faunadb
  await fauna.query(
    q.Create(
      q.Collection('subscriptions'),
      { data: { subscriptionData } }
    )
  )

}