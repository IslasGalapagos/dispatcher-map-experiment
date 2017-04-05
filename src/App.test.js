import React from "react";
import { App, mapState, mapActions, prevent } from "./App";
import { shallow } from "enzyme";
import toJson from "enzyme-to-json";

describe("App", () => {
  it("render points", () => {
    const getData = jest.fn();
    getData.mockReturnValueOnce("{}").mockReturnValueOnce('{"id":1}');
    const moveToList = jest.fn();

    const holder = shallow(
      <App points={[{ lat: 1, lng: 2 }]} orders={[]} moveToList={moveToList} />
    );
    const $holder = holder.find(".list-holder");

    expect(toJson(holder)).toMatchSnapshot();

    $holder.simulate("drop", { dataTransfer: { getData } });
    expect(getData).toBeCalled();
    expect(moveToList.mock.calls).toHaveLength(0);

    $holder.simulate("drop", { dataTransfer: { getData } });
    expect(moveToList).toBeCalledWith({ id: 1 });
  });

  it("render holder over the map", () => {
    const pointerOut = jest.fn();
    const setData = jest.fn();
    const pointerDragEnd = jest.fn();

    const holder = shallow(
      <App
        orders={[]}
        holder={{ top: 1, left: 2, width: 3, height: 4, data: { prop: 101 } }}
        pointerOut={pointerOut}
        pointerDragEnd={pointerDragEnd}
      />
    );
    const $holder = holder.find(".draggable-holder");

    expect(toJson(holder)).toMatchSnapshot();

    $holder.simulate("dragstart", { dataTransfer: { setData } });
    expect(setData).toBeCalledWith("text/plain", '{"prop":101}');

    $holder.simulate("dragend");
    expect(pointerOut).toBeCalled();
  });

  it("render drop area over the map", () => {
    const moveOutList = jest.fn();
    const stopMoveOutList = jest.fn();
    const getData = jest.fn();
    getData.mockReturnValue('{"prop": 100}');

    const holder = shallow(
      <App
        orders={[]}
        dropArea={true}
        moveOutList={moveOutList}
        stopMoveOutList={stopMoveOutList}
      />
    );
    const $area = holder.find(".drop-area");

    expect(toJson(holder)).toMatchSnapshot();

    $area.simulate("drop", { dataTransfer: { getData } });

    expect(getData).toBeCalledWith("text");
    expect(moveOutList).toBeCalledWith({ prop: 100 });
    expect(stopMoveOutList).toBeCalled();
  });

  it("render orders", () => {
    const order = { options: { id: 1, type: 2, address: 3 } };
    const startMoveOutList = jest.fn();
    const stopMoveOutList = jest.fn();
    const setData = jest.fn();

    const holder = shallow(
      <App
        orders={[order]}
        startMoveOutList={startMoveOutList}
        stopMoveOutList={stopMoveOutList}
      />
    );

    expect(toJson(holder)).toMatchSnapshot();
    const orderElement = holder.find(".list-holder > div");

    orderElement.simulate("dragstart", { dataTransfer: { setData } });
    expect(setData).toBeCalledWith("text/plain", JSON.stringify(order));
    expect(startMoveOutList).toBeCalledWith(order);

    orderElement.simulate("dragend");
    expect(stopMoveOutList).toBeCalled();
  });
});

test("prevent", () => {
  const preventDefault = jest.fn();
  prevent({ preventDefault });
  expect(preventDefault).toBeCalled();
});

test("mapState", () => {
  expect(mapState({ holder: 1, dropArea: 2, orders: 3 })).toMatchSnapshot();
  expect(mapState({ points: 1 })).toMatchSnapshot();
});

describe("mapActions", () => {
  let dispatch;
  beforeEach(() => dispatch = jest.fn());

  it("pointerOver", () => {
    const { pointerOver } = mapActions(dispatch);

    pointerOver({
      _icon: { getBoundingClientRect: () => "RECT" },
      options: { id: 1, size: 4, type: 2, address: 3 }
    });

    expect(dispatch.mock.calls[0]).toMatchSnapshot();
  });

  it("pointerOut", () => {
    const { pointerOut } = mapActions(dispatch);

    pointerOut();

    expect(dispatch.mock.calls[0]).toMatchSnapshot();
  });

  it("moveToList", () => {
    const { moveToList } = mapActions(dispatch);

    moveToList("data");

    expect(dispatch.mock.calls[0]).toMatchSnapshot();
  });

  it("startMoveOutList", () => {
    const { startMoveOutList } = mapActions(dispatch);

    startMoveOutList("order");

    expect(dispatch.mock.calls[0]).toMatchSnapshot();
  });

  it("stopMoveOutList", () => {
    const { stopMoveOutList } = mapActions(dispatch);

    stopMoveOutList();

    expect(dispatch.mock.calls[0]).toMatchSnapshot();
  });

  it("moveOutList", () => {
    const { moveOutList } = mapActions(dispatch);

    moveOutList("data");

    expect(dispatch.mock.calls[0]).toMatchSnapshot();
  });
});
