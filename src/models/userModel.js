const bcrypt = require('bcryptjs');

const users = [
  {
    id: 1,
    email: 'alice@example.com',
    password: bcrypt.hashSync('password123', 10),
    name: 'Alice Johnson',
  },
  {
    id: 2,
    email: 'bob@example.com',
    password: bcrypt.hashSync('password123', 10),
    name: 'Bob Smith',
  },
  {
    id: 3,
    email: 'carol@example.com',
    password: bcrypt.hashSync('password123', 10),
    name: 'Carol Williams',
  },
];

let nextUserId = 4;

function findAll() {
  return users.map(({ password, ...user }) => user);
}

function findByEmail(email) {
  return users.find((user) => user.email === email);
}

function findById(id) {
  const user = users.find((user) => user.id === id);
  if (!user) {
    return null;
  }
  const { password, ...safeUser } = user;
  return safeUser;
}

function create({ email, password, name }) {
  const user = {
    id: nextUserId++,
    email,
    password: bcrypt.hashSync(password, 10),
    name,
  };
  users.push(user);
  const { password: _, ...safeUser } = user;
  return safeUser;
}

module.exports = {
  findAll,
  findByEmail,
  findById,
  create,
};
