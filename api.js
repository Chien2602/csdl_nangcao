const express = require('express');
const sql = require('mssql/msnodesqlv8');
const bodyParser = require('body-parser');
require('dotenv').config();
const app = express();
const port = 3000;

app.use(bodyParser.json());

const config = {
    server: process.env.DB_SERVER,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    driver: process.env.DB_DRIVER
};

const conn = new sql.ConnectionPool(config);
console.log('Config:', config);
conn.connect()
    .then(() => {
        console.log("Connected to the database!");
    })
    .catch(err => {
        console.error("Database connection failed: ", err);
    });




// USERS APIs
app.get('/users', async (req, res) => {
    try {
        const result = await conn.request().query('SELECT * FROM USERS');
        res.status(200).json(result.recordset);
    } catch (err) {
        console.error("Error retrieving users: ", err);
        res.status(500).send("Error retrieving users.");
    }
});

app.post('/users', async (req, res) => {
    const { UserID, Username, Password, Email, FullName, PhoneNumber, Ward, District, City, Role } = req.body;

    const query = `INSERT INTO USERS (UserID, Username, Password, Email, FullName, PhoneNumber, Ward, District, City, Role) 
                   VALUES (@UserID, @Username, @Password, @Email, @FullName, @PhoneNumber, @Ward, @District, @City, @Role)`;
    try {
        await conn.request()
            .input('UserID', sql.NVarChar, UserID)
            .input('Username', sql.VarChar, Username)
            .input('Password', sql.VarChar, Password)
            .input('Email', sql.VarChar, Email)
            .input('FullName', sql.NVarChar, FullName)
            .input('PhoneNumber', sql.VarChar, PhoneNumber)
            .input('Ward', sql.NVarChar, Ward)
            .input('District', sql.NVarChar, District)
            .input('City', sql.NVarChar, City)
            .input('Role', sql.VarChar, Role)
            .query(query);
        res.status(201).send("New user added.");
    } catch (err) {
        console.error("Error adding new user: ", err);
        res.status(500).send("Error adding new user.");
    }
});

app.put('/users/:id', async (req, res) => {
    const id = req.params.id;
    const { Username, Password, Email, FullName, PhoneNumber, Ward, District, City, Role } = req.body;

    const query = `UPDATE USERS SET 
                   Username = @Username, 
                   Password = @Password,
                   Email = @Email,
                   FullName = @FullName,
                   PhoneNumber = @PhoneNumber,
                   Ward = @Ward,
                   District = @District,
                   City = @City,
                   Role = @Role 
                   WHERE UserID = @UserID`;

    try {
        await conn.request()
            .input('UserID', sql.NVarChar, id)
            .input('Username', sql.VarChar, Username)
            .input('Password', sql.VarChar, Password)
            .input('Email', sql.VarChar, Email)
            .input('FullName', sql.NVarChar, FullName)
            .input('PhoneNumber', sql.VarChar, PhoneNumber)
            .input('Ward', sql.NVarChar, Ward)
            .input('District', sql.NVarChar, District)
            .input('City', sql.NVarChar, City)
            .input('Role', sql.VarChar, Role)
            .query(query);
        res.status(200).send(`User with ID ${id} updated.`);
    } catch (err) {
        console.error("Error updating user: ", err);
        res.status(500).send("Error updating user.");
    }
});

app.delete('/users/:id', async (req, res) => {
    const id = req.params.id;

    try {
        await conn.request()
            .input('UserID', sql.NVarChar, id)
            .query('DELETE FROM USERS WHERE UserID = @UserID');
        res.status(200).send(`User with ID ${id} deleted.`);
    } catch (err) {
        console.error("Error deleting user: ", err);
        res.status(500).send("Error deleting user.");
    }
});

// ADMIN APIs
app.get('/admins', async (req, res) => {
    try {
        const result = await conn.request().query('SELECT * FROM ADMIN');
        res.status(200).json(result.recordset);
    } catch (err) {
        console.error("Error retrieving admins: ", err);
        res.status(500).send("Error retrieving admins.");
    }
});

