const express = require('express');
const stripe = require('stripe')('');
const { v4: uuidv4 } = require('uuid'); // To generate unique session IDs
const app = express();
const cors = require('cors');

app.use(express.json());
app.use(cors())

let sessionStore = {}; // Temporary in-memory store for session data

app.post('/create-checkout-session', async (req, res) => {
    const { amount } = req.body;
    const sessionId = uuidv4(); // Unique session ID for security

    const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [{
            price_data: {
                currency: 'usd',
                product_data: {
                    name: 'Custom amount',
                },
                unit_amount: amount * 100,
            },
            quantity: 1,
        }],
        mode: 'payment',
        metadata: { amount, sessionId }, // Store amount and session ID
        success_url: `http://localhost:3000/success?sessionId=${sessionId}`, // Pass sessionId in URL
        cancel_url: 'http://localhost:3000/cancel',
    });

    sessionStore[sessionId] = { amount, used: false }; // Save session info
    res.json({ id: session.id });
});

app.get('/verify-session/:sessionId', (req, res) => {
  const { sessionId } = req.params;
  const session = sessionStore[sessionId];

  if (!session) {
      return res.status(403).json({ error: 'Invalid session' });
  }

  res.json({ amount: session.amount });
});

app.post('/mark-session-used/:sessionId', (req, res) => {
  const { sessionId } = req.params;
  const session = sessionStore[sessionId];

  if (!session || session.used) {
      return res.status(403).json({ error: 'Invalid or already used session' });
  }

  session.used = true;
  res.json({ message: 'Session marked as used' });
});

app.listen(4242, () => console.log('Running on port 4242'));


// const express = require('express');
// const stripe = require('stripe')('sk_test_51QDpl8Clmd0ulklqY0TmOULH6NbRxsTrENP6jJdmfdEnO8bmLeLo05fVkpoIzc6uiAkhfX1XzastEnqHHy7ByfC800ogmCTCej');
// const app = express();
// const cors = require('cors');

// app.use(express.json());
// app.use(cors({
//     origin: 'http://localhost:3000', // Allow requests from frontend
//   }));
  
// app.post('/create-checkout-session', async (req, res) => {
//   const { amount } = req.body;

//   const session = await stripe.checkout.sessions.create({
//     payment_method_types: ['card'],
//     line_items: [
//       {
//         price_data: {
//           currency: 'usd',
//           product_data: {
//             name: 'Custom amount',
//           },
//           unit_amount: amount * 100, // Stripe expects the amount in cents
//         },
//         quantity: 1,
//       },
//     ],
//     mode: 'payment',
//     success_url: 'http://localhost:3000/success', // Adjust for production
//     cancel_url: 'http://localhost:3000/cancel',
//   });

//   res.json({ id: session.id });
// });

// app.listen(4242, () => console.log('Running on port 4242'));
