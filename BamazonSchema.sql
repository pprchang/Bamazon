DROP DATABASE IF EXISTS Bamazon_DB;

CREATE DATABASE Bamazon_DB;

USE Bamazon_DB;

CREATE Table products
(
    item_id INT NOT NULL
    AUTO_INCREMENT,
    product_name VARCHAR
    (100) NOT NULL,
    department_name VARCHAR
    (100) NOT NULL,
    price DECIMAL
    (10, 2) NOT NULL default 0,
    stock_quantity INT default 0,
    PRIMARY KEY
    (item_id)
);

    INSERT INTO products
        (product_name, department_name, price, stock_quantity)
    VALUES
        ('L.O.L Surprise Doll', 'toys', 10.88, 60),
        ('Play-Doh Modeling Compound', 'toys', 7.99, 50),
        ('Card Against Humanity', 'toys', 25.00, 25),
        ('Fire TV Stick', 'electronics', 24.99, 70 ),
        ('Echo Dot (3rd Gen)', 'electronics', 49.99, 60),
        ('$10 PlayStation Store Gift Card', 'video games', 10.00, 20),
        ('$10 Xbox Gift Card', 'video games', 10.00, 20),
        ('The Hope of Glory', 'books', 15.38, 35),
        ('The Ultimate Retirement Guide for 50+', 'books', 16.34, 30),
        ('Where the Crawdads Sing', 'books', 9.59, 45);
