'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('pizza_places', [
      {
        name: "Crusty's Original",
        address: "123 Main St, San Francisco, CA 94105",
        phone_number: "(415) 555-0123",
        description: "Home of the original thin crust pizza since 1950. Known for our secret family sauce recipe and fresh ingredients.",
        average_rating: 4.5,
        website_url: "https://crustysoriginal.com",
        hours_of_operation: JSON.stringify({
          Monday: "11:00 AM - 10:00 PM",
          Tuesday: "11:00 AM - 10:00 PM",
          Wednesday: "11:00 AM - 10:00 PM",
          Thursday: "11:00 AM - 10:00 PM",
          Friday: "11:00 AM - 11:00 PM",
          Saturday: "12:00 PM - 11:00 PM",
          Sunday: "12:00 PM - 9:00 PM"
        }),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: "Pizzeria Napoli",
        address: "456 Market St, San Francisco, CA 94105",
        phone_number: "(415) 555-0124",
        description: "Authentic Neapolitan pizza made in our wood-fired oven. Imported ingredients from Italy.",
        average_rating: 4.8,
        website_url: "https://pizzerianapoli-sf.com",
        hours_of_operation: JSON.stringify({
          Monday: "Closed",
          Tuesday: "5:00 PM - 10:00 PM",
          Wednesday: "5:00 PM - 10:00 PM",
          Thursday: "5:00 PM - 10:00 PM",
          Friday: "5:00 PM - 11:00 PM",
          Saturday: "12:00 PM - 11:00 PM",
          Sunday: "12:00 PM - 9:00 PM"
        }),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: "Slice of Heaven",
        address: "789 Howard St, San Francisco, CA 94105",
        phone_number: "(415) 555-0125",
        description: "New York style pizza by the slice. Perfect for a quick lunch or late night craving.",
        average_rating: 4.2,
        website_url: "https://sliceofheaven.com",
        hours_of_operation: JSON.stringify({
          Monday: "10:00 AM - 2:00 AM",
          Tuesday: "10:00 AM - 2:00 AM",
          Wednesday: "10:00 AM - 2:00 AM",
          Thursday: "10:00 AM - 3:00 AM",
          Friday: "10:00 AM - 4:00 AM",
          Saturday: "11:00 AM - 4:00 AM",
          Sunday: "11:00 AM - 12:00 AM"
        }),
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('pizza_places', null, {});
  }
}; 