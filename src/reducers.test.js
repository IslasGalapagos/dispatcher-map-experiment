import reducer from "./reducers";

test("init", () => {
  expect(reducer({}, {})).toMatchSnapshot();
});

test("holder->show", () => {
  expect(
    reducer(
      {},
      {
        type: "holder->show",
        data: { a: 1 },
        rect: { top: 1, left: 2, width: 3, height: 4 }
      }
    )
  ).toMatchSnapshot();
});

test("holder->hide", () => {
  expect(reducer({ holder: 1 }, { type: "holder->hide" })).toMatchSnapshot();
});

test("list->move", () => {
  expect(
    reducer(
      {
        points: [{ options: { id: 1 } }, { options: { id: 2 } }],
        orders: []
      },
      { type: "list->move", data: { id: 1 } }
    )
  ).toMatchSnapshot();
});

test("list->moveStart", () => {
  expect(reducer({}, { type: "list->moveStart" })).toMatchSnapshot();
});

test("list->moveStop", () => {
  expect(
    reducer({ dropArea: true }, { type: "list->moveStop" })
  ).toMatchSnapshot();
});

test("list->moveOut", () => {
  expect(
    reducer(
      { points: [], orders: [{ options: { id: 1 } }, { options: { id: 2 } }] },
      { type: "list->moveOut", data: { options: { id: 1 } } }
    )
  ).toMatchSnapshot();
});

describe("list->reorder", () => {
  const point = id => ({ options: { id } });

  test("1", () => {
    const action = {
      type: "list->reorder",
      targetId: undefined,
      draggedId: 0
    };
    const state = {
      points: [point(0)],
      orders: [point(1), point(2), point(3), point(4), point(5)]
    };

    expect(reducer(state, action)).toEqual({
      points: [],
      orders: [point(1), point(2), point(3), point(4), point(5), point(0)]
    });
  });

  test("2", () => {
    const action = {
      type: "list->reorder",
      targetId: 2,
      draggedId: 0
    };
    const state = {
      points: [point(0)],
      orders: [point(1), point(2), point(3), point(4), point(5)]
    };

    expect(reducer(state, action)).toEqual({
      points: [],
      orders: [point(1), point(0), point(2), point(3), point(4), point(5)]
    });
  });

  test("3", () => {
    const action = {
      type: "list->reorder",
      targetId: 4,
      draggedId: 10
    };
    const state = {
      points: [point(0), point(10)],
      orders: [point(1), point(2), point(3), point(10), point(4), point(5)]
    };

    expect(reducer(state, action)).toEqual({
      points: [point(0)],
      orders: [point(1), point(2), point(3), point(10), point(4), point(5)]
    });
  });

  test("3.1", () => {
    const action = {
      type: "list->reorder",
      targetId: 1,
      draggedId: 10
    };
    const state = {
      points: [point(0), point(10)],
      orders: [point(1), point(2), point(3), point(10), point(4), point(5)]
    };

    expect(reducer(state, action)).toEqual({
      points: [point(0)],
      orders: [point(10), point(1), point(2), point(3), point(4), point(5)]
    });
  });

  test("4", () => {
    const action = {
      type: "list->reorder",
      targetId: 1,
      draggedId: 10
    };
    const state = {
      points: [point(0)],
      orders: [point(1), point(2), point(3), point(10), point(4), point(5)]
    };

    expect(reducer(state, action)).toEqual({
      points: [point(0)],
      orders: [point(10), point(1), point(2), point(3), point(4), point(5)]
    });
  });

  test("5", () => {
    const action = {
      type: "list->reorder",
      targetId: 0,
      draggedId: 0
    };
    const state = {
      points: [],
      orders: [point(0), point(1)]
    };

    expect(reducer(state, action)).toEqual({
      points: [],
      orders: [point(0), point(1)]
    });
  });

  test("6", () => {
    const action = {
      type: "list->reorder",
      targetId: NaN,
      draggedId: 0
    };
    const state = {
      points: [point(0)],
      orders: []
    };

    expect(reducer(state, action)).toEqual({
      points: [],
      orders: [point(0)]
    });
    expect(
      reducer(
        {
          points: [],
          orders: [point(0)]
        },
        action
      )
    ).toEqual({
      points: [],
      orders: [point(0)]
    });
  });
});
