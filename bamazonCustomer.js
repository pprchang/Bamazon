const mysql = require('mysql');
const inquirer = require('inquirer');
const chalk = require('chalk');
const Table = require('cli-table');

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
function start() {
  connection.query('SELECT * FROM Products', function(err, res) {
    if (err) throw err;

    var productsInfo = new Table({
      head: [
        chalk.blue.bold.underline('Item ID'),
        chalk.green.bold.underline('Product Name'),
        chalk.yellow.bold.underline('Department'),
        chalk.cyan.bold.underline('Price')
      ],
      colWidths: [10, 45, 20, 10]
    });
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
        if (answer.intro === true) {
          userInput();
        } else {
          console.log(chalk.cyan.bold('Thank you. Come again.'));
          connection.end();
        }
      });
  });
}

function userInput() {
  inquirer
    .prompt([
      {
        name: 'itemID',
        type: 'input',
        message: chalk.white.bold(
          'What product would you like to purchase? Please enter the item ID.'
        ),
        validate: function(value) {
          if (isNaN(value) === false) {
            return true;
          } else {
            return false;
          }
        }
      },
      {
        name: 'purchaseQTY',
        type: 'input',
        message: chalk.yellow.bold('How many do you want?'),
        validate: function(value) {
          if (isNaN(value) === false) {
            return true;
          } else {
            return false;
          }
        }
      }
    ])
    .then(function(answer) {
      connection.query(
        'SELECT * FROM products WHERE item_id=?',
        answer.itemID,
        function(err, res) {
          if (err) throw err;
          for (var i = 0; i < res.length; i++) {
            if (answer.purchaseQTY > res[i].stock_quantity) {
              console.log(chalk.red.bold('Sorry! Not enough in stock.'));
            } else {
              console.log(chalk.green.bold('You have selected:'));
              console.log(chalk.gray.bold('--~~~--~~~--~~~--~~~'));
              console.log(chalk.blue.bold('Item: ' + res[i].product_name));
              console.log(
                chalk.yellow.bold('Department: ' + res[i].department_name)
              );
              console.log(chalk.cyan.bold('Price: ' + res[i].price));
              console.log(chalk.white.bold('Quantity: ' + answer.purchaseQTY));
              console.log(chalk.gray.bold('--~~~--~~~--~~~--~~~'));
              console.log(
                chalk.green.bold('Total: ' + res[i].price * answer.purchaseQTY)
              );
              console.log(chalk.gray.bold('--~~~--~~~--~~~--~~~'));

              var newStock = res[i].stock_quantity - answer.purchaseQTY;
              var purchaseItem = answer.itemID;
              confirmation(newStock, purchaseItem);
            }
          }
        }
      );
    });

  function confirmation(newStock, purchaseItem) {
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
          connection.query('UPDATE products SET ? WHERE ?', [
            { stock_quantity: newStock },
            { item_id: purchaseItem }
          ]);
          console.log(
            chalk.green.bold('Your transaction is completed. Thank you.')
          );
          start();
        } else {
          console.log(
            chalk.red.bold('Your transaction was cancelled.  Thank you.')
          );
          start();
        }
      });
  }
}

//first message: ask ID of what item they want to buy
//second message: ask how many units of the product they would like to buy
//once order placed check to see if store has enough of the products
//if not: apps log "INSUFFICIENT QUANTITY!" and prevent the order from going through
//if store does have enough product:  update SQL database to relfect the remaining quantity
//Show customer total cost of their purchase
