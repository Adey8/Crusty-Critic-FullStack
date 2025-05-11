'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('pizza_places', [
      {
        name: "Pizzana",
        address: "Multiple locations (Brentwood, Marina del Rey, Sherman Oaks, West Hollywood, Silver Lake)",
        phone_number: "555-3344",
        description: "Neo-Neapolitan pies by chef Daniele Uditi, featuring innovative toppings like nduja walnut romesco",
        website_url: "https://pizzana.com",
        average_rating: 0,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: "Tony’s Pizza Napoletana",
        address: "1570 Stockton St, San Francisco, CA",
        phone_number: "555-1122",
        description: "13-time World Pizza Champion Tony Gemignani’s spot mastering NY, Neapolitan, Chicago, and Detroit styles",
        website_url: "https://tonyspizzanapoletana.com",
        average_rating: 0,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: "Pizzeria Mozza",
        address: "641 N Highland Ave, Los Angeles, CA",
        phone_number: "555-8899",
        description: "James Beard-winning pizzas with Californian ingredients and a legendary crust by Nancy Silverton",
        website_url: "https://www.pizzeriamozza.com",
        average_rating: 0,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: "Stadium Pizza",
        address: "32270 Temecula Pkwy, Temecula, CA",
        phone_number: "555-6677",
        description: "Sports-themed community hub with Detroit-style pies, craft beer, and family-friendly vibes",
        website_url: "https://www.stadiumpizza.com",
        average_rating: 0,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: "Davanti Enoteca",
        address: "1655 India St, San Diego, CA",
        phone_number: "555-4433",
        description: "Upscale Italian spot serving rare Focaccia di Recco with stracchino cheese",
        website_url: "https://davantienoteca.com",
        average_rating: 0,
        created_at: new Date(),
        updated_at: new Date()
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('pizza_places', {
      name: [
        "Pizzana",
        "Tony’s Pizza Napoletana",
        "Pizzeria Mozza",
        "Stadium Pizza",
        "Davanti Enoteca"
      ]
    }, {});
  }
};
