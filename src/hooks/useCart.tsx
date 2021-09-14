import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { api } from '../services/api';
import { Product, Stock } from '../types';

interface CartProviderProps {
  children: ReactNode;
}

interface UpdateProductAmount {
  productId: number;
  amount: number;
}

interface CartContextData {
  cart: Product[];
  addProduct: (productId: number) => Promise<void>;
  removeProduct: (productId: number) => void;
  updateProductAmount: ({ productId, amount }: UpdateProductAmount) => void;
}

const CartContext = createContext<CartContextData>({} as CartContextData);

export function CartProvider({ children }: CartProviderProps): JSX.Element {
  const [cart, setCart] = useState<Product[]>(() => {
    const storagedCart = localStorage.getItem('@RocketShoes:cart');

    if (storagedCart) {
      return JSON.parse(storagedCart);
    }

    return [];
  });

  const addProduct = async (productId: number) => {
    try {
      
      const product = await api.get(`/products/${productId}`);
      const stock = await api.get(`/stock/${productId}`);
      const productCart = cart.filter( e => e.id == productId );
      const cartDistinct = cart.filter( e => e.id != productId );
      const cartItemsAmount : any  = 
          productCart.length > 0 
          ? productCart[0].amount + 1
          : 1;

      const newitem = { ...product.data, amount: cartItemsAmount };

      if (productCart.length != 0 && stock.data.amount < cartItemsAmount) {
        toast.error("Quantidade solicitada fora de estoque"); 
      } else {
        setCart([...cartDistinct, newitem ]);
      }

    } catch(error: any) {

      toast.error(error.message);

      if (error.message != "Quantidade solicitada fora de estoque") {
        toast.error("Erro na adição do produto");
      }

    }
  };

  useEffect( () => {
    
    if (cart.length > 0) {
      localStorage.setItem('@RocketShoes:cart', JSON.stringify(cart));
    }
    
  }, [ cart ])

  const removeProduct = (productId: number) => {
    try {
      // TODO
      const cartDistinct = cart.filter( e => e.id != productId );

      setCart(cartDistinct);
    } catch {
      toast.error('Erro na remoção do produto');
    }
  };

  const updateProductAmount = async ({
    productId,
    amount,
  }: UpdateProductAmount) => {
    try {
      
      const cartDistinct = cart.filter( e => e.id != productId );
      const cartUpdated = cart.filter( e => e.id == productId );

      const stock = await api.get(`/stock/${productId}`);

      if (cartUpdated.length != 0 && stock.data.amount < amount) return toast.error("Quantidade solicitada fora de estoque"); 

      const itemUpdated: any = { ...cartUpdated[0], amount }

      setCart([ ...cartDistinct, itemUpdated ]);

    } catch(error: any) {
        toast.error('Erro na alteração de quantidade do produto');
    }
  };

  return (
    <CartContext.Provider
      value={{ cart, addProduct, removeProduct, updateProductAmount }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextData {
  const context = useContext(CartContext);

  return context;
}
