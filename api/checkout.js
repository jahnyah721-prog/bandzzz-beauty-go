
import Stripe from 'stripe'
export default async function handler(req, res){
  if(req.method !== 'POST') return res.status(405).json({error:'Method not allowed'})
  if(!process.env.STRIPE_SECRET_KEY){ return res.status(500).json({ error: 'Missing STRIPE_SECRET_KEY' }) }
  try{
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
    const { items, success_url, cancel_url } = req.body || {}
    if(!Array.isArray(items) || !items.length){ return res.status(400).json({ error: 'No items provided' }) }
    const line_items = items.map(i => ({ price_data: { currency:'usd', product_data:{ name:i.name||'Item' }, unit_amount: Math.round((i.price||0)*100) }, quantity: i.qty||1 }))
    const session = await stripe.checkout.sessions.create({ mode:'payment', line_items, success_url: success_url || req.headers.origin + '/?success=1', cancel_url: cancel_url || req.headers.origin + '/?canceled=1' })
    return res.status(200).json({ url: session.url })
  }catch(err){ return res.status(500).json({ error: err.message }) }
}
