import express from 'express';
import { promisify } from 'util';
import kue from 'kue';
import { createClient } from 'redis';

const app = express();
const port = 1245;
const client = createClient();
const reserveSeat = promisify(client.set).bind(client);
const getCurrentAvailableSeats = promisify(client.get).bind(client);

let reservationEnabled = true;
let availableSeats = 50;

const queue = kue.createQueue();

queue.process('reserve_seat', async (job, done) => {
  const { number } = job.data;

  if (!reservationEnabled) {
    return done(new Error('Reservation are blocked'));
  }

  try {
    await reserveSeat('available_seats', number);
    console.log(`Seat reservation job ${job.id} completed`);
    done(null, { status: 'Reservation in process' });
  } catch (error) {
    console.error(`Seat reservation job ${job.id} failed: ${error.message}`);
    done(new Error('Reservation failed'));
  }
});

app.get('/available_seats', async (req, res) => {
  const numberOfAvailableSeats = await getCurrentAvailableSeats('available_seats');
  res.json({ numberOfAvailableSeats });
});

app.get('/reserve_seat', async (req, res) => {
  if (!reservationEnabled) {
    return res.json({ status: 'Reservation are blocked' });
  }

  queue.create('reserve_seat', { number: 1 }).save();
  res.json({ status: 'Reservation in process' });
});

app.get('/process', async (req, res) => {
  queue.process('reserve_seat', async (job, done) => {
    const { number } = job.data;

    if (availableSeats === 0) {
      reservationEnabled = false;
      return done(new Error('Not enough seats available'));
    }

    availableSeats--;
    await reserveSeat('available_seats', availableSeats);
    done(null, { status: 'Queue processing' });
  });

  res.json({ status: 'Queue processing' });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
