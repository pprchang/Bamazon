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

//display id, name & price of products
//prompt user to see if user want to purchase an item
function start() {
  connection.query('SELECT * FROM products', function(err, res) {
    if (err) throw err;

    //creating a new table to display products info
    var productsInfo = new Table({
      head: [
        chalk.blue.bold.underline('Item ID'),
        chalk.green.bold.underline('Product Name'),
        chalk.yellow.bold.underline('Department'),
        chalk.cyan.bold.underline('Price')
      ],
      colWidths: [10, 45, 20, 10]
    });
    //loop through product database and push data from database into the new table
    for (var i = 0; i < res.length; i++) {
      productsInfo.push([
        chalk.blue.bold(res[i].item_id),
        chalk.green.bold(res[i].product_name),
        chalk.yellow.bold(res[i].department_name),
        chalk.cyan.bold(res[i].price)
      ]);
    }
    console.log(productsInfo.toString());
    console.log(
      chalk.magenta.bold(
        '--~~~--~~~--~~~--~~~  WELCOME TO BAMAZON  ~~~--~~~--~~~--~~~--'
      )
    );
    //prompt user to see if user wants to purchas an item
    inquirer
      .prompt([
        {
          name: 'intro',
          type: 'confirm',
          message: chalk.green.bold('Would you like to purchase an item?'),
          default: true
        }
      ])
      .then(function(answer) {
        //if user answer yes then call the userInput function
        answer.intro === true ? userInput() : inputNo();

        function inputNo() {
          console.log(chalk.cyan.bold('Thank you. Come again.'));
          connection.end();
        }
      });
  });
}

function userInput() {
  //prompt user to select Item ID and purchase quantity
  inquirer
    .prompt([
      {
        name: 'itemID',
        type: 'input',
        message:
          chalk.white.bold(
            'What product would you like to purchase? Please enter the '
          ) +
          chalk.blue.bold('Item ID') +
          chalk.white.bold('.'),
        validate: function(value) {
          return isNaN(value) === false ? true : false;
        }
      },
      {
        name: 'purchaseQTY',
        type: 'input',
        message: chalk.rgb(129, 227, 238).bold('How many do you want?'),
        validate: function(value) {
          return isNaN(value) === false ? true : false;
        }
      }
    ])
    .then(function(answer) {
      connection.query(
        //select all info from product database where item_id is equal to the item id the user selected
        'SELECT * FROM products WHERE item_id=?',
        answer.itemID,
        function(err, res) {
          if (err) throw err;
          //loop through products database and compare user input quantity with stock quantity
          for (var i = 0; i < res.length; i++) {
            if (answer.purchaseQTY > res[i].stock_quantity) {
              console.log(
                `${chalk.red.bold(
                  '--~~~--~~~--~~~--~~~--~~~--~~~--~~~--~~~'
                )} \n ${chalk.red.bold(
                  'Sorry. Not enough in stock.'
                )} \n ${chalk.red.bold(
                  '--~~~--~~~--~~~--~~~--~~~--~~~--~~~--~~~'
                )}`
              );

              // creating a new table to display the item the user choose with the availabe stock quantity
              var qtyInfo = new Table({
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
                qtyInfo.push([
                  chalk.blue.bold.underline(answer.itemID),
                  chalk.green.bold.underline(res[i].product_name),
                  chalk.yellow.bold.underline(res[i].department_name),
                  chalk.cyan.bold.underline(res[i].price),
                  chalk.red.bold.underline(res[i].stock_quantity)
                ]);
              }
              console.log(qtyInfo.toString());
              //display the user's quantity
              console.log(
                `${chalk.red.bold(
                  '--~~~--~~~--~~~--~~~--~~~--~~~--~~~--~~~'
                )} \n You want ${chalk.green.bold(
                  answer.purchaseQTY
                )} \n --~~~--~~~--~~~--~~~--~~~--~~~--~~~--~~~`
              );

              //prompt user to see if user want to adjust the user quantity after seeing the available stock quantity
              inquirer
                .prompt([
                  {
                    name: 'adjustQTY',
                    type: 'confirm',
                    message: chalk.green.bold(
                      'Would you like to change your quantity?'
                    ),
                    default: true
                  }
                ])
                .then(function(answer) {
                  //if user want to adjust quantity the call userInput function to allow user to place a new order
                  answer.adjustQTY === true ? userInput() : start();
                });
            } else {
              //display user purchase order when stock is available
              console.log(
                `${chalk.red.bold(
                  '~~~--~~~--~~~--~~~--~~~--~~~--~~~--~~~'
                )} \n ${chalk.green.bold(
                  'You have selected:'
                )} \n --~~~--~~~--~~~--~~~--~~~--~~~--~~~--~~~ \n ${chalk.blue.bold(
                  'Item: ' + res[i].product_name
                )} \n ${chalk.yellow.bold(
                  'Department: ' + res[i].department_name
                )} \n ${chalk.cyan.bold(
                  'Price: ' + res[i].price
                )} \n ${chalk.white.bold(
                  'Quantity: ' + answer.purchaseQTY
                )} \n --~~~--~~~--~~~--~~~--~~~--~~~--~~~--~~~ \n ${chalk.green.bold(
                  'Total: ' + res[i].price * answer.purchaseQTY
                )} \n ${chalk.red.bold(
                  '--~~~--~~~--~~~--~~~--~~~--~~~--~~~--~~~'
                )}`
              );

              //var to store new stock
              var newStock = res[i].stock_quantity - answer.purchaseQTY;
              var purchaseItem = answer.itemID;
              confirmation(newStock, purchaseItem);
            }
          }
        }
      );
    });

  function confirmation(newStock, purchaseItem) {
    //prompt user to confirm user purchase
    inquirer
      .prompt([
        {
          type: 'confirm',
          name: 'confrimPurchase',
          message: chalk.cyan.bold(
            'Are you sure you would like to purchase this item and quantity?'
          ),
          default: true
        }
      ])
      .then(function(userConfirm) {
        if (userConfirm.confrimPurchase === true) {
          //update products database once user confirm purchase
          connection.query('UPDATE products SET ? WHERE ?', [
            { stock_quantity: newStock },
            { item_id: purchaseItem }
          ]);
          console.log(
            `${chalk.green.bold(
              '--~~~--~~~--~~~--~~~--~~~--~~~--~~~--~~~'
            )} \n ${chalk.green.bold(
              'Your transaction is complete. Thank you.'
            )} \n ${chalk.green.bold(
              '--~~~--~~~--~~~--~~~--~~~--~~~--~~~--~~~'
            )}`
          );
          start();
        } else {
          //if user did not confirm purchase, let user know user transaction was cancelled then call start function to see if user wants to purchas another item
          console.log(
            `${chalk.red.bold(
              '--~~~--~~~--~~~--~~~--~~~--~~~--~~~--~~~'
            )} \n ${chalk.red.bold(
              'Your transaction was cancelled.  Thank you.'
            )} \n --~~~--~~~--~~~--~~~--~~~--~~~--~~~--~~~`
          );

          start();
        }
      });
  }
}
