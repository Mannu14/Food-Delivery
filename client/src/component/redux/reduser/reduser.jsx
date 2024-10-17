const INIT_STATE = {
    carts: JSON.parse(localStorage.getItem('carts')) || []
};

const updateLocalStorage = (carts) => {
    localStorage.setItem('carts', JSON.stringify(carts));
};

export const cartreduser = (state = INIT_STATE, action) => {
    let updatedCarts;

    switch (action.type) {
        case 'ADD_CART':
            // Check if item is already in the cart
            const itemExists = state.carts.find(item => item.DataId === action.payload.DataId);
            if (itemExists) {
                updatedCarts = state.carts.map(item =>
                    item.DataId === action.payload.DataId
                        ? { ...item, value: item.value + 1 }
                        : item
                );
            } else {
                updatedCarts = [...state.carts, { ...action.payload, value: 1 }];
            }
            updateLocalStorage(updatedCarts);
            return {
                ...state,
                carts: updatedCarts
            };

        case 'REMOVE_CART':
            updatedCarts = state.carts.filter(item => item.DataId !== action.payload);
            updateLocalStorage(updatedCarts);
            return {
                ...state,
                carts: updatedCarts
            };

        case 'UPDATE_ITEM_QUANTITY':
            updatedCarts = state.carts.map(item =>
                item.DataId === action.payload.DataId
                    ? { ...item, value: action.payload.value }
                    : item
            ).filter(item => item.value > 0);
            updateLocalStorage(updatedCarts);
            return {
                ...state,
                carts: updatedCarts
            };

        case 'CLEAR_CART':
            updateLocalStorage([]);
            return {
                ...state,
                carts: []
            };

        default:
            return state;
    }
};
