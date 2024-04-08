#!/usr/bin/env yarn dev
import kue from 'kue';

// Create an array of blacklisted phone numbers
const blacklistedNumbers = ['4153518780', '4153518781'];

// Create a function to send notifications
const sendNotification = (phoneNumber, message, job, done) => {
  // Track the progress of the job
  job.progress(0, 100);

  // Check if the phone number is blacklisted
  if (blacklistedNumbers.includes(phoneNumber)) {
    // Fail the job with an Error object
    done(new Error(`Phone number ${phoneNumber} is blacklisted`));
  } else {
    // Update the progress to 50%
    job.progress(50, 100);

    // Log the notification
    console.log(`Sending notification to ${phoneNumber}, with message: ${message}`);

    // Complete the job
    done();
  }
};

// Create a queue to process jobs
const queue = kue.createQueue();

// Set concurrency to process two jobs at a time
queue.process('push_notification_code_2', 2, (job, done) => {
  // Extract job data
  const { phoneNumber, message } = job.data;

  // Call the sendNotification function
  sendNotification(phoneNumber, message, job, done);
});

console.log('Job processor is running...');
