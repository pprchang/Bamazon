# Bamazon
Bamazon is an Amazon-like storefront. The app will take in orders from customers and deplete stock from the store's inventory.  The app will also allow the user to check for which inventories is low, add inventories and add new products.

## *Built With*

#### Code Editor : 
- Visual Stuido Code (https://code.visualstudio.com/)

#### Javascript :

#### Node.js (https://nodejs.org/en/):

#### NPM (https://www.npmjs.com/):
- MySQL (https://www.npmjs.com/package/mysql)
- Inquirer (https://www.npmjs.com/package/inquirer)
- Chalk (https://www.npmjs.com/package/chalk)
- CLI-Table (https://www.npmjs.com/package/cli-table)

## *Customer Module*
To run the customer module in terminal:
```
node bamazonCustomer.js
```
The customer module allows the customer to:
1. select an item that the customer wants to purchase from the inventory table by entering in the Item ID,
2. enter how many units of the selected item the customer wants to purchase,
3. confirm the customer's purchase order if the stock is available however if stock is not available it will allow the customer to change the customer's purchase quantity.

#### Starting Database :
![Image of startingDatabase](https://github.com/pprchang/Bamazon/blob/master/img/startingDatabase.PNG)

#### Purchase Transaction :
![Image of customerStep1](https://github.com/pprchang/Bamazon/blob/master/img/customerStep1.PNG)

#### Updated Database After Purchase Transaction :
![Image of step1Database](https://github.com/pprchang/Bamazon/blob/master/img/customerStep1Database.PNG)

#### Transaction Where There Is NOT Enough In Stock :
![Image of customerStep2](https://github.com/pprchang/Bamazon/blob/master/img/customerStep2.PNG)

#### Updated Database After Purchase Transaction :
![Image of step2Database](https://github.com/pprchang/Bamazon/blob/master/img/customerStep2Database.PNG)

## *Manger Module* 
To run the customer module in terminal:
```
node bamazonManger.js
```
The manger module allows the manger to:
1. view the inventory,
2. view which product(s) is low ,
3. add units to product,
4. add new products to inventory.

#### Manger Options :
![Image of MangerOption](https://github.com/pprchang/Bamazon/blob/master/img/MangerOption.PNG)

#### View Inventory :
![Image of ViewInventory](https://github.com/pprchang/Bamazon/blob/master/img/viewInventory.PNG)

#### View Low Product(s) :
![Image of ViewLowProducts](https://github.com/pprchang/Bamazon/blob/master/img/lowInventory.PNG)

#### Add Units To Product:
![Image of AddToProduct](https://github.com/pprchang/Bamazon/blob/master/img/addInventory.PNG)

#### Updated Database After Units Are Added :
![Image of updatedDatabase](https://github.com/pprchang/Bamazon/blob/master/img/addInventoryDatabase.PNG)

#### Add New Product to Inventory:
![Image of AddNewProduct](https://github.com/pprchang/Bamazon/blob/master/img/addProduct.PNG)

#### Updated Database After New Product Is Added To Inventory :
![Image of updatedDatabase](https://github.com/pprchang/Bamazon/blob/master/img/addProductDatabase.PNG)

## *Contributing* 
When contributing to this repository, please first discuss the change you wish to make via issue, email, or any other method with the owners of this repository before making a change.  Thank you for your corporation.