app.post('/admins', async (req, res) => {
    const { AdminID, DayofBirth } = req.body;

    const query = `INSERT INTO ADMIN (AdminID, DayofBirth) VALUES (@AdminID, @DayofBirth)`;
    try {
        await conn.request()
            .input('AdminID', sql.NVarChar, AdminID)
            .input('DayofBirth', sql.Date, DayofBirth)
            .query(query);
        res.status(201).send("New admin added.");
    } catch (err) {
        console.error("Error adding new admin: ", err);
        res.status(500).send("Error adding new admin.");
    }
});

app.put('/admins/:id', async (req, res) => {
    const id = req.params.id;
    const { DayofBirth } = req.body;

    const query = `UPDATE ADMIN SET DayofBirth = @DayofBirth WHERE AdminID = @AdminID`;
    try {
        await conn.request()
            .input('AdminID', sql.NVarChar, id)
            .input('DayofBirth', sql.Date, DayofBirth)
            .query(query);
        res.status(200).send(`Admin with ID ${id} updated.`);
    } catch (err) {
        console.error("Error updating admin: ", err);
        res.status(500).send("Error updating admin.");
    }
});

app.delete('/admins/:id', async (req, res) => {
    const id = req.params.id;

    try {
        await conn.request()
            .input('AdminID', sql.NVarChar, id)
            .query('DELETE FROM ADMIN WHERE AdminID = @AdminID');
        res.status(200).send(`Admin with ID ${id} deleted.`);
    } catch (err) {
        console.error("Error deleting admin: ", err);
        res.status(500).send("Error deleting admin.");
    }
});

// EMPLOYEE APIs
app.get('/employees', async (req, res) => {
    try {
        const result = await conn.request().query('SELECT * FROM EMPLOYEE');
        res.status(200).json(result.recordset);
    } catch (err) {
        console.error("Error retrieving employees: ", err);
        res.status(500).send("Error retrieving employees.");
    }
});

app.post('/employees', async (req, res) => {
    const { EmployeeID, Salary, DayofBirth } = req.body;

    const query = `INSERT INTO EMPLOYEE (EmployeeID, Salary, DayofBirth) VALUES (@EmployeeID, @Salary, @DayofBirth)`;
    try {
        await conn.request()
            .input('EmployeeID', sql.NVarChar, EmployeeID)
            .input('Salary', sql.Decimal(18, 2), Salary)
            .input('DayofBirth', sql.Date, DayofBirth)
            .query(query);
        res.status(201).send("New employee added.");
    } catch (err) {
        console.error("Error adding new employee: ", err);
        res.status(500).send("Error adding new employee.");
    }
});

app.put('/employees/:id', async (req, res) => {
    const id = req.params.id;
    const { Salary, DayofBirth } = req.body;

    const query = `UPDATE EMPLOYEE SET Salary = @Salary, DayofBirth = @DayofBirth WHERE EmployeeID = @EmployeeID`;
    try {
        await conn.request()
            .input('EmployeeID', sql.NVarChar, id)
            .input('Salary', sql.Decimal(18, 2), Salary)
            .input('DayofBirth', sql.Date, DayofBirth)
            .query(query);
        res.status(200).send(`Employee with ID ${id} updated.`);
    } catch (err) {
        console.error("Error updating employee: ", err);
        res.status(500).send("Error updating employee.");
    }
});

app.delete('/employees/:id', async (req, res) => {
    const id = req.params.id;

    try {
        await conn.request()
            .input('EmployeeID', sql.NVarChar, id)
            .query('DELETE FROM EMPLOYEE WHERE EmployeeID = @EmployeeID');
        res.status(200).send(`Employee with ID ${id} deleted.`);
    } catch (err) {
        console.error("Error deleting employee: ", err);
        res.status(500).send("Error deleting employee.");
    }
});

