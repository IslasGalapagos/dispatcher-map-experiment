import React, { Component } from "react";
import { connect } from "react-redux";
import { Map, TileLayer } from "react-leaflet";
import L from "leaflet";
import MarkerClusterGroup from "./third-party/MarkerClusterGroup";
import { bounds, createIcon } from "./gen-points";
import "./App.css";

export const mapState = state => ({
  holder: state.holder,
  dropArea: state.dropArea,
  points: state.points || [],
  orders: state.orders
});

export const mapActions = dispatch => ({
  pointerOver: (
    { _icon, options: { id, sorted, size, name, type, address } }
  ) =>
    sorted ||
    dispatch({
      type: "holder->show",
      rect: _icon.getBoundingClientRect(),
      data: { id, size, type, name, address }
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
  renderMap() {
    const {
      points,
      orders,
      pointerOver
    } = this.props;

    return (
      <div className="map-holder">
        <Map bounds={bounds} maxZoom={18}>
          <TileLayer url="http://{s}.tile.osm.org/{z}/{x}/{y}.png" />
          <MarkerClusterGroup
            onMarkerMouseOver={pointerOver}
            markers={(points || []).concat(
              orders.map((order, index) => ({
                ...order,
                options: {
                  ...orders.options,
                  sorted: true,
                  icon: new L.DivIcon({
                    className: "work-order-sorted-icon",
                    html: index + 1
                  })
                }
              }))
            )}
          />
        </Map>
      </div>
    );
  }

  renderHolder() {
    const {
      pointerOut,
      holder
    } = this.props;

    return holder &&
      <div
        className={`draggable-holder draggable-holder--${holder.data.type}`}
        draggable="true"
        onDragStart={event => {
          event.dataTransfer.setData("text/plain", JSON.stringify(holder.data));
        }}
        onDragEnd={pointerOut}
        style={{
          top: holder.top - 18,
          left: holder.left - 18
        }}
      >
        <div className="draggable-holder--hide" onClick={pointerOut} />
        <div className="draggable-holder--name">{holder.data.name}</div>
        <div className="draggable-holder--size">
          {holder.data.size} YARDS
        </div>
        <div className="draggable-holder--address">
          {holder.data.address}
        </div>
      </div>;
  }

  renderList() {
    const {
      moveToList,
      startMoveOutList,
      stopMoveOutList,
      orders
    } = this.props;

    return (
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
            className={
              `list-holder--item list-holder--item--${order.options.type}`
            }
            draggable="true"
            onDragStart={event => {
              event.dataTransfer.setData("text/plain", JSON.stringify(order));
              startMoveOutList(order);
            }}
            onDragEnd={stopMoveOutList}
          >
            <div className="list-holder--item--name">
              {order.options.name}
            </div>
            <div className="list-holder--item--size">
              {order.options.size} YARDS
            </div>
            <div className="list-holder--item--address">
              {order.options.address}
            </div>
          </div>
        ))}
      </div>
    );
  }

  renderDropArea() {
    const {
      stopMoveOutList,
      moveOutList,
      dropArea
    } = this.props;

    return dropArea &&
      <div
        className="drop-area"
        onDragEnter={prevent}
        onDragOver={prevent}
        onDrop={event => {
          const data = JSON.parse(event.dataTransfer.getData("text"));
          const { options = {} } = data;
          options.icon = createIcon(options);
          moveOutList(data);
          stopMoveOutList();
        }}
      />;
  }

  render() {
    return (
      <div>
        {this.renderMap()}
        {this.renderHolder()}
        {this.renderList()}
        {this.renderDropArea()}
      </div>
    );
  }
}

export default connect(mapState, mapActions)(App);
