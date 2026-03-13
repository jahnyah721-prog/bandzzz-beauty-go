
export default async function handler(req, res){
  if(req.method !== 'POST') return res.status(405).json({error:'Method not allowed'})
  const { email } = req.body || {}
  if(!email) return res.status(400).json({error:'Email required'})
  if(!process.env.BUTTONDOWN_API_KEY){ return res.status(200).json({ ok:false, error:'Missing BUTTONDOWN_API_KEY' }) }
  try{
    const r = await fetch('https://api.buttondown.email/v1/subscribers',{ method:'POST', headers:{ 'Content-Type':'application/json', 'Authorization': 'Token ' + process.env.BUTTONDOWN_API_KEY }, body: JSON.stringify({ email }) })
    const data = await r.json()
    if(r.ok) return res.status(200).json({ ok:true })
    return res.status(400).json({ ok:false, error: data?.detail || 'Subscribe failed' })
  }catch(err){ return res.status(500).json({ ok:false, error: err.message }) }
}
