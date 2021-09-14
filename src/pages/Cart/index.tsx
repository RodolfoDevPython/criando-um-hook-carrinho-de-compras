import React from 'react';
import {
  MdDelete,
  MdAddCircleOutline,
  MdRemoveCircleOutline,
} from 'react-icons/md';

import { useCart } from '../../hooks/useCart';
import { formatPrice } from '../../util/format';

import { Container, ProductTable, Total } from './styles';

interface Product {
  id: number;
  title: string;
  price: number;
  image: string;
  amount: number;
}

const Cart = (): JSX.Element => {

  const { cart, removeProduct, updateProductAmount } = useCart();

  const cartFormatted = cart.map(product => ({
    // TODO
  }))

  const total =
    formatPrice(
      cart.reduce((sumTotal, product) => {
        return sumTotal += product.price;
      }, 0)
    )

  function handleProductIncrement(productId: number, amount: number) {
    // TODO
    updateProductAmount({ productId, amount })
  }

  function handleProductDecrement(productId: number, amount: number) {
    // TODO
    updateProductAmount({ productId, amount })
  }

  function handleRemoveProduct(productId: number) {
    // TODO
    removeProduct(productId);
  }

  return (
    <Container>
      <ProductTable>
        <thead>
          <tr>
            <th aria-label="product image" />
            <th>PRODUTO</th>
            <th>QTD</th>
            <th>SUBTOTAL</th>
            <th aria-label="delete icon" />
          </tr>
        </thead>

        <tbody>

          {
            cart?.map( ({ id, image, title, price, amount }) => (

              <tr data-testid="product" key={id} >
                <td>
                  <img src={image} />
                </td>
                <td>
                  <strong>{title}</strong>
                  <span>{formatPrice(price)}</span>
                </td>
                <td>
                  <div>
                    <button
                      type="button"
                      data-testid="decrement-product"
                      disabled={amount <= 1}
                      onClick={() => handleProductDecrement(id, amount - 1)}
                    >
                      <MdRemoveCircleOutline size={20} />
                    </button>
                    <input
                      type="text"
                      data-testid="product-amount"
                      readOnly
                      value={amount}
                    />
                    <button
                      type="button"
                      data-testid="increment-product"
                      onClick={() => handleProductIncrement(id, amount + 1)}
                    >
                      <MdAddCircleOutline size={20} />
                    </button>
                  </div>
                </td>
                <td>
                  <strong>{formatPrice(price)}</strong>
                </td>
                <td>
                  <button
                    type="button"
                    data-testid="remove-product"
                    onClick={() => handleRemoveProduct(id)}
                  >
                    <MdDelete size={20} />
                  </button>
                </td>
              </tr>

            ))
          }
 
        </tbody>

      </ProductTable>

      <footer>
        <button type="button">Finalizar pedido</button>

        <Total>
          <span>TOTAL</span>
          <strong>{total}</strong>
        </Total>
      </footer>
    </Container>
  );
};

export default Cart;