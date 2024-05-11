const app = Vue.createApp({
  data(){
    return{
      showBuffets: true,
      searchBuffet: '',
      listBuffets: [],
      buffetInfo: [],
      buffetEvents:[]
    }
  },

  async mounted(){
    this.buffets = await this.getBuffets();
  },

  methods:{
    rootPath(){
      this.buffetInfo = [];
      this.buffetEvents = [];
      this.showBuffets = true;
    },

    async getBuffets(){
      this.listBuffets = [];

      let data = await fetch('http://localhost:3000/api/v1/buffets/'
        ).then(response => response.json());

      data.forEach(item => {
        var buffet = new Object();
        buffet.trade_name = item.trade_name;
        buffet.contact = item.contact;

        this.listBuffets.push(buffet);
      });
    },

    async getBuffetInfo(id){
      this.showBuffets = false;
      this.buffetInfo = [];
      this.buffetEvents = [];

      let data = await fetch(`http://localhost:3000/api/v1/buffets/${id+1}`
        ).then(response => response.json());
      var infos = new Object();
      infos.trade_name = data.trade_name;
      infos.description = data.description;
      infos.payment_types = data.payment_types;
      infos.address = data.address.street + ` , nº ` + data.address.number +
                      `. ` + data.address.city + `/` + data.address.state +
                      ` - CEP: ` + data.address.zip;

      this.buffetInfo = infos;
      
      let other_data = await fetch(`http://localhost:3000/api/v1/buffets/${id+1}/events`
      ).then(response => response.json())

      other_data.forEach(item => {
        var event = new Object();
        event.name = item.name;
        event.description = item.event_description;
        event.minimum_of_people = item.minimum_of_people;
        event.maximum_of_people = item.maximum_of_people;
        event.duration = item.duration;
        event.menu = item.menu;
        {
        var extra_services = [ ];
        if (item.alcoholic_drink == 'provided')
          extra_services.push(" Bebidas Alcoólicas");
        if (item.ornamentation == 'provided')
          extra_services.push(" Decoração ");
        if (item.valet == 'provided')
          extra_services.push(" Valet (Serviço de Estacionamento ");
        }
        event.extra_services = extra_services.join();

        if (item.locality == 'only_on_site')
          event.locality = 'No endereço do Buffet';
        else
          event.locality = 'À escolha do cliente';

        this.buffetEvents.push(event);
      });
    
    }

  },

  computed:{
    buffets(){
      if(this.searchBuffet){
        return this.listBuffets.filter(buffet => {
          return buffet.trade_name.toLowerCase().includes(this.searchBuffet.toLowerCase())
        });
      }else{
        return this.listBuffets;
      }
    }
  }

})

app.mount('#app');