import { signIn, useSession } from 'next-auth/react'
import { api } from '../../services/api';
import { getStripeJs } from '../../services/stripe-js';
import styles from './styles.module.scss'

interface SubscribeButtonProps {
  priceId: string
}

export function SubscribeButton({ priceId }: SubscribeButtonProps) {

  const { data: session } = useSession();

  async function handleSubscriber() {
    if(!session) {
      signIn('github')
      return;
    }
    //criaçao checkout session Stripe
    try {
      const response = await api.post('/subscribe/checkout-session')
      const { sessionId } = response.data;

      const stripe = await getStripeJs()
      stripe.redirectToCheckout({sessionId})

    } catch(err) {
      alert(err.message) // TODO -> incluir toast
    }
  }

  return (
    <button
      type="button"
      className={styles.subscribeButton}
      onClick={handleSubscriber}
    >
      Subscribe now
    </button>
  )
}