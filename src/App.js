import React, { Component } from "react";
import { connect } from "react-redux";
import { Map, TileLayer } from "react-leaflet";
import MarkerClusterGroup from "./third-party/MarkerClusterGroup";
import { bounds } from "./gen-points";
import "./App.css";

export const mapState = state => ({
  holder: state.holder,
  dropArea: state.dropArea,
  points: state.points || [],
  orders: state.orders
});

export const mapActions = dispatch => ({
  pointerOver: ({ _icon, options: { id, type, address } }) =>
    dispatch({
      type: "holder->show",
      rect: _icon.getBoundingClientRect(),
      data: { id, type, address }
    }),
  pointerOut: () =>
    dispatch({
      type: "holder->hide"
    }),

  moveToList: data => dispatch({ type: "list->move", data }),

  startMoveOutList: order => dispatch({ type: "list->moveStart", order }),
  stopMoveOutList: order => dispatch({ type: "list->moveStop" }),
  moveOutList: data => dispatch({ type: "list->moveOut", data })
});

export const prevent = event => event.preventDefault();

export class App extends Component {
  render() {
    const {
      moveToList,
      startMoveOutList,
      stopMoveOutList,
      moveOutList,
      pointerOver,
      pointerOut,
      pointerDragEnd,
      points,
      orders,
      holder,
      dropArea
    } = this.props;
    return (
      <div>
        <div className="map-holder">
          <Map bounds={bounds} maxZoom={18}>
            <TileLayer url="http://{s}.tile.osm.org/{z}/{x}/{y}.png" />
            <MarkerClusterGroup
              onMarkerMouseOver={pointerOver}
              markers={points}
            />
          </Map>
        </div>
        {holder &&
          <div
            className="draggable-holder"
            draggable="true"
            onDragStart={event =>
              event.dataTransfer.setData(
                "text/plain",
                JSON.stringify(holder.data)
              )}
            onDragEnd={pointerOut}
            onMouseOut={pointerOut}
            style={{
              top: holder.top,
              left: holder.left,
              width: holder.width,
              height: holder.height
            }}
          />}
        <div
          className="list-holder"
          onDragEnter={prevent}
          onDragOver={prevent}
          onDrop={event => {
            const data = JSON.parse(event.dataTransfer.getData("text"));
            if (!data.id) {
              return;
            }
            moveToList(data);
          }}
        >
          {orders.map(order => (
            <div
              key={order.options.id}
              draggable="true"
              onDragStart={event => {
                event.dataTransfer.setData("text/plain", JSON.stringify(order));
                startMoveOutList(order);
              }}
              onDragEnd={stopMoveOutList}
            >
              {order.options.type}<br />{order.options.address}<hr />
            </div>
          ))}
        </div>
        {dropArea &&
          <div
            className="drop-area"
            onDragEnter={prevent}
            onDragOver={prevent}
            onDrop={event => {
              const data = JSON.parse(event.dataTransfer.getData("text"));
              moveOutList(data);
              stopMoveOutList();
            }}
          />}
      </div>
    );
  }
}

export default connect(mapState, mapActions)(App);
