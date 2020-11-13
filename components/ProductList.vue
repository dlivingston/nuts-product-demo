<template>
    <h2>product list</h2>
</template>
<script>
import Axios from 'axios'
export default {
    props: {
        auth_token: String
    },
    data() {
        return {
            list_data: ''
        }
    },
    mounted() {
        console.log('token', this.auth_token);
        Axios.post('https://api.commercetools.co/nuts-custom-demo-1/products?offset=0&limit=10',{}, {
            headers: {
                Authorization: `Bearer ${this.auth_token}`
            }
        }).then(response => {
            console.log('list', response.data)
        }).catch(error => {
            console.log('list error', error.response)
        })
    }

}
</script>