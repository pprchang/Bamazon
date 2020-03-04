//requires
const mysql = require('mysql');
const inquirer = require('inquirer');
const chalk = require('chalk');
const Table = require('cli-table');

//create connection
var connection = mysql.createConnection({
  host: 'localhost',
  port: '3306',
  user: 'root',
  password: 'logan4',
  database: 'Bamazon_DB'
});

connection.connect(function(err) {
  if (err) throw err;
  start();
});

// function to prompt the options to manger
function start() {
  console.log(
    chalk.magenta.bold(
      '--~~~--~~~--~~~--~~~  WELCOME TO BAMAZON INVENTORY CONTROL ~~~--~~~--~~~--~~~--'
    )
  );

  inquirer
    .prompt([
      {
        type: 'list',
        name: 'inventoryOption',
        message: 'What would you like to do?',
        choices: [
          'View Products for Sale',
          'View Low Inventory',
          'Add to Inventory',
          'Add New Product',
          'Exit'
        ]
      }
    ])
    .then(function(answer) {
      //switch statement: call function base on the manger choice
      switch (answer.inventoryOption) {
        case 'View Products for Sale':
          viewProdcuts();
          break;
        case 'View Low Inventory':
          viewLowInventory();
          break;
        case 'Add to Inventory':
          addToInventory();
          break;
        case 'Add New Product':
          addNewProduct();
          break;
        case 'Exit':
          exit();
          break;
      }
    });
}

function viewProdcuts() {
  console.log(
    chalk.magenta.bold('============= BAMAZON CURRENT PRODUCTS ============')
  );

  //query to database to select all products info and display it to a table
  connection.query('SELECT * FROM products', function(err, res) {
    if (err) throw err;
    var inventoryInfo = new Table({
      head: [
        chalk.blue.bold.underline('Item ID'),
        chalk.green.bold.underline('Product Name'),
        chalk.yellow.bold.underline('Department'),
        chalk.cyan.bold.underline('Price'),
        chalk.red.bold.underline('Stock Quantity')
      ],
      colWidths: [10, 45, 20, 10, 30]
    });
    for (var i = 0; i < res.length; i++) {
      inventoryInfo.push([
        chalk.blue.bold(res[i].item_id),
        chalk.green.bold(res[i].product_name),
        chalk.yellow.bold(res[i].department_name),
        chalk.cyan.bold(res[i].price),
        chalk.red.bold(res[i].stock_quantity)
      ]);
    }
    console.log(inventoryInfo.toString());

    start();
  });
}

function viewLowInventory() {
  console.log(
    chalk.magenta.bold('============= BAMAZON LOW INVENTORY ============')
  );
  //query to database to select all products which a quantity less than 5 and display it to a table
  connection.query('SELECT * FROM products', function(err, res) {
    if (err) throw err;
    var lowInventory = new Table({
      head: [
        chalk.blue.bold.underline('Item ID'),
        chalk.green.bold.underline('Product Name'),
        chalk.yellow.bold.underline('Department'),
        chalk.cyan.bold.underline('Price'),
        chalk.red.bold.underline('Stock Quantity')
      ],
      colWidths: [10, 45, 20, 10, 30]
    });
    for (var i = 0; i < res.length; i++) {
      if (res[i].stock_quantity <= 5) {
        lowInventory.push([
          chalk.blue.bold(res[i].item_id),
          chalk.green.bold(res[i].product_name),
          chalk.yellow.bold(res[i].department_name),
          chalk.cyan.bold(res[i].price),
          chalk.red.bold(res[i].stock_quantity)
        ]);
      }
    }

    console.log(lowInventory.toString());

    start();
  });
}