// CUSTOMER APIs
app.get('/customers', async (req, res) => {
    try {
        const result = await conn.request().query('SELECT * FROM CUSTOMER');
        res.status(200).json(result.recordset);
    } catch (err) {
        console.error("Error retrieving customers: ", err);
        res.status(500).send("Error retrieving customers.");
    }
});

app.post('/customers', async (req, res) => {
    const { CustomerID, DayofBirth } = req.body;

    const query = `INSERT INTO CUSTOMER (CustomerID, DayofBirth) VALUES (@CustomerID, @DayofBirth)`;
    try {
        await conn.request()
            .input('CustomerID', sql.NVarChar, CustomerID)
            .input('DayofBirth', sql.Date, DayofBirth)
            .query(query);
        res.status(201).send("New customer added.");
    } catch (err) {
        console.error("Error adding new customer: ", err);
        res.status(500).send("Error adding new customer.");
    }
});

app.put('/customers/:id', async (req, res) => {
    const id = req.params.id;
    const { DayofBirth } = req.body;

    const query = `UPDATE CUSTOMER SET DayofBirth = @DayofBirth WHERE CustomerID = @CustomerID`;
    try {
        await conn.request()
            .input('CustomerID', sql.NVarChar, id)
            .input('DayofBirth', sql.Date, DayofBirth)
            .query(query);
        res.status(200).send(`Customer with ID ${id} updated.`);
    } catch (err) {
        console.error("Error updating customer: ", err);
        res.status(500).send("Error updating customer.");
    }
});

app.delete('/customers/:id', async (req, res) => {
    const id = req.params.id;

    try {
        await conn.request()
            .input('CustomerID', sql.NVarChar, id)
            .query('DELETE FROM CUSTOMER WHERE CustomerID = @CustomerID');
        res.status(200).send(`Customer with ID ${id} deleted.`);
    } catch (err) {
        console.error("Error deleting customer: ", err);
        res.status(500).send("Error deleting customer.");
    }
});

// PRODUCT APIs
app.get('/products', async (req, res) => {
    try {
        const result = await conn.request().query('SELECT * FROM PRODUCT');
        res.status(200).json(result.recordset);
    } catch (err) {
        console.error("Error retrieving products: ", err);
        res.status(500).send("Error retrieving products.");
    }
});

app.post('/products', async (req, res) => {
    const { ProductID, ProductName, Price, StockQuantity } = req.body;

    const query = `INSERT INTO PRODUCT (ProductID, ProductName, Price, StockQuantity) 
                   VALUES (@ProductID, @ProductName, @Price, @StockQuantity)`;
    try {
        await conn.request()
            .input('ProductID', sql.NVarChar, ProductID)
            .input('ProductName', sql.NVarChar, ProductName)
            .input('Price', sql.Decimal(18, 2), Price)
            .input('StockQuantity', sql.Int, StockQuantity)
            .query(query);
        res.status(201).send("New product added.");
    } catch (err) {
        console.error("Error adding new product: ", err);
        res.status(500).send("Error adding new product.");
    }
});

app.put('/products/:id', async (req, res) => {
    const id = req.params.id;
    const { ProductName, Price, StockQuantity } = req.body;

    const query = `UPDATE PRODUCT SET 
                   ProductName = @ProductName, 
                   Price = @Price, 
                   StockQuantity = @StockQuantity 
                   WHERE ProductID = @ProductID`;

    try {
        await conn.request()
            .input('ProductID', sql.NVarChar, id)
            .input('ProductName', sql.NVarChar, ProductName)
            .input('Price', sql.Decimal(18, 2), Price)
            .input('StockQuantity', sql.Int, StockQuantity)
            .query(query);
        res.status(200).send(`Product with ID ${id} updated.`);
    } catch (err) {
        console.error("Error updating product: ", err);
        res.status(500).send("Error updating product.");
    }
});

app.delete('/products/:id', async (req, res) => {
    const id = req.params.id;

    try {
        await conn.request()
            .input('ProductID', sql.NVarChar, id)
            .query('DELETE FROM PRODUCT WHERE ProductID = @ProductID');
        res.status(200).send(`Product with ID ${id} deleted.`);
    } catch (err) {
        console.error("Error deleting product: ", err);
        res.status(500).send("Error deleting product.");
    }
});

