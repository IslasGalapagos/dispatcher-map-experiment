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
      return {
        ...state,
        points: filterById(state.points, action.data.id, true)
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
        orders: filterById(state.orders, action.data.options.id, true)
      };

    case "list->reorder":
      let orders = state.orders;
      if (action.targetId === action.draggedId) {
        return { ...state };
      }

      let dragged = filterById(state.points, action.draggedId);
      if (dragged.length === 0) {
        dragged = filterById(state.orders, action.draggedId);
      }

      orders = filterById(state.orders, action.draggedId, true);

      if (!action.targetId) {
        orders = orders.concat(dragged);
      } else {
        const targetIndex = orders.reduce(
          (result, order, index) =>
            order.options.id === action.targetId ? index : result,
          -1
        );
        orders.splice(targetIndex, 0, dragged[0]);
      }

      return {
        ...state,
        points: filterById(state.points, action.draggedId, true),
        orders
      };

    default:
      return state;
  }
};

function filterById(list, id, ne = false) {
  return list.filter(item => {
    const result = item.options.id === id;
    if (ne) {
      return !result;
    }
    return result;
  });
}
