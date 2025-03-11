import http from 'k6/http';
import { check, sleep } from 'k6';

export let options = {
  scenarios: {
    stress_test: {
      executor: 'ramping-vus',
      startVUs: 0,
      stages: [
        { duration: '10s', target: 15 }, // Ramp up
        { duration: '10s', target: 15 }, // Hold
        { duration: '10s', target: 0 }    // Ramp down
      ]
    }
  },
  thresholds: {
    'http_req_duration': ['p(99)<2'], // 99% of requests must be < 200ms
  },
};

export default function () {
  let res = http.get('http://localhost:5110/');

  check(res, {
    'is status 200': (r) => r.status === 200,
    'response time < 2ms': (r) => r.timings.duration < 2,
  });

  sleep(1);
}
