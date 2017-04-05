import L from "leaflet";

export const bounds = [
  [51.51280224425956, -0.11681556701660155],
  [51.50211782162702, -0.14428138732910156]
];

const orderType = ["DROPOFF-CAN", "FINAL", "SPOT"];

const location = ["Test", "Code", "React", "Redux", "Leaflet"];

const canSize = [10, 12, 20, 30, 40];

const random = (min, max) => Math.random() * (max - min) + min;
const randomItem = arr => arr[Math.floor(Math.random() * arr.length)];

export const createIcon = ({ type, size }) =>
  new L.DivIcon({
    className: `work-order-icon work-order-icon--${type}`,
    html: `
            <div class="work-order-icon--pin">
              <span class="work-order-icon--inner">${size}</span>
            </div>
            <div class="work-order-icon--pulse"></div>
          `
  });

export const generatePoints = () => {
  return [...Array(10).keys()].map(() => {
    const size = randomItem(canSize);
    const type = randomItem(orderType);
    return {
      lat: random(bounds[1][0], bounds[0][0]),
      lng: random(bounds[1][1], bounds[0][1]),
      options: {
        id: Math.floor(random(1, 1000000)),
        type,
        name: `${Math.floor(random(1, 1000))} ${type}`,
        address: `${Math.floor(random(1, 100))} ${randomItem(location)} street`,
        size,
        icon: createIcon({ type, size })
      }
    };
  });
};
