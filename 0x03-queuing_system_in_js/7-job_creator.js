#!/usr/bin/env yarn dev
import kue from 'kue';

// Create an array of jobs
const jobs = [
  {
    phoneNumber: '4153518780',
    message: 'This is the code 1234 to verify your account'
  },
  {
    phoneNumber: '4153518781',
    message: 'This is the code 4562 to verify your account'
  },
  {
    phoneNumber: '4153518743',
    message: 'This is the code 4321 to verify your account'
  },
  // Add more jobs as needed
];

// Create a queue
const queue = kue.createQueue();

// Process job completion
queue.on('job complete', (id) => {
  kue.Job.get(id, (err, job) => {
    if (err) return console.error('Error getting job:', err);
    console.log(`Notification job ${job.id} completed`);
  });
});

// Process job failure
queue.on('job failed', (id, err) => {
  console.error(`Notification job ${id} failed: ${err}`);
});

// Process job progress
queue.on('job progress', (id, progress) => {
  console.log(`Notification job ${id} ${progress}% complete`);
});

// Loop through the array of jobs and add them to the queue
jobs.forEach((jobData) => {
  const job = queue.create('push_notification_code_2', jobData);
  job.save((err) => {
    if (err) return console.error('Error creating job:', err);
    console.log(`Notification job created: ${job.id}`);
  });
});

console.log('Job creator is running...');
