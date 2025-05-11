const { Deal, PizzaPlace } = require('../models');

exports.getAllDeals = async (req, res) => {
  try {
    const deals = await Deal.findAll({
      include: [
        {
          model: PizzaPlace,
          attributes: ['name', 'address']
        }
      ]
    });
    res.json(deals);
  } catch (error) {
    console.error('Get all deals error:', error);
    res.status(500).json({ message: 'Error getting deals' });
  }
};

exports.getDealById = async (req, res) => {
  try {
    const deal = await Deal.findByPk(req.params.id, {
      include: [
        {
          model: PizzaPlace,
          attributes: ['name', 'address']
        }
      ]
    });
    
    if (!deal) {
      return res.status(404).json({ message: 'Deal not found' });
    }

    res.json(deal);
  } catch (error) {
    console.error('Get deal by ID error:', error);
    res.status(500).json({ message: 'Error getting deal' });
  }
};

exports.getDealsByPizzaPlace = async (req, res) => {
  try {
    const deals = await Deal.findAll({
      where: { pizza_place_id: req.params.pizzaPlaceId },
      include: [
        {
          model: PizzaPlace,
          attributes: ['name', 'address']
        }
      ]
    });
    res.json(deals);
  } catch (error) {
    console.error('Get deals by pizza place error:', error);
    res.status(500).json({ message: 'Error getting deals' });
  }
};

exports.createDeal = async (req, res) => {
  try {
    const { pizza_place_id, title, description, start_date, end_date, discount_percentage } = req.body;
    
    // Validate input
    if (!pizza_place_id || !title || !description || !start_date || !end_date || !discount_percentage) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const deal = await Deal.create({
      pizza_place_id,
      title,
      description,
      start_date,
      end_date,
      discount_percentage
    });

    res.status(201).json(deal);
  } catch (error) {
    console.error('Create deal error:', error);
    res.status(500).json({ message: 'Error creating deal' });
  }
};

exports.updateDeal = async (req, res) => {
  try {
    const { title, description, start_date, end_date, discount_percentage } = req.body;
    const deal = await Deal.findByPk(req.params.id);
    
    if (!deal) {
      return res.status(404).json({ message: 'Deal not found' });
    }

    await deal.update({
      title: title || deal.title,
      description: description || deal.description,
      start_date: start_date || deal.start_date,
      end_date: end_date || deal.end_date,
      discount_percentage: discount_percentage || deal.discount_percentage
    });

    res.json(deal);
  } catch (error) {
    console.error('Update deal error:', error);
    res.status(500).json({ message: 'Error updating deal' });
  }
};

exports.deleteDeal = async (req, res) => {
  try {
    const deal = await Deal.findByPk(req.params.id);
    
    if (!deal) {
      return res.status(404).json({ message: 'Deal not found' });
    }

    await deal.destroy();
    res.json({ message: 'Deal deleted successfully' });
  } catch (error) {
    console.error('Delete deal error:', error);
    res.status(500).json({ message: 'Error deleting deal' });
  }
};