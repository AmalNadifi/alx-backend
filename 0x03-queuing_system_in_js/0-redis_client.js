#!/usr/bin/yarn dev
// Importing necessary libraries
import { createClient } from 'redis';

// Connecting to Redis server
const client = createClient();

// Handling connection events
client.on('connect', () => {
  console.log('Redis client connected to the server');
});

client.on('error', (err) => {
  console.error('Redis client not connected to the server:', err.message);
});
