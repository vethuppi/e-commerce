import {
  CART_REMOVE_ITEM,
  CART_ADD_ITEM,
  CART_SAVE_BILLING_ADDRESS,
  CART_REMOVE_ALL_ITEMS,
} from '../constants/cartConstants'

export const cartReducer = (
  state = { cartItems: [], billingAddress: {} },
  action
) => {
  switch (action.type) {
    case CART_ADD_ITEM:
      const item = action.payload
      const existItem = state.cartItems.find((x) => x.product === item.product)
      if (existItem) {
        return {
          ...state,
          cartItems: state.cartItems.map((x) =>
            x.product === existItem.product ? item : x
          ),
        }
      } else {
        return {
          ...state,
          cartItems: [...state.cartItems, item],
        }
      }
    case CART_REMOVE_ITEM:
      return {
        ...state,
        cartItems: state.cartItems.filter((x) => x.product !== action.payload),
      }
    case CART_SAVE_BILLING_ADDRESS:
      return {
        ...state,
        billingAddress: action.payload,
      }
    case CART_REMOVE_ALL_ITEMS:
      return {
        ...state,
        cartItems: [],
      }

    default:
      return state
  }
}
