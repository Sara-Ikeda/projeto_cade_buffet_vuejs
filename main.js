const app = Vue.createApp({
  data(){
    return{
      listBuffets: []
    }
  },

  async mounted(){
    this.listBuffets = await this.getBuffets();
  },

  methods:{
    async getBuffets(){
      let data = await fetch('http://localhost:3000/api/v1/buffets/'
        ).then(response => response.json());

      this.listBuffets = [];
      data.forEach(item => {
        var buffet = new Object();
        buffet.trade_name = item.trade_name;
        buffet.contact = item.contact;

        this.listBuffets.push(buffet);
      });
    }


  }

})

app.mount('#app');