// PRODUCT_INFO APIs
app.get('/product-info', async (req, res) => {
    try {
        const result = await conn.request().query('SELECT * FROM PRODUCT_INFO');
        res.status(200).json(result.recordset);
    } catch (err) {
        console.error("Error retrieving product info: ", err);
        res.status(500).send("Error retrieving product info.");
    }
});

app.post('/product-info', async (req, res) => {
    const { ProductID, Quantity, Color, Size } = req.body;

    const query = `INSERT INTO PRODUCT_INFO (ProductID, Quantity, Color, Size) 
                   VALUES (@ProductID, @Quantity, @Color, @Size)`;
    try {
        await conn.request()
            .input('ProductID', sql.NVarChar, ProductID)
            .input('Quantity', sql.Int, Quantity)
            .input('Color', sql.NVarChar, Color)
            .input('Size', sql.NVarChar, Size)
            .query(query);
        res.status(201).send("New product info added.");
    } catch (err) {
        console.error("Error adding new product info: ", err);
        res.status(500).send("Error adding new product info.");
    }
});

app.put('/product-info/:id', async (req, res) => {
    const id = req.params.id;
    const { Quantity, Color, Size } = req.body;

    const query = `UPDATE PRODUCT_INFO SET 
                   Quantity = @Quantity, 
                   Color = @Color, 
                   Size = @Size 
                   WHERE ProductID = @ProductID`;

    try {
        await conn.request()
            .input('ProductID', sql.NVarChar, id)
            .input('Quantity', sql.Int, Quantity)
            .input('Color', sql.NVarChar, Color)
            .input('Size', sql.NVarChar, Size)
            .query(query);
        res.status(200).send(`Product info with ID ${id} updated.`);
    } catch (err) {
        console.error("Error updating product info: ", err);
        res.status(500).send("Error updating product info.");
    }
});

app.delete('/product-info/:id', async (req, res) => {
    const id = req.params.id;

    try {
        await conn.request()
            .input('ProductID', sql.NVarChar, id)
            .query('DELETE FROM PRODUCT_INFO WHERE ProductID = @ProductID');
        res.status(200).send(`Product info with ID ${id} deleted.`);
    } catch (err) {
        console.error("Error deleting product info: ", err);
        res.status(500).send("Error deleting product info.");
    }
});

// ORDER APIs
app.get('/orders', async (req, res) => {
    try {
        const result = await conn.request().query('SELECT * FROM [ORDER]');
        res.status(200).json(result.recordset);
    } catch (err) {
        console.error("Error retrieving orders: ", err);
        res.status(500).send("Error retrieving orders.");
    }
});

app.post('/orders', async (req, res) => {
    const { OrderID, CustomerID, TotalAmount, Status } = req.body;

    const query = `INSERT INTO [ORDER] (OrderID, CustomerID, TotalAmount, Status) 
                   VALUES (@OrderID, @CustomerID, @TotalAmount, @Status)`;
    try {
        await conn.request()
            .input('OrderID', sql.NVarChar, OrderID)
            .input('CustomerID', sql.NVarChar, CustomerID)
            .input('TotalAmount', sql.Decimal(18, 2), TotalAmount)
            .input('Status', sql.NVarChar, Status)
            .query(query);
        res.status(201).send("New order added.");
    } catch (err) {
        console.error("Error adding new order: ", err);
        res.status(500).send("Error adding new order.");
    }
});

app.put('/orders/:id', async (req, res) => {
    const id = req.params.id;
    const { CustomerID, TotalAmount, Status } = req.body;

    const query = `UPDATE [ORDER] SET 
                   CustomerID = @CustomerID, 
                   TotalAmount = @TotalAmount, 
                   Status = @Status 
                   WHERE OrderID = @OrderID`;

    try {
        await conn.request()
            .input('OrderID', sql.NVarChar, id)
            .input('CustomerID', sql.NVarChar, CustomerID)
            .input('TotalAmount', sql.Decimal(18, 2), TotalAmount)
            .input('Status', sql.NVarChar, Status)
            .query(query);
        res.status(200).send(`Order with ID ${id} updated.`);
    } catch (err) {
        console.error("Error updating order: ", err);
        res.status(500).send("Error updating order.");
    }
});

