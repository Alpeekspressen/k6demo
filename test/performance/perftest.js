import http from 'k6/http';
import { check, sleep } from 'k6';

export let options = {
  scenarios: {
    stress_test: {
      executor: 'ramping-vus',
      startVUs: 0,
      stages: [
        { duration: '10s', target: 500 }, // Ramp up to 100 users
        { duration: '30s', target: 500 }, // Hold at 100 users
        { duration: '10s', target: 0 }    // Ramp down
      ]
    }
  },
  thresholds: {
    'http_req_duration': ['p(95)<2'], // 95% of requests must be < 200ms
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
