document.addEventListener('alpine:init', () => {
  Alpine.data('pizzaCartWithAPIWidget', function () {
    return {

      hideCart: "",
      name: '',
      username: '',
      pizzas: [],
      showUserHistory: '',
      openUserHistory: false,
      showFeaturedpizzas: [],
      cart_id: '',
      cart: { total: 0 },
      checkOutMessage: '',
      makePayment: false,
      Amount: 0,
      

      login() {
        if (this.username.length > 2) {
          this.createCart();
          alert("Welcome...");
        }
        else {
          alert("Username too short");
        }
      },
      logout() {
        if (confirm("Sign out..?") == true) {
          this.cart_id = '';
          this.username = '';
          this.name = '';
          localStorage['username'] = '';
          // this.cart_count = 0;
          // this.userCartContent = [];

        } else {
          this.cart_id = localStorage['cart_id'];
          this.username = localStorage['username'];
        }
      },

      init() {
        axios
          .get('https://pizza-api.projectcodex.net/api/pizzas')
          .then((result) => {


            this.pizzas = result.data.pizzas

          })
          .then(() => {
            this.username = localStorage['username']
            this.cart_id = localStorage['cart_id']
            return this.createCart();

          })
          .then(() => {
            this.featuredPizzas()
          })
      },

      featuredPizzas() {
        return axios
          .get(`https://pizza-api.projectcodex.net/api/pizzas/featured?username=${this.username}`)
          .then((result) => {
            this.showFeaturedpizzas = result.data;
            console.log(result.data);
          })
      },

      postfeaturedPizzas(pizza) {
        return axios
          .post('https://pizza-api.projectcodex.net/api/pizzas/featured', {
            "username": this.username,
            "pizza_id": pizza
          })
          .then((result) => {

            console.log(result.data)
            return this.featuredPizzas()
          })
      },

      createCart() {


        if (!this.username) {
          this.cart_id = "Enter Username to create a cart";

          return;
        }
        const username = localStorage['username']
        const cart_id = localStorage['cart_id'];

        if (cart_id && username) {
          this.cart_id = cart_id;
          this.username = username;
        }
        else {
          return axios
            .get(`https://pizza-api.projectcodex.net/api/pizza-cart/create?username=${this.username}`)
            .then((result) => {
              this.cart_id = result.data.cart_code;
              console.log(this.cart_id)
              localStorage['cart_id'] = this.cart_id;
              localStorage['username'] = this.username;
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
                window.location.reload();
                this.username = localStorage['username'];
                this.cart.total = 0;
                this.cart_count = 0;
                this.cart_id = '';
                this.localStorage['cart_id'] = '';
                this.checkOutMessage = '';
                this.createCart();

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