app.delete('/orders/:id', async (req, res) => {
    const id = req.params.id;

    try {
        await conn.request()
            .input('OrderID', sql.NVarChar, id)
            .query('DELETE FROM [ORDER] WHERE OrderID = @OrderID');
        res.status(200).send(`Order with ID ${id} deleted.`);
    } catch (err) {
        console.error("Error deleting order: ", err);
        res.status(500).send("Error deleting order.");
    }
});

// ORDER_ITEM APIs
app.get('/order-items', async (req, res) => {
    try {
        const result = await conn.request().query('SELECT * FROM ORDER_ITEM');
        res.status(200).json(result.recordset);
    } catch (err) {
        console.error("Error retrieving order items: ", err);
        res.status(500).send("Error retrieving order items.");
    }
});

app.post('/order-items', async (req, res) => {
    const { OrderItemID, OrderID, ProductID, Quantity, Price } = req.body;

    const query = `INSERT INTO ORDER_ITEM (OrderItemID, OrderID, ProductID, Quantity, Price) 
                   VALUES (@OrderItemID, @OrderID, @ProductID, @Quantity, @Price)`;
    try {
        await conn.request()
            .input('OrderItemID', sql.NVarChar, OrderItemID)
            .input('OrderID', sql.NVarChar, OrderID)
            .input('ProductID', sql.NVarChar, ProductID)
            .input('Quantity', sql.Int, Quantity)
            .input('Price', sql.Decimal(18, 2), Price)
            .query(query);
        res.status(201).send("New order item added.");
    } catch (err) {
        console.error("Error adding new order item: ", err);
        res.status(500).send("Error adding new order item.");
    }
});

app.put('/order-items/:id', async (req, res) => {
    const id = req.params.id;
    const { OrderID, ProductID, Quantity, Price } = req.body;

    const query = `UPDATE ORDER_ITEM SET 
                   OrderID = @OrderID, 
                   ProductID = @ProductID, 
                   Quantity = @Quantity, 
                   Price = @Price 
                   WHERE OrderItemID = @OrderItemID`;

    try {
        await conn.request()
            .input('OrderItemID', sql.NVarChar, id)
            .input('OrderID', sql.NVarChar, OrderID)
            .input('ProductID', sql.NVarChar, ProductID)
            .input('Quantity', sql.Int, Quantity)
            .input('Price', sql.Decimal(18, 2), Price)
            .query(query);
        res.status(200).send(`Order item with ID ${id} updated.`);
    } catch (err) {
        console.error("Error updating order item: ", err);
        res.status(500).send("Error updating order item.");
    }
});

app.delete('/order-items/:id', async (req, res) => {
    const id = req.params.id;

    try {
        await conn.request()
            .input('OrderItemID', sql.NVarChar, id)
            .query('DELETE FROM ORDER_ITEM WHERE OrderItemID = @OrderItemID');
        res.status(200).send(`Order item with ID ${id} deleted.`);
    } catch (err) {
        console.error("Error deleting order item: ", err);
        res.status(500).send("Error deleting order item.");
    }
});

// INVENTORY APIs
app.get('/inventories', async (req, res) => {
    try {
        const result = await conn.request().query('SELECT * FROM INVENTORY');
        res.status(200).json(result.recordset);
    } catch (err) {
        console.error("Error retrieving inventories: ", err);
        res.status(500).send("Error retrieving inventories.");
    }
});

