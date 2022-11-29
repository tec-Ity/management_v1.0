import React from "react";
import OrderList from "../../order/list/OrderList";

export default function ClientOrder({ _id }) {
  console.log(_id);

  return (
    <OrderList
      type={-1}
      section={-1}
      userPage
      initQuery={{ Clients: [_id] }}
      showSearchParam={false}
    />
  );
}
