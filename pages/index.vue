<template>
  <div class="container" v-infinite-scroll="loadMore" infinite-scroll-disabled="busy" infinite-scroll-distance="10">
    <div>
      <h1 class="title">
        Nuts.com Product List Demo
      </h1>
      <div class="row justify-content-center">
        <div class="card col-6 col-md-4" v-for="product in product_listing" :key="product.id" @click="$bvModal.show(`modal-${product.id}`)">
          <h2>{{product.masterData.current.name.en}}</h2>
          <img :src="product.masterData.current.masterVariant.images[0].url" :alt="product.masterData.current.name.en" class="img-fluid">
          <b-modal :ref="`modal-${product.id}`" :id="`modal-${product.id}`" :title="product.masterData.current.name.en">
            <p>{{product.masterData.current.description.en}}</p>
            <div class="row">
              <div class="col" v-for="(image, key) in product.masterData.current.masterVariant.images" :key="key">
                <img :src="image.url" alt="" class="img-thumbnail">
              </div>
            </div>
            <p><strong>Price: </strong>{{product.masterData.current.masterVariant.prices.length > 0 ? formatPrice(product.masterData.current.masterVariant.prices[0].value.centAmount, product.masterData.current.masterVariant.prices[0].value.fractionDigits, product.masterData.current.masterVariant.prices[0].value.currencyCode)  : 'N/A' }}</p>
            <template v-if="organicIndex(product.masterData.current.masterVariant.attributes) !== -1 && product.masterData.current.masterVariant.attributes[organicIndex(product.masterData.current.masterVariant.attributes)].value !== false">
              <img src="/5e85d71501308335-L2AE6hCf-thumb.jpg" alt="Organic">
            </template>
            
          </b-modal>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import axios from 'axios'
import querystring from 'querystring'
import ProductList from '../components/ProductList.vue'
export default {
  components: { ProductList },
  name: 'ProductPage',
  data() {
    return {
      busy: false
    }
  },
  created() {
    this.$store.dispatch('fetchProductListing')
    .then(() => {})
  },
  computed: {
    ...mapState({
      auth_token: state => state.auth_token,
      product_listing: state => state.product_listing
    })
  },
  methods: {
    formatPrice(cents, digits, currency) {
      return (currency === "USD" ? "$" : "") + Number(cents/100).toFixed(digits);
    },
    organicIndex(arr) {
      return arr.findIndex(x => x.name === 'Organic');
    },
    loadMore() {
      this.busy = true;
      this.$store.dispatch('fetchMoreProducts')
      .then(() => {
        this.busy = false;
      })
    }
  }
}
</script>

<style lang="scss">
.container {
  margin: 0 auto;
  min-height: 100vh;
  display: flex;
  .title {
    font-family:
      'Quicksand',
      'Source Sans Pro',
      -apple-system,
      BlinkMacSystemFont,
      'Segoe UI',
      Roboto,
      'Helvetica Neue',
      Arial,
      sans-serif;
    display: block;
    font-weight: 300;
    font-size: 3rem;
    color: #35495e;
    letter-spacing: 1px;
  }
}
.card {
  margin: 0.5rem;
}

</style>
