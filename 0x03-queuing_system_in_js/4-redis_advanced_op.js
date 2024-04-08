#!/usr/bin/env yarn dev
import { createClient } from 'redis';

const client = createClient();

client.on('connect', () => {
  console.log('Redis client connected to the server');
});

client.on('error', (err) => {
  console.error('Redis client not connected to the server:', err.message);
});

client.hset(
  'HolbertonSchools',
  'Portland',
  '50',
  (err, reply) => {
    console.log('Reply:', reply);
  }
);

client.hset(
  'HolbertonSchools',
  'Seattle',
  '80',
  (err, reply) => {
    console.log('Reply:', reply);
  }
);

client.hset(
  'HolbertonSchools',
  'New York',
  '20',
  (err, reply) => {
    console.log('Reply:', reply);
  }
);

client.hset(
  'HolbertonSchools',
  'Bogota',
  '20',
  (err, reply) => {
    console.log('Reply:', reply);
  }
);

client.hset(
  'HolbertonSchools',
  'Cali',
  '40',
  (err, reply) => {
    console.log('Reply:', reply);
  }
);

client.hset(
  'HolbertonSchools',
  'Paris',
  '2',
  (err, reply) => {
    console.log('Reply:', reply);
  }
);

client.hgetall('HolbertonSchools', (err, obj) => {
  if (err) {
    console.error(err);
  } else {
    console.log(obj);
  }
});
