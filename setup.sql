-- -- Drop tables if they exist (be careful with this in production!)
-- DROP TABLE IF EXISTS users CASCADE;
-- DROP TABLE IF EXISTS beverages CASCADE;
-- DROP TABLE IF EXISTS meals CASCADE;
-- DROP TABLE IF EXISTS snacks CASCADE;
-- DROP TABLE IF EXISTS saved_foods CASCADE;

-- -- Create users table
-- CREATE TABLE users (
--     id SERIAL PRIMARY KEY,
--     uid VARCHAR(255) UNIQUE NOT NULL,
--     email VARCHAR(255) UNIQUE NOT NULL,
--     name VARCHAR(255),
--     created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
--     last_login TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
-- );

-- -- Create beverages table
-- CREATE TABLE beverages (
--     id SERIAL PRIMARY KEY,
--     name VARCHAR(255) NOT NULL,
--     description TEXT,
--     wholesale_price DECIMAL(10, 2) NOT NULL,
--     selling_price DECIMAL(10, 2) NOT NULL,
--     rating DECIMAL(3, 2),
--     availability BOOLEAN DEFAULT true,
--     image_url TEXT,
--     created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
-- );

-- -- Create meals table
-- CREATE TABLE meals (
--     id SERIAL PRIMARY KEY,
--     name VARCHAR(255) NOT NULL,
--     description TEXT,
--     wholesale_price DECIMAL(10, 2) NOT NULL,
--     selling_price DECIMAL(10, 2) NOT NULL,
--     rating DECIMAL(3, 2),
--     availability BOOLEAN DEFAULT true,
--     image_url TEXT,
--     created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
-- );

-- -- Create snacks table
-- CREATE TABLE snacks (
--     id SERIAL PRIMARY KEY,
--     name VARCHAR(255) NOT NULL,
--     description TEXT,
--     wholesale_price DECIMAL(10, 2) NOT NULL,
--     selling_price DECIMAL(10, 2) NOT NULL,
--     rating DECIMAL(3, 2),
--     availability BOOLEAN DEFAULT true,
--     image_url TEXT,
--     created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
-- );

-- -- Create saved_foods table for favorites
-- CREATE TABLE saved_foods (
--     id SERIAL PRIMARY KEY,
--     user_id VARCHAR(255) REFERENCES users(uid),
--     item_id INTEGER NOT NULL,
--     item_type VARCHAR(50) NOT NULL,
--     created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
--     UNIQUE(user_id, item_id)
-- );

-- -- Create indexes for better query performance
-- CREATE INDEX idx_users_uid ON users(uid);
-- CREATE INDEX idx_users_email ON users(email);
-- CREATE INDEX idx_saved_foods_user_id ON saved_foods(user_id);
-- CREATE INDEX idx_saved_foods_item_id ON saved_foods(item_id);

CREATE TABLE menu_items (
    id SERIAL PRIMARY KEY,
    availability BOOLEAN NOT NULL DEFAULT TRUE,
    name TEXT NOT NULL,
    description TEXT,
    wholesale_price NUMERIC(10,2) NOT NULL CHECK (wholesale_price >= 0),
    selling_price NUMERIC(10,2) NOT NULL CHECK (selling_price >= 0),
    rating NUMERIC(3,2) CHECK (rating >= 0 AND rating <= 5),
    image_url TEXT,
    special BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

create table contact_us(
	id serial primary key,
	name text,
	email text,
	subject text,
	message text
);

CREATE TABLE orders (
    order_id text PRIMARY KEY,
    order_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    user_id text NOT NULL,
    order_status TEXT CHECK (order_status IN ('PENDING', 'PAID', 'COMPLETE')),
    price NUMERIC(10,2) NOT NULL CHECK (price >= 0),
    service_charge NUMERIC(10,2) DEFAULT 0 CHECK (service_charge >= 0)
);

CREATE TABLE order_items(
	order_id text,
	item_id int,
	quantity int,
	PRIMARY KEY(order_id,item_id),
	FOREIGN KEY (item_id) references menu_items(id),
	FOREIGN KEY (order_id) references orders(order_id)
);

CREATE TABLE users (
    uid TEXT PRIMARY KEY, 
    email TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_login TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

create table saved_foods (
	id serial primary key,
	user_id text,
	item_id int,
	foreign key (item_id) references menu_items(id)
)