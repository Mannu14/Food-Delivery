import { useSelector, useDispatch } from 'react-redux';
import { REMOVE, UPDATE_ITEM_QUANTITY, ADD } from '../redux/action/action';
import { Link } from "react-router-dom";
import './Shoping.css';
import { LazyLoadImage } from 'react-lazy-load-image-component';

function Cart({ isVisible, onToggleCart }) {
    const cartItems = useSelector((state) => state.cartreduser.carts);
    const dispatch = useDispatch();

    const handleQuantityChange = (e, DataId) => {
        const value = parseInt(e.target.value);
        if (value > 0) {
            dispatch(UPDATE_ITEM_QUANTITY(DataId, value));
        } else {
            dispatch(REMOVE(DataId));
        }
    };

    const remove = (id) => {
        dispatch(REMOVE(id));
    };


    const totalPrice = cartItems.reduce((total, item) => {
        return total + parseFloat(item.price) * item.value;
    }, 0);

    return (
        <div className={`small-container cart-page ${isVisible ? 'cart-visible' : 'cart-hidden'}`}>
            <i className="fa fa-times visiblityclass" onClick={onToggleCart}></i>
            <div className="details-Cart">
                <table>
                    <tbody>
                        <tr>
                            <th>Product</th>
                            <th>Quantity</th>
                            <th>Subtotal</th>
                        </tr>
                        {cartItems.length > 0 ? (
                            cartItems.map((item, index) => (
                                <tr key={index} style={{ borderBottom: '1px dotted #929dc4', fontSize: '13px' }}>
                                    <td>
                                        <div className="cart-info" style={{ width: '70px', height: '70px', borderRadius: '10px', backgroundColor: '#c1affb' }}>
                                            <LazyLoadImage src={item.imgSrc} alt={item.title}
                                                effect="opacity"
                                                wrapperProps={{
                                                    style: { transitionDelay: "1s" },
                                                }}
                                            />
                                        </div>
                                        <div className="cart-info-2">
                                            <small>Price: ₹{item.price}</small>
                                            <p>{item.title}</p>
                                        </div>
                                    </td>
                                    <td style={{ display: 'flex', height: '160px', alignItems: 'center', textAlign: 'center' }}>
                                        <input type="number" min="1" value={item.value} onChange={(e) => handleQuantityChange(e, item.DataId)} />
                                        <p><i className="fa fa-trash" onClick={() => remove(item.DataId)}></i></p>
                                    </td>
                                    <td className="addPrice">₹{(item.value * item.price).toFixed(2)}</td>
                                </tr>
                            ))
                        ) : (
                            <tr key="otherwise">
                                <td>Add Items</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            {cartItems.length > 0 ? (
                <div className="total-price">
                    <table style={{ fontSize: '13px' }}>
                        <tbody>
                            <tr>
                                <td>Subtotal</td>
                                <td>₹{totalPrice.toFixed(2)}</td>
                            </tr>
                            <tr>
                                <td>Tax</td>
                                <td>₹37.086</td>
                            </tr>
                            <tr>
                                <td>Total</td>
                                <td>₹{(totalPrice + 37.086).toFixed(2)}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className="total-price">
                    <table>
                        <tbody>
                            <tr>
                                <td>Subtotal</td>
                                <td>₹0.00</td>
                            </tr>
                            <tr>
                                <td>Tax</td>
                                <td>₹0.00</td>
                            </tr>
                            <tr>
                                <td>Total</td>
                                <td>₹0.00</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            )}
            {cartItems.length > 0 && <button className="OrderNow"><Link to='/Cart'>Order Now</Link></button>}
        </div>
    );
}

export default Cart;
