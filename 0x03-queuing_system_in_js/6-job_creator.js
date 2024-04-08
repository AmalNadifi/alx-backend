#!/usr/bin/env yarn dev
import kue from 'kue';

// Create a queue
const queue = kue.createQueue();

// Define the job data
const jobData = {
  phoneNumber: '1234567890',
  message: 'Hello from Job Creator',
};

// Create a job in the queue
const job = queue.create('push_notification_code', jobData);

// Event listener when the job is created
job.on('enqueue', () => {
  console.log(`Notification job created: ${job.id}`);
});

// Event listener when the job is completed
job.on('complete', () => {
  console.log('Notification job completed');
});

// Event listener when the job fails
job.on('failed', () => {
  console.log('Notification job failed');
});

// Save the job to the queue
job.save((err) => {
  if (err) {
    console.error('Error creating job:', err);
  } else {
    console.log('Job saved successfully');
  }
});
