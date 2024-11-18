const express = require('express');
const { ConnectToDb, getDb } = require('./connection');
const cors = require('cors');
const bcrypt = require('bcrypt');
const { ObjectId } = require('mongodb');

const app = express()

app.use(express.json())
app.use(cors({
    origin: 'http://localhost:3000'
}));

let databaseRef;

ConnectToDb(async(error)=>{
    if(!error){
        app.listen(5000,()=>{
        })
        databaseRef = await getDb()
    }else{
        console.error("Database Connection Error: " + error)
    }
})

app.post("/loginUser",async (req,res)=>{
    const {usernameEmail, password} = req.body
    try{
        const user = await databaseRef.collection('Admin').findOne({$or: [{Email: usernameEmail}, {Username: usernameEmail}]})
        if(!user){ return res.status(200).json({message: "User Not Found", user: null})}

        if(!await bcrypt.compare(password,user.Password)){
            return res.status(200).json({message: "Invalid Credentials", user: null})
        }

        return res.status(200).json(
            {
                message: "Login Successful",
                user: user
            }
        )
    }
    catch (error){
        return res.status(500).json({message: "Error fetching User Details: " + error})
    }
})

app.post("/createUser", async (req, res) => {
    const { username, email, password } = req.body;

    try {
        const existingUser = await databaseRef.collection("Admin").findOne({ 
            $or: [{ Email: email }, { Username: username }] 
        });

        if (existingUser) {
            return res.status(200).json({ message: "User already exists", response: null });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = { Username: username, Email: email, Password: hashedPassword };

        const response = await databaseRef.collection("Admin").insertOne(newUser);

        res.status(200).json({ message: "User created successfully", response: response });
    } catch (error) {
        return res.status(500).json({message: "Error Inserting User Details: " + error})
    }
});


app.get("/getUser/:userId", async (req, res) => {
    const { userId } = req.params;

    try {
        const user = await databaseRef.collection("Admin").findOne({ _id: new ObjectId(userId) });

        if (!user) {
            return res.status(200).json({ message: "User not found" });
        }

        res.status(200).json({message: "Fetched Companies", Companies: user.Companies});
    } catch (error) {
        res.status(500).json({ message: "Error Fetching Companies " + error });
    }
});

app.post("/createCompany", async (req, res) => {
    const { userId, companyData } = req.body;
    try {
        const userCollection = databaseRef.collection("Admin");
        const user = await userCollection.findOne({
            _id: new ObjectId(userId),
            "Companies.Name": companyData.Name,
        });

        if (user) {
            return res.status(200).json({ message: "Company with the same name already exists" });
        }

        const result = await userCollection.updateOne(
            { _id: new ObjectId(userId) },
            { $push: { Companies: companyData } }
        );

        res.status(200).json({ message: "Company added successfully!" });
    } catch (error) {
        res.status(500).json({ message: "Error adding company", error: error.message });
    }
});

app.post("/alterCompany", async (req, res) => {
    const { userId, companyData } = req.body;

    try {
        const userCollection = databaseRef.collection("Admin");

        const result = await userCollection.updateOne(
            { _id: new ObjectId(userId), "Companies.Name": companyData.Name },
            { $set: { "Companies.$": companyData } }
        );

        res.status(200).json({ message: "Company updated successfully!" });
    } catch (error) {
        res.status(500).json({ message: "Error updating company", error: error.message });
    }
});

app.post("/deleteCompany", async (req, res) => {
    const { userId, companyName } = req.body;

    try {
        const userCollection = databaseRef.collection("Admin");

        const result = await userCollection.updateOne(
            { _id: new ObjectId(userId) },
            { $pull: { Companies: { Name: companyName } } }
        );

        res.status(200).json({ message: "Company deleted successfully!" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting company " + error.message });
    }
});

app.post("/fetchItems", async (req, res) => {
    const { userId, companyName } = req.body;
    try {
        const user = await databaseRef.collection("Admin").findOne({ _id: new ObjectId(userId) });
        const company = user.Companies.find(comp => comp.Name === companyName);
        res.status(200).json({ message: "Fetched items successfully", items: company.Items || [] });
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Error Fetching Items " + error });
    }
});

app.post("/createItems", async (req, res) => {
    const { userId, companyName, itemName, qtyInStock } = req.body;

    try {
        const userCollection = databaseRef.collection("Admin");

        const user = await userCollection.findOne({
            _id: new ObjectId(userId),
            "Companies.Name": companyName,
        });

        const company = user.Companies.find(company => company.Name === companyName);
        if (company.Items && company.Items.some(item => item.Name === itemName)) {
            return res.status(200).json({ message: "Item with this name already exists in the company" });
        }

        const newItem = { Name: itemName, Qty: qtyInStock };

        const result = await userCollection.updateOne(
            { _id: new ObjectId(userId), "Companies.Name": companyName },
            { $push: { "Companies.$.Items": newItem } }
        );

        res.status(200).json({ message: "Item added successfully!" });
    } catch (error) {
        res.status(500).json({ message: "Error adding item", error: error.message });
    }
});

app.post("/updateItems", async (req, res) => {
    const { userId, companyName, itemName, qtyInStock } = req.body;

    try {
        const userCollection = databaseRef.collection("Admin");

        const user = await userCollection.findOne({
            _id: new ObjectId(userId),
            "Companies.Name": companyName,
        });

        const company = user.Companies.find(company => company.Name === companyName);
        const itemIndex = company.Items.findIndex(item => item.Name === itemName);

        if (itemIndex === -1) {
            return res.status(200).json({ message: "Item not found in this company" });
        }

        company.Items[itemIndex].Qty = qtyInStock;

        const result = await userCollection.updateOne(
            { _id: new ObjectId(userId), "Companies.Name": companyName },
            { $set: { "Companies.$.Items": company.Items } }
        );

        res.status(200).json({ message: "Item updated successfully!" });
    } catch (error) {
        res.status(500).json({ message: "Error updating item", error: error.message });
    }
});

app.post("/deleteItems", async (req, res) => {
    const { userId, companyName, itemName } = req.body;

    try {
        const userCollection = databaseRef.collection("Admin");

        const user = await userCollection.findOne({
            _id: new ObjectId(userId),
            "Companies.Name": companyName,
        });

        if (!user) {
            return res.status(404).json({ message: "Company not found for this user" });
        }

        const result = await userCollection.updateOne(
            { _id: new ObjectId(userId), "Companies.Name": companyName },
            { $pull: { "Companies.$.Items": { Name: itemName } } }
        );

        res.status(200).json({ message: "Item deleted successfully!" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting item", error: error.message });
    }
});

app.post("/submitSales", async (req, res) => {
    const { userId, companyName, transactionID, date, rows, totalAmount } = req.body;

    try {
        const objectId = new ObjectId(userId);

        const admin = await databaseRef.collection("Admin").findOne({ _id: objectId });
        const companyIndex = admin.Companies.findIndex((c) => c.Name === companyName);
        const company = admin.Companies[companyIndex];

        const itemQuantities = rows.reduce((acc, saleItem) => {
            acc[saleItem.itemName] = (acc[saleItem.itemName] || 0) + saleItem.quantity;
            return acc;
        }, {});

        for (const [itemName, totalRequired] of Object.entries(itemQuantities)) {
            const item = company.Items.find((i) => i.Name === itemName);

            if (item.Qty < totalRequired) {
                return res.status(200).json({ 
                    message: `Insufficient quantity for item '${itemName}'. Available: ${item.Qty}, Required: ${totalRequired}` 
                });
            }
        }

        for (const [itemName, totalRequired] of Object.entries(itemQuantities)) {
            const item = company.Items.find((i) => i.Name === itemName);
            item.Qty -= totalRequired;
        }

        const updateResult = await databaseRef.collection("Admin").updateOne(
            { _id: objectId, "Companies.Name": companyName },
            {
                $push: { "Companies.$.Sales": { Id: transactionID, Date: date, Items_T: rows, Amount: totalAmount } },
                $set: {
                    "Companies.$.Balance": company.Balance + totalAmount,
                    "Companies.$.LastTransactionDate": date,
                    "Companies.$.Items": company.Items,
                },
            }
        );

        if (updateResult.modifiedCount === 0) {
            return res.status(200).json({ message: "Failed to update sales" });
        }

        res.status(200).json({ message: "Sales Successfull!", success: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error inserting sales", error: error.message });
    }
});

app.post("/submitPurchase", async (req, res) => {
    const { userId, companyName, transactionID, date, rows, totalAmount } = req.body;

    try {
        const objectId = new ObjectId(userId);

        const admin = await databaseRef.collection("Admin").findOne({ _id: objectId });
        const companyIndex = admin.Companies.findIndex((c) => c.Name === companyName);
        const company = admin.Companies[companyIndex];

        if(company.Balance < totalAmount){
            return res.status(200).json({message: "Insufficient Balance to make the Purchase"})
        }

        const itemQuantities = rows.reduce((acc, saleItem) => {
            acc[saleItem.itemName] = (acc[saleItem.itemName] || 0) + saleItem.quantity;
            return acc;
        }, {});

        
        for (const [itemName, totalRequired] of Object.entries(itemQuantities)) {
            const item = company.Items.find((i) => i.Name === itemName);
            item.Qty += totalRequired;
        }

        const updateResult = await databaseRef.collection("Admin").updateOne(
            { _id: objectId, "Companies.Name": companyName },
            {
                $push: { "Companies.$.Purchase": { Id: transactionID, Date: date, Items_T: rows, Amount: totalAmount } },
                $set: {
                    "Companies.$.Balance": company.Balance - totalAmount,
                    "Companies.$.LastTransactionDate": date,
                    "Companies.$.Items": company.Items,
                },
            }
        );

        if (updateResult.modifiedCount === 0) {
            return res.status(200).json({ message: "Failed to update purchase" });
        }

        res.status(200).json({ message: "Purchase Successfull!", success: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error inserting Purchase", error: error.message });
    }
});

app.post("/addBalance", async (req, res) => {
    const { userId, companyName, amount, date, transactionID } = req.body;

    try {
        const objectId = new ObjectId(userId);

        const admin = await databaseRef.collection("Admin").findOne({ _id: objectId });
        const companyIndex = admin.Companies.findIndex((c) => c.Name === companyName);
        const company = admin.Companies[companyIndex];

        let newBalance = parseFloat(company.Balance) + parseFloat(amount);

        const updateResult = await databaseRef.collection("Admin").updateOne(
            { _id: objectId, "Companies.Name": companyName },
            {
                $push: { "Companies.$.Reciept": { Id: transactionID, Date: date, Amount: amount } },
                $set: {
                    "Companies.$.Balance": newBalance,
                    "Companies.$.LastTransactionDate": date,
                },
            }
        );

        if (updateResult.modifiedCount === 0) {
            return res.status(200).json({ message: "Failed Reciept" });
        }

        res.status(200).json({ message: "Reciept Successfull!", success: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error inserting Reciept", error: error.message });
    }
});

app.post("/removeBalance", async (req, res) => {
    const { userId, companyName, amount, date,transactionID } = req.body;

    try {
        const objectId = new ObjectId(userId);

        const admin = await databaseRef.collection("Admin").findOne({ _id: objectId });
        const companyIndex = admin.Companies.findIndex((c) => c.Name === companyName);
        const company = admin.Companies[companyIndex];

        

        const updateResult = await databaseRef.collection("Admin").updateOne(
            { _id: objectId, "Companies.Name": companyName },
            {   
                $push: { "Companies.$.Payment": { Id: transactionID, Date: date, Amount: amount } },
                $set: {
                    "Companies.$.Balance": company.Balance - amount,
                    "Companies.$.LastTransactionDate": date,
                },
            }
        );

        if (updateResult.modifiedCount === 0) {
            return res.status(200).json({ message: "Failed Payment" });
        }

        res.status(200).json({ message: "Payment Successfull!", success: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error inserting Reciept", error: error.message });
    }
});

app.post("/fetchReports", async (req, res) => {
    const { userId, companyName } = req.body;

    try {
        const admin = await databaseRef.collection("Admin").findOne({ _id: new ObjectId(userId) });
        const company = admin.Companies.find((c) => c.Name === companyName);

        const balance = company.Balance.toString() + " " + company.Currency
       
        const itemWise = company.Sales.flatMap((sale) => sale.Items_T).reduce((acc, item) => {
            const existing = acc.find((i) => i.itemName === item.itemName);
            if (existing) {
                existing.totalSales += item.amount;
                existing.totalSalesQuantity += item.quantity;
            } else {
                acc.push({
                    itemName: item.itemName,
                    totalSales: item.amount,
                    totalSalesQuantity: item.quantity,
                    totalPurchase: 0,
                    totalPurchaseQuantity: 0,
                });
            }
            return acc;
        }, []);

        company.Purchase.flatMap((purchase) => purchase.Items_T).forEach((item) => {
            const existing = itemWise.find((i) => i.itemName === item.itemName);
            if (existing) {
                existing.totalPurchase += item.amount;
                existing.totalPurchaseQuantity += item.quantity;
            } else {
                itemWise.push({
                    itemName: item.itemName,
                    totalSales: 0,
                    totalSalesQuantity: 0,
                    totalPurchase: item.amount,
                    totalPurchaseQuantity: item.quantity,
                });
            }
        });

        const voucherWise = {
            sales: company.Sales.reduce((sum, sale) => sum + sale.Amount, 0),
            purchases: company.Purchase.reduce((sum, purchase) => sum + purchase.Amount, 0),
            receipts: company.Reciept.reduce((sum, receipt) => sum + parseFloat(receipt.Amount), 0),
            payments: company.Payment.reduce((sum, payment) => sum + parseFloat(payment.Amount), 0),
        };

        res.status(200).json({ itemWise, voucherWise, balance });
    } catch (error) {
        console.error("Error fetching reports:", error);
        res.status(500).json({ message: "Error fetching reports", error: error.message });
    }
});
