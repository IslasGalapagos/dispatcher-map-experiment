import { generatePoints } from "./gen-points";

const initialState = {
  holder: null,
  dropArea: false,
  points: generatePoints(),
  orders: []
};

export default (state = initialState, action) => {
  switch (action.type) {
    case "holder->show":
      return {
        ...state,
        holder: {
          data: action.data,
          top: action.rect.top,
          left: action.rect.left,
          width: action.rect.width,
          height: action.rect.height
        }
      };

    case "holder->hide":
      return { ...state, holder: null };

    case "list->move":
      const order = state.points.filter(
        point => point.options.id === action.data.id
      )[0];
      return {
        ...state,
        points: state.points.filter(
          point => point.options.id !== action.data.id
        ),
        orders: state.orders.concat(order)
      };

    case "list->moveStart":
      return {
        ...state,
        dropArea: true
      };

    case "list->moveStop":
      return {
        ...state,
        dropArea: false
      };

    case "list->moveOut":
      return {
        ...state,
        points: state.points.concat(action.data),
        orders: state.orders.filter(
          order => order.options.id !== action.data.options.id
        )
      };

    default:
      return state;
  }
};
