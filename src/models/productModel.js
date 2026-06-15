const products = [
  {
    id: 1,
    name: 'Eurostar Standard Ticket',
    description: 'One-way standard class ticket on Eurostar',
    price: 89.0,
  },
  {
    id: 2,
    name: 'Eurostar Plus Ticket',
    description: 'One-way plus class ticket with extra legroom',
    price: 149.0,
  },
  {
    id: 3,
    name: 'Travel Insurance',
    description: 'Comprehensive travel insurance for your journey',
    price: 25.0,
  },
];

function findAll() {
  return products;
}

function findById(id) {
  return products.find((product) => product.id === id);
}

function findByIds(ids) {
  return ids.map((id) => findById(id)).filter(Boolean);
}

module.exports = {
  findAll,
  findById,
  findByIds,
};
