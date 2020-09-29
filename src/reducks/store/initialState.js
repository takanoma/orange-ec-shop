const initialState = {
    products: {
        list: []
    },
    users: {
        cart: [],
        isSignedIn: false,
        orders: [],
        role: "",
        uid: "",
        username: "",
        isAuthenticated: false
    },
    message: {
        type: "",
        content: ""
    }
};

export default initialState