document.addEventListener('alpine:init', () => {
    Alpine.data('pizzaCartWithAPIWidget', function () {
        return {
            PizzaList: [],

            init() {
                // call the api to load data into the screen here
                const cart_code = '...';
                const url = `https://pizza-api.projectcodex.net/api/pizzas`;

                axios.get(url).then((result) => {
                    const pizzas = result.data.pizzas;

                    // this.pizzas is declared on you AlpineJS Widget.
                    this.pizzas = pizzas;
                    this.PizzaList = pizzas; 
                    console.log(pizzas[0].type)
                })

                axios.post(url, { data: 'here' }).then((result) => {
                    const pizzas = result.data.pizzas;

                    // this.pizzas is declared on you AlpineJS Widget.
                    this.pizzas = pizzas;
                })
            }
        }
    })
})