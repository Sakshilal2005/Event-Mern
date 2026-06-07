const Event = require('../models/Event');

exports.getEvents = async (req, res) => {
    try {

        const filters = {};
        if (req.query.category) {
            filters.category = req.query.category;
        }
        if (req.query.ticketPrice) {
            filters.ticketPrice = req.query.ticketPrice;
        }
        
        const events = await Event.find(filters);
        res.json(events);
    } catch (error) {
        res.status(500).json({error: error.message });
    }
};

exports.getEventById = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        if(!event) {
            return res.status(404).json({error: 'Event not found'});
        }
        res.json(event);
    } catch(error) {
        res.status(500).json({error: error.message});
    }
};


exports.createEvent = async (req, res) => {
    const {title, description, date, location, category, totalSeats, ticketPrice, image} = req.body;
    try {
        const event = await Event.create({
    title,
    description,
    date,
    location,
    category,
    totalSeats,
    availableSeats: totalSeats,
    ticketPrice,
    image,
    createdBy: req.user._id
});
        res.status(201).json(event);
    } catch (error) {
        res.status(500).json({error: error.message}); 
    }
}

exports.updateEvent = async (req, res) => {
    const {title, description, date, location, category, totalSeats, ticketPrice, image} = req.body;
    try {
        const event = await Event.findByIdAndUpdate(req.params.id, {
             title,
             description,
             date,
             location,
             category,
             totalSeats,
             ticketPrice,
             image
        }, {new: true});
        if (!event) {
            return res.status(404).json({error: 'Event not found'});
        }
        res.json(event);
    } catch (error) {
        res.status(500).json({error: error.message})
    }
};


exports.deleteEvent = async (req, res) => {
    try {
        const event = await Event.findByIdAndDelete(req.params.id);
        if (!event) {
            return res.status(404).json({error: 'Event not found'});
        }
        res.json({message: 'Event deleted successfully'})
    }
    catch (error) {
        res.status(500).json({error: error.message});
    }
};
