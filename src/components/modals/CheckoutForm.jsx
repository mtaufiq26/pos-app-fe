import { useEffect, useState } from "react";
import { Modal, Button } from "react-daisyui";

export default function CheckoutForm (props) {
  const { items, open } = props;
  const [cart, setCart] = useState([]);

  const deleteFromCart = (item_id) => {
    const index = cart.findIndex(value => value.product_id == item_id)

    setCart([
      ...cart.slice(0, index),
      ...cart.slice(index + 1, cart.length)
    ]);
  }

  useEffect(() => {
    setCart(items);
  }, []);

  return (
    <Modal open={open}>
      <Modal.Header>
        Checkout
      </Modal.Header>
      <Modal.Body>

      </Modal.Body>
      <Modal.Actions>
        <Button color="success">
          Confirm
        </Button>
      </Modal.Actions>
    </Modal>
  );

}