function addToInventory() {
  console.log(
    chalk.magenta.bold('============= BAMAZON ADDING INVENTORY ============')
  );
  //query to database to select all products and display it to a table
  connection.query('SELECT * FROM products', function(err, res) {
    if (err) throw err;
    var addInventory = new Table({
      head: [
        chalk.blue.bold.underline('Item ID'),
        chalk.green.bold.underline('Product Name'),
        chalk.yellow.bold.underline('Department'),
        chalk.cyan.bold.underline('Price'),
        chalk.red.bold.underline('Stock Quantity')
      ],
      colWidths: [10, 45, 20, 10, 30]
    });
    for (var i = 0; i < res.length; i++) {
      addInventory.push([
        chalk.blue.bold(res[i].item_id),
        chalk.green.bold(res[i].product_name),
        chalk.yellow.bold(res[i].department_name),
        chalk.cyan.bold(res[i].price),
        chalk.red.bold(res[i].stock_quantity)
      ]);
    }
    console.log(addInventory.toString());

    //prompt to manger to request change in which product and how many
    inquirer
      .prompt([
        {
          name: 'itemID',
          type: 'input',
          message:
            chalk.white.bold(
              'Which product would you like to add inventory to? Please enter the '
            ) +
            chalk.blue.bold('Item ID') +
            chalk.white.bold('.'),
          validate: function(value) {
            return isNaN(value) === false ? true : false;
          }
        },
        {
          name: 'amountAdding',
          type: 'input',
          message: chalk
            .rgb(129, 227, 238)
            .bold('How many do you want to add?'),
          validate: function(value) {
            return isNaN(value) === false ? true : false;
          }
        }
      ])
      .then(function(answer) {
        //query to database to get the product info that the manger selected
        connection.query(
          'SELECT * FROM products WHERE item_id=?',
          answer.itemID,
          function(err, res) {
            if (err) throw err;

            var currentStock;
            //loop through to get the current stock of the select product
            for (var i = 0; i < res.length; i++) {
              currentStock = res[i].stock_quantity;

              //adding current stock to the amount of inventory added from manger
              var updatedInventory =
                parseInt(currentStock) + parseInt(answer.amountAdding);
              //update database with the new inventory
              connection.query('UPDATE products SET ? WHERE?', [
                {
                  stock_quantity: updatedInventory
                },
                {
                  item_id: answer.itemID
                }
              ]);
            }

            console.log(
              chalk
                .rgb(81, 215, 66)
                .bold(
                  '============= TRANSACTION COMPLETED. NEW INVENTORY ADDED SUCCESSFULLY. ============'
                )
            );
            //query to database to get the new update inventory and display it to manger
            connection.query(
              'SELECT * FROM products WHERE item_id=?',
              answer.itemID,
              function(err, res) {
                if (err) throw err;
                var newInventory = new Table({
                  head: [
                    chalk.blue.bold.underline('Item ID'),
                    chalk.green.bold.underline('Product Name'),
                    chalk.yellow.bold.underline('Department'),
                    chalk.cyan.bold.underline('Price'),
                    chalk.red.bold.underline('Quantity Available')
                  ],
                  colWidths: [10, 45, 20, 10, 40]
                });
                for (var i = 0; i < res.length; i++) {
                  newInventory.push([
                    chalk.blue.bold(answer.itemID),
                    chalk.green.bold(res[i].product_name),
                    chalk.yellow.bold(res[i].department_name),
                    chalk.cyan.bold(res[i].price),
                    chalk.red.bold(res[i].stock_quantity)
                  ]);
                }
                console.log(newInventory.toString());
                start();
              }
            );
          }
        );
      });
  });
}

function addNewProduct() {
  console.log(
    chalk.magenta.bold(
      '============= BAMAZON ADDING A NEW PRODUCT ============'
    )
  );
  //prompt manger for new product name, department, price and stock quantity
  inquirer
    .prompt([
      {
        name: 'productName',
        type: 'input',
        message: chalk.green.bold(
          'What is the name of the product you would like to add?'
        )
      },
      {
        name: 'departmentName',
        type: 'input',
        message: chalk.yellow.bold(
          'Which departement would you like to add this product to?'
        )
      },
      {
        name: 'price',
        type: 'input',
        message: chalk.cyan.bold('What is the price for this product?'),
        validate: function(value) {
          return isNaN(value) === false ? true : false;
        }
      },
      {
        name: 'stockQTY',
        type: 'input',
        message: chalk.red.bold('What is the stock quantity?'),
        validate: function(value) {
          return isNaN(value) === false ? true : false;
        }
      }
    ])
    .then(function(answer) {
      //query database to insert new product into database
      connection.query(
        'INSERT INTO products SET ?',
        {
          product_name: answer.productName,
          department_name: answer.departmentName,
          price: answer.price,
          stock_quantity: answer.stockQTY
        },
        function(err, res) {
          if (err) throw err;
        }
      );

      console.log(
        chalk
          .rgb(81, 215, 66)
          .bold(
            '============= TRANSACTION COMPLETED. NEW PRODUCT ADDED SUCCESSFULLY. ============'
          )
      );
      //query to database to display all product including the new product that was added
      connection.query('SELECT * FROM products', function(err, res) {
        if (err) throw err;
        var newProduct = new Table({
          head: [
            chalk.blue.bold.underline('Item ID'),
            chalk.green.bold.underline('Product Name'),
            chalk.yellow.bold.underline('Department'),
            chalk.cyan.bold.underline('Price'),
            chalk.red.bold.underline('Stock Quantity')
          ],
          colWidths: [10, 45, 20, 10, 30]
        });
        for (var i = 0; i < res.length; i++) {
          newProduct.push([
            chalk.blue.bold(res[i].item_id),
            chalk.green.bold(res[i].product_name),
            chalk.yellow.bold(res[i].department_name),
            chalk.cyan.bold(res[i].price),
            chalk.red.bold(res[i].stock_quantity)
          ]);
        }
        console.log(newProduct.toString());
        start();
      });
    });
}

function exit() {
  console.log(
    chalk
      .rgb(81, 215, 66)
      .bold(
        '============= THANK YOU. YOU HAVE EXITED BAMAZON INVENTORY CONTROL. ============'
      )
  );
  //end connection
  connection.end();
}
