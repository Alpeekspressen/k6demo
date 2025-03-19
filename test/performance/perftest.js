import http from 'k6/http';
import { check, sleep } from 'k6';

export let options = {
  scenarios: {
    user1_scenario: {
      executor: 'ramping-vus',
      startVUs: 0,
      stages: [
        { duration: '5s', target: 5 }, // Ramp up
        { duration: '5s', target: 5 }, // Hold
        { duration: '5s', target: 0 }  // Ramp down
      ],
      exec: 'user1'
    },
    user2_scenario: {
      executor: 'ramping-vus',
      startVUs: 0,
      stages: [
        { duration: '5s', target: 5 }, // Ramp up
        { duration: '5s', target: 5 }, // Hold
        { duration: '5s', target: 0 }  // Ramp down
      ],
      exec: 'user2'
    }
  },
  thresholds: { // Setting thresholds to fail the test if response time is greater than expected
    'http_req_duration{scenario:user1_scenario}': ['p(99)<5'],
    'http_req_duration{scenario:user2_scenario}': ['p(99)<110'],
  },
};

export function user1() {
  let res = http.get('http://localhost:5110/', {
    tags: { scenario: 'user1_scenario' } // Adding a tag to identify scenario
  });

  check(res, {
    'is status 200': (r) => r.status === 200,
    'response time < 2ms': (r) => r.timings.duration < 5,
  });

  sleep(1);
}

export function user2() {
  let res = http.get('http://localhost:5110/?sleep=100', {
    tags: { scenario: 'user2_scenario' } // Adding a tag to identify scenario
  });

  check(res, {
    'is status 200': (r) => r.status === 200,
    'response time < 110ms': (r) => r.timings.duration < 110,
  });

  sleep(1);
}
