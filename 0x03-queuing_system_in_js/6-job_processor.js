#!/usr/bin/env yarn dev
import kue from 'kue';

// Create a queue
const queue = kue.createQueue();

// Define the sendNotification function
const sendNotification = (phoneNumber, message) => {
  console.log(`Sending notification to ${phoneNumber}, with message: ${message}`);
};

// Process jobs from the push_notification_code queue
queue.process('push_notification_code', (job, done) => {
  const { phoneNumber, message } = job.data;
  sendNotification(phoneNumber, message);
  done();
});

console.log('Job processor is running...');
