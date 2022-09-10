import { CART_SAVE_BILLING_ADDRESS } from '../constants/cartConstants'

export const saveBillingAddress = (data) => (dispatch) => {
  dispatch({
    type: CART_SAVE_BILLING_ADDRESS,
    payload: data,
  })

  localStorage.setItem('billingAddress', JSON.stringify(data))
}
