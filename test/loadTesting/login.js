import http from 'k6/http';
import { check } from 'k6';
import { BASE_URL, LOGIN_USERS } from './data.js';

export const options = {
  stages: [
    { duration: '5s', target: 10 },
    { duration: '20s', target: 30 },
    { duration: '5s', target: 0 },
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'],
    checks: ['rate==1'],
  },
};

export default function loginLoadTest() {
  const user = LOGIN_USERS[Math.floor(Math.random() * LOGIN_USERS.length)];

  const response = http.post(
    `${BASE_URL}/login`,
    JSON.stringify({
      email: user.email,
      password: user.password,
    }),
    {
      headers: { 'Content-Type': 'application/json' },
      tags: { name: 'POST /login' },
    },
  );

  check(response, {
    'login status is 200': (res) => res.status === 200,
    'response contains token': (res) => typeof res.json('token') === 'string' && res.json('token').length > 0,
    'response contains user email': (res) => res.json('user.email') === user.email,
    'response contains user name': (res) => res.json('user.name') === user.name,
  });
}
