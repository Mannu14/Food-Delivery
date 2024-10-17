export const ADD = (item) => {
    return {
        type: 'ADD_CART',
        payload: item
    };
};

export const REMOVE = (DataId) => {
    return {
        type: 'REMOVE_CART',
        payload: DataId
    };
};

export const UPDATE_ITEM_QUANTITY = (DataId, value) => {
    return {
        type: 'UPDATE_ITEM_QUANTITY',
        payload: { DataId, value }
    };
};

export const clearCart = () => {
    return {
        type: 'CLEAR_CART',
    };
};

