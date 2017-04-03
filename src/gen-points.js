export const bounds = [
  [51.51280224425956, -0.11681556701660155],
  [51.50211782162702, -0.14428138732910156]
];

const orderType = [
  "Order Type",
  "Order Type",
  "Order Type",
  "Order Type",
  "Order Type"
];

const location = [
  "Test street",
  "Code street",
  "React street",
  "Redux street",
  "Leaflet street"
];

const random = (min, max) => Math.random() * (max - min) + min;
const randomItem = arr => arr[Math.floor(Math.random() * arr.length)];

export const generatePoints = () => {
  return [...Array(1000).keys()].map(() => ({
    lat: random(bounds[1][0], bounds[0][0]),
    lng: random(bounds[1][1], bounds[0][1]),
    options: {
      id: Math.floor(random(1, 1000000)),
      type: `${randomItem(orderType)} ${Math.floor(random(1, 1000))}`,
      address: `${Math.floor(random(1, 1000))} ${randomItem(location)}`
    }
  }));
};
