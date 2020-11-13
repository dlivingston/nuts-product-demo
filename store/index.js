import axios from 'axios';
import querystring from 'querystring'
export const state = () => ({
    auth_token: '',
    product_listing: [],
    product_offset: 0,
    product_total: 10
})

export const mutations = {
    SET_TOKEN: (state, response) => {
        state.auth_token = response.data.access_token
    },
    SET_PRODUCT_LIST: (state, response) => {
        state.product_listing = response.data.results;
        state.product_offset += response.data.count;
        state.product_total = response.data.total;
    },
    APPEND_PRODUCT_LIST: (state, response) => {
        response.data.results.forEach(item => { if(state.product_listing.findIndex(x => x.id === item.id) === -1) {state.product_listing.push(item)} });
        state.product_offset += response.data.count;
    }
}

export const actions = {
    async fetchToken({commit}) {
        const params = querystring.stringify({
            'scope': 'view_products:nuts-custom-demo-1',
            'grant_type': 'client_credentials'
        });
        await axios.post('https://auth.commercetools.co/oauth/token', params, {
            auth: {
              'username': 'BZaa-av5L6RmZKlPgZaGNkea',
              'password': 'jchbf_Q5zRWCaEg4TCB4m9cLIioPiml0'
            },
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded'
            }
        }).then(response =>{
            if(response.status === 200) {
                commit('SET_TOKEN', response);
            }  
        })
    },
    async fetchProductListing({dispatch, commit, state}) {
        await dispatch('fetchToken')
        const config = {
            headers: { Authorization: `Bearer ${state.auth_token}` }
        }
        await axios.get('https://api.commercetools.co/nuts-custom-demo-1/products?offset=0&limit=10', config
        ).then(response => {
            commit('SET_PRODUCT_LIST', response)
        }).catch(error => {
            console.log('list error', error.response)
        })
    },
    async fetchMoreProducts({commit, state}) {
        if(state.product_offset <=  state.product_total) {
            const config = {
                headers: { Authorization: `Bearer ${state.auth_token}` }
            }
            await axios.get(`https://api.commercetools.co/nuts-custom-demo-1/products?offset=${state.product_offset}&limit=10`, config
            ).then(response => {
                console.log('list', response.data)
                commit('APPEND_PRODUCT_LIST', response)
            }).catch(error => {
                console.log('list error', error.response)
            })
        }
        
    }
}

export const getters = {
    getAuthToken: state => {
        return state.auth_token
    }
}