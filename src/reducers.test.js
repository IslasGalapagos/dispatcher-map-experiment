import reducer from "./reducers";

test("init", () => {
  expect(reducer(undefined, {}).points.length).toBe(1000);
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
