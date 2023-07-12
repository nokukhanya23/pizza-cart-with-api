document.addEventListener('alpine:init', () => {
  Alpine.data('pizzaCartWithAPIWidget', function () {
    return {
      name: '',
      username: 'khanyi',
      pizzas: [],
      showUserHistory: '',
      openUserHistory: false,
      featuredpizzas: [],
      cart_id: '',
      cart: { total: 0 },
      checkOutMessage: '',
      makePayment: false,
      Amount: 0,
      pCount: 0,

      init() {
        axios
          .get('https://pizza-api.projectcodex.net/api/pizzas')
          .then((result) => {
            this.pizzas = result.data.pizzas
          })
          .then(() => {
            this.UserHistory();
            return this.createCart();
          })
      },

      featuredPizzas() {
        return axios
          .get('https://pizza-api.projectcodex.net/api/pizzas/featured')
      },

      postfeaturedPizzas() {
        return axios
          .post('https://pizza-api.projectcodex.net/api/pizzas/featured')
      },

      createCart() {


        if (!this.username) {
          // this.cart_id = "Enter Username to create a cart";

          return;
        }

        const cart_id = localStorage['cart_id'];

        if (cart_id) {
          this.cart_id = cart_id;
        }
        else {
          return axios
            .get(`https://pizza-api.projectcodex.net/api/pizza-cart/create?username=${this.username}`)
            .then((result) => {
              this.cart_id = result.data.cart_code;
              console.log(this.cart_id)
              localStorage['cart_id'] = this.cart_id;
            });
        }

      },

      showCartContent() {
        const url = `https://pizza-api.projectcodex.net/api/pizza-cart/${this.cart_id}/get`;

        axios
          .get(url)
          .then((result) => {
            this.cart = result.data;
          });
      },

      UserHistory() {
        axios.get(`https://pizza-api.projectcodex.net/api/pizza-cart/username/${this.username}`)
          .then((result) => {
            this.showUserHistory = result.data;
            console.log(this.showUserHistory)
          })
      },

      showCartContent() {
        const url = `https://pizza-api.projectcodex.net/api/pizza-cart/${this.cart_id}/get`;

        axios
          .get(url)
          .then((result) => {
            this.cart = result.data;
          });
      },


      addPizza(pizza) {
        axios
          .post('https://pizza-api.projectcodex.net/api/pizza-cart/add', {
            cart_code: this.cart_id,
            pizza_id: pizza.id
          })
          .then(() => {
            this.message = "Pizza added to the cart"
            this.showCartContent();
          })
          .then(() => {

            return this.featuredPizzas();

          })
          .then(() => {
            return this.postfeaturedPizzas();
          })

      },


      removePizza(pizza) {

        axios
          .post('https://pizza-api.projectcodex.net/api/pizza-cart/remove', {
            cart_code: this.cart_id,
            pizza_id: pizza.id
          })
          .then(() => {
            this.message = "Pizza removed from the cart"
            this.showCartContent();
          })


      },
      payment(pizza) {

        axios
          .post('https://pizza-api.projectcodex.net/api/pizza-cart/pay', {
            cart_code: this.cart_id,
          })
          .then(() => {
            if (this.Amount >= this.cart.total) {
              this.checkOutMessage = 'Enjoy your pizza';
              this.change = this.Amount - this.cart.total;
              setTimeout(() => {
                this.cart.total = 0;
                this.cart_count = 0;
                this.cart_id = '';
                this.localStorage['cart_id']
                this.checkOutMessage = '';
                window.location.reload();
              }, 5000);

            } else if (this.Amount < this.cart.total) {
              this.checkOutMessage = 'Sorry, That is not enough money!'
              setTimeout(() => {
                this.checkOutMessage = ''
              }, 5000);
            }

          })

      }


    }
  });


})