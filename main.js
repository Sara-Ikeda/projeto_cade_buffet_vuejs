const app = Vue.createApp({
  data(){
    return{
      showBuffets: true,
      searchBuffet: '',
      listBuffets: [],
      buffetInfo: [],
      buffetEvents:[],
      selectedEventIdQuery: '',
      dateQuery: '',
      quantityQuery: '',
      resultQuery: 0
    }
  },

  async mounted(){
    this.buffets = await this.getBuffets();
  },

  methods:{
    rootPath(){
      this.buffetEvents = [];
      this.buffetInfo = [];
      this.selectedEventIdQuery = '';
      this.dateQuery = '';
      this.quantityQuery = '';
      this.resultQuery = 0;
      this.showBuffets = true;
    },

    async calculate_standard_value(){
      let eventIdQuery = this.buffetEvents[this.selectedEventIdQuery].id;
      let buffetIdQuery =  this.buffetInfo.id;
      
      this.resultQuery = await fetch(`http://localhost:3000/api/v1/buffets/${
        buffetIdQuery}/events/${eventIdQuery}/query?date=${this.dateQuery
        }&number_of_guests=${this.quantityQuery}`).then(response => response.json());
    },

    async getBuffets(){
      this.listBuffets = [];

      let buffets_data = await fetch('http://localhost:3000/api/v1/buffets/'
        ).then(response => response.json());

      buffets_data.forEach(item => {
        var buffet = new Object();
        buffet.trade_name = item.trade_name;
        buffet.contact = item.contact;

        this.listBuffets.push(buffet);
      });
    },

    async getBuffetInfo(id){
      this.showBuffets = false;

      let b_info_data = await fetch(`http://localhost:3000/api/v1/buffets/${id+1}`
        ).then(response => response.json());
      var infos = new Object();
      infos.id = b_info_data.id;
      infos.trade_name = b_info_data.trade_name;
      infos.description = b_info_data.description;
      infos.payment_types = b_info_data.payment_types;
      infos.address = b_info_data.address.street + ` , nº ` + b_info_data.address.number +
                      `. ` + b_info_data.address.city + `/` + b_info_data.address.state +
                      ` - CEP: ` + b_info_data.address.zip;

      this.buffetInfo = infos;
      
      let events_data = await fetch(`http://localhost:3000/api/v1/buffets/${id+1}/events`
      ).then(response => response.json())

      events_data.forEach(item => {
        var event = new Object();
        event.id = item.id;
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