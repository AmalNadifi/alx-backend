import kue from 'kue';
import createPushNotificationsJobs from './8-job.js';

const queue = kue.createQueue();
kue.testMode.queue = queue;

describe('createPushNotificationsJobs', () => {
  beforeEach(() => {
    queue.testMode.clear();
  });

  it('display an error message if jobs is not an array', () => {
    expect(() => createPushNotificationsJobs({}, queue)).toThrowError(
      'Jobs is not an array'
    );
  });

  it('create two new jobs to the queue', () => {
    const jobs = [
      { phoneNumber: '4153518780', message: 'Message 1' },
      { phoneNumber: '4153518781', message: 'Message 2' },
    ];
    createPushNotificationsJobs(jobs, queue);

    expect(queue.testMode.jobs.length).toBe(2);
  });
});
