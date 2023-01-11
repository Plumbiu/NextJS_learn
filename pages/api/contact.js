import { MongoClient } from 'mongodb'

async function handler(req, res) {
  if (req.method === 'POST') {
    const { email, name, message } = req.body
    if (!email || !email.includes('@') || !name || name.trim() === '' || !message || message.trim() === '') {
      res.status(422).json({
        message: 'Invalid input.'
      })
      return
    }
    // Store it in a database
    const newMessage = {
      email,
      name,
      message
    }
    let client
    try {
      client = await MongoClient.connect('mongodb://127.0.0.1:27017/my-site')
    } catch (error) {
      res.status(500).json({ message: 'Could not connect to database.' })
    }
    const db = client.db('my-site')
    try {
      const result = await db.collection('messages').insertOne(newMessage)
      newMessage.id = result.insertedId
    } catch (error) {
      client.close()
      res.status(500).json({ message: 'storing message failed!' })
      return
    }
    client.close()
    
    res.status(201).json({ message: 'Success stored message!', message: newMessage })
  }
}

export default handler
