-- Create database if it doesn't exist
CREATE DATABASE crusty-db;

-- Connect to the database
\c crusty-db;

-- Create tables
CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    profile_picture_url VARCHAR(255),
    account_type VARCHAR(10) DEFAULT 'user',
    date_joined TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE pizza_places (
    pizza_place_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    address VARCHAR(255) NOT NULL,
    phone_number VARCHAR(15),
    website_url VARCHAR(255),
    location_lat DECIMAL(9, 6),
    location_lng DECIMAL(9, 6),
    description TEXT,
    average_rating DECIMAL(3, 2) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE reviews (
    review_id SERIAL PRIMARY KEY,
    user_id INT,
    pizza_place_id INT,
    rating INT CHECK (rating BETWEEN 1 AND 5),
    review_text TEXT,
    date_submitted TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    approval_status VARCHAR(10) DEFAULT 'pending',
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (pizza_place_id) REFERENCES pizza_places(pizza_place_id) ON DELETE CASCADE
);

CREATE TABLE toppings (
    topping_id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    type VARCHAR(20) NOT NULL CHECK (type IN ('meat', 'vegetable', 'cheese', 'sauce', 'other'))
);

CREATE TABLE pizza_place_toppings (
    pizza_place_id INT,
    topping_id INT,
    PRIMARY KEY (pizza_place_id, topping_id),
    FOREIGN KEY (pizza_place_id) REFERENCES pizza_places(pizza_place_id) ON DELETE CASCADE,
    FOREIGN KEY (topping_id) REFERENCES toppings(topping_id) ON DELETE CASCADE
);

CREATE TABLE pizza_types (
    type_id SERIAL PRIMARY KEY,
    dough_type VARCHAR(50) NOT NULL,
    crust_type VARCHAR(50) NOT NULL,
    oven_type VARCHAR(50) NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Add initial pizza types so foreign keys exist
INSERT INTO pizza_types (dough_type, crust_type, oven_type, createdAt, updatedAt) VALUES
('Thin Crust', 'Thin', 'Wood-Fired', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),   -- type_id = 1
('Thick Crust', 'Thick', 'Electric', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),   -- type_id = 2
('Stuffed Crust', 'Stuffed', 'Gas', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),    -- type_id = 3
('Gluten-Free', 'Gluten-Free', 'Wood-Fired', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP); -- type_id = 4

CREATE TABLE pizza_place_types (
    pizza_place_id INT,
    type_id INT,
    PRIMARY KEY (pizza_place_id, type_id),
    FOREIGN KEY (pizza_place_id) REFERENCES pizza_places(pizza_place_id) ON DELETE CASCADE,
    FOREIGN KEY (type_id) REFERENCES pizza_types(type_id) ON DELETE CASCADE
);

CREATE TABLE dietary_needs (
    need_id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL
);

CREATE TABLE user_dietary_needs (
    user_id INT,
    need_id INT,
    PRIMARY KEY (user_id, need_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (need_id) REFERENCES dietary_needs(need_id) ON DELETE CASCADE
);

CREATE TABLE challenges (
    challenge_id SERIAL PRIMARY KEY,
    challenge_name VARCHAR(100) NOT NULL,
    description TEXT,
    start_date TIMESTAMP,
    end_date TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE participate (
    user_id INT,
    challenge_id INT,
    PRIMARY KEY (user_id, challenge_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (challenge_id) REFERENCES challenges(challenge_id) ON DELETE CASCADE
);

CREATE TABLE polls (
    poll_id SERIAL PRIMARY KEY,
    question VARCHAR(255) NOT NULL,
    description TEXT,
    options JSON,
    date_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE vote (
    user_id INT,
    poll_id INT,
    PRIMARY KEY (user_id, poll_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (poll_id) REFERENCES polls(poll_id) ON DELETE CASCADE
);

CREATE TABLE deals (
    deal_id SERIAL PRIMARY KEY,
    pizza_place_id INT,
    description TEXT,
    expiration_date TIMESTAMP,
    FOREIGN KEY (pizza_place_id) REFERENCES pizza_places(pizza_place_id) ON DELETE CASCADE
);

CREATE TABLE map_coordinates (
    pizza_place_id INT,
    latitude DECIMAL(9, 6),
    longitude DECIMAL(9, 6),
    FOREIGN KEY (pizza_place_id) REFERENCES pizza_places(pizza_place_id) ON DELETE CASCADE
);

-- Make the user with email Adebayobadeniyi@gmail.com an admin
UPDATE users
SET account_type = 'admin'
WHERE email = 'Adebayobadeniyi@gmail.com';