app.post('/inventories', async (req, res) => {
    const { InventoryID, ProductID, Quantity } = req.body;

    const query = `INSERT INTO INVENTORY (InventoryID, ProductID, Quantity) 
                   VALUES (@InventoryID, @ProductID, @Quantity)`;
    try {
        await conn.request()
            .input('InventoryID', sql.NVarChar, InventoryID)
            .input('ProductID', sql.NVarChar, ProductID)
            .input('Quantity', sql.Int, Quantity)
            .query(query);
        res.status(201).send("New inventory added.");
    } catch (err) {
        console.error("Error adding new inventory: ", err);
        res.status(500).send("Error adding new inventory.");
    }
});

app.put('/inventories/:id', async (req, res) => {
    const id = req.params.id;
    const { ProductID, Quantity } = req.body;

    const query = `UPDATE INVENTORY SET 
                   ProductID = @ProductID, 
                   Quantity = @Quantity 
                   WHERE InventoryID = @InventoryID`;

    try {
        await conn.request()
            .input('InventoryID', sql.NVarChar, id)
            .input('ProductID', sql.NVarChar, ProductID)
            .input('Quantity', sql.Int, Quantity)
            .query(query);
        res.status(200).send(`Inventory with ID ${id} updated.`);
    } catch (err) {
        console.error("Error updating inventory: ", err);
        res.status(500).send("Error updating inventory.");
    }
});

app.delete('/inventories/:id', async (req, res) => {
    const id = req.params.id;

    try {
        await conn.request()
            .input('InventoryID', sql.NVarChar, id)
            .query('DELETE FROM INVENTORY WHERE InventoryID = @InventoryID');
        res.status(200).send(`Inventory with ID ${id} deleted.`);
    } catch (err) {
        console.error("Error deleting inventory: ", err);
        res.status(500).send("Error deleting inventory.");
    }
});

// SUPPLIER APIs
app.get('/suppliers', async (req, res) => {
    try {
        const result = await conn.request().query('SELECT * FROM SUPPLIER');
        res.status(200).json(result.recordset);
    } catch (err) {
        console.error("Error retrieving suppliers: ", err);
        res.status(500).send("Error retrieving suppliers.");
    }
});

app.post('/suppliers', async (req, res) => {
    const { SupplierID, SupplierName, ContactName, Address } = req.body;

    const query = `INSERT INTO SUPPLIER (SupplierID, SupplierName, ContactName, Address) 
                   VALUES (@SupplierID, @SupplierName, @ContactName, @Address)`;
    try {
        await conn.request()
            .input('SupplierID', sql.NVarChar, SupplierID)
            .input('SupplierName', sql.NVarChar, SupplierName)
            .input('ContactName', sql.NVarChar, ContactName)
            .input('Address', sql.NVarChar, Address)
            .query(query);
        res.status(201).send("New supplier added.");
    } catch (err) {
        console.error("Error adding new supplier: ", err);
        res.status(500).send("Error adding new supplier.");
    }
});

app.put('/suppliers/:id', async (req, res) => {
    const id = req.params.id;
    const { SupplierName, ContactName, Address } = req.body;

    const query = `UPDATE SUPPLIER SET 
                   SupplierName = @SupplierName, 
                   ContactName = @ContactName, 
                   Address = @Address 
                   WHERE SupplierID = @SupplierID`;

    try {
        await conn.request()
            .input('SupplierID', sql.NVarChar, id)
            .input('SupplierName', sql.NVarChar, SupplierName)
            .input('ContactName', sql.NVarChar, ContactName)
            .input('Address', sql.NVarChar, Address)
            .query(query);
        res.status(200).send(`Supplier with ID ${id} updated.`);
    } catch (err) {
        console.error("Error updating supplier: ", err);
        res.status(500).send("Error updating supplier.");
    }
});

app.delete('/suppliers/:id', async (req, res) => {
    const id = req.params.id;

    try {
        await conn.request()
            .input('SupplierID', sql.NVarChar, id)
            .query('DELETE FROM SUPPLIER WHERE SupplierID = @SupplierID');
        res.status(200).send(`Supplier with ID ${id} deleted.`);
    } catch (err) {
        console.error("Error deleting supplier: ", err);
        res.status(500).send("Error deleting supplier.");
    }
});


// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
