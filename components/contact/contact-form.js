import { useEffect, useState } from 'react'
import classes from './contact-form.module.css'
import Notification from '../ui/notification'

async function sendConteactData(contactDetails) {
  // optional: add client-side validation
  const response = await fetch('/api/contact', {
    method: 'POST',
    body: JSON.stringify(contactDetails),
    headers: {
      'Content-Type': 'application/json'
    }
  })
  const data = await response.json()
  if (!response.ok) {
    throw new Error(data.message || 'Someting went wrong!')
  }
}

function ContactForm() {
  const [enteredEmail, setEnteredEmail] = useState('')
  const [enteredName, setEnteredName] = useState('')
  const [enteredMessage, setEnteredMessage] = useState('')
  const [requestStatus, setRequestStatus] = useState() // 'pending' 'success' 'error'
  const [requestError, setRequestError] = useState()

  useEffect(() => {
    if (requestStatus === 'pending' || requestStatus === 'error') {
      const timer = setTimeout(() => {
        setRequestStatus(null)
        setRequestError(null)
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [requestStatus])

  async function sendMessage(event) {
    event.preventDefault()
    setRequestStatus('pending')
    try {
      await sendConteactData({
        email: enteredEmail,
        name: enteredName,
        message: enteredMessage
      })
      setRequestStatus('success')
      setEnteredMessage('')
      setEnteredEmail('')
      setEnteredName('')
    } catch (error) {
      setRequestError(error.message)
      setRequestStatus('error')
    }
  }
  let notification
  if (requestStatus === 'pending') {
    notification = {
      status: 'pending',
      title: 'Sending message...',
      message: 'Your message is not its way!'
    }
  } else if (requestStatus === 'success') {
    notification = {
      status: 'success',
      title: 'Success!',
      message: 'Message sent successfully'
    }
  } else if (requestStatus === 'error') {
    notification = {
      status: 'error',
      title: 'Error!',
      message: requestError
    }
  }
  return (
    <section className={classes.contact}>
      <h1>How can I help you?</h1>
      <form className={classes.form} onSubmit={sendMessage}>
        <div className={classes.controls}>
          <div className={classes.control}>
            <label htmlFor="email">Your email</label>
            <input
              value={enteredEmail}
              onChange={e => setEnteredEmail(e.target.value)}
              type="email"
              id="email"
              required
            />
          </div>
          <div className={classes.control}>
            <label htmlFor="name">Your Name</label>
            <input value={enteredName} onChange={e => setEnteredName(e.target.value)} type="text" id="name" required />
          </div>
        </div>
        <div className={classes.control}>
          <label htmlFor="message">Your Message</label>
          <textarea
            required
            value={enteredMessage}
            onChange={e => setEnteredMessage(e.target.value)}
            id="message"
            rows="5"
          ></textarea>
        </div>
        <div className={classes.actions}>
          <button>Send Message</button>
        </div>
      </form>
      {notification && (
        <Notification status={notification.status} title={notification.title} message={notification.message} />
      )}
    </section>
  )
}

export default ContactForm
