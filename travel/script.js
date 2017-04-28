// Использование

travelRoute.addTemplate('train', 'Take {{tname}} {{number}} from {{from}} to {{to}}. Train carriage {{carriage}}. Seat {{seat}}.');
travelRoute.addTemplate('bus', 'Take the {{tname}} {{number}} from {{from}} to {{to}}. {% Seat {{seat}} | No seat assigment %}.');
travelRoute.addTemplate('airplane', 'From {{from}}, take {{tname}} {{number}} to {{to}}. Gate {{gate}}. Seat {{seat}}. {{baggage}}.');

const unsortedCards = [
  {
    from: 'Gerona Airport',
    to: 'Stockholm',
    transport: {
      type: 'airplane',
      tname: 'flight',
      number: 'SK455',
      gate: '45B',
      seat: '3A',
      baggage: 'Baggage drop at ticket counter 344'
    }
  },
  {
    from: 'Madrid',
    to: 'Barcelona',
    transport: {
      type: 'train',
      tname: 'train',
      number: '78A',
      carriage: '12',
      seat: '45B',
    }
  },
  {
    from: 'New York JFK',
    to: 'Moscow',
    transport: {
      type: 'bus',
      tname: 'hyper bus',
      number: '666',
      seat: '13'
    }
  },
  {
    from: 'Barcelona',
    to: 'Gerona Airport',
    transport: {
      type: 'bus',
      tname: 'airport bus',
    }
  },
  {
    from: 'Stockholm',
    to: 'New York JFK',
    transport: {
      type: 'airplane',
      tname: 'flight',
      number: 'SK22',
      gate: '22',
      seat: '7B',
      baggage: ' Baggage will be automatically transferred from your last leg'
    }
  }
];

const cards = travelRoute.createRoute(unsortedCards);
const stringCards = travelRoute.formatCards(cards);


const viewCards = document.querySelector('[data-tr="cards"]');
const viewSorted = document.querySelector('[data-tr="sorted"]');
const viewString = document.querySelector('[data-tr="string"]');

unsortedCards.forEach(card => {
  const span = document.createElement('span');
  span.innerHTML = `${card.from } <> ${card.to} <br>`;
  viewCards.appendChild(span);
});

cards.forEach(card => {
  const span = document.createElement('span');
  span.innerHTML = `${card.from} <> ${card.to} <br>`;
  viewSorted.appendChild(span);
});

stringCards.forEach(card => {
  const span = document.createElement('span');
  span.innerHTML = card + '<br>';
  viewString.appendChild(span);
});
