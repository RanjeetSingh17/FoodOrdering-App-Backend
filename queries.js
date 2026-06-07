const pool = require('./db'); 
const format = require('pg-format');
const getAllBeverages = async () => {
    const query = "SELECT * FROM menu_items WHERE item_type = 'Beverages' ORDER BY created_at DESC";
    try {
        const result = await pool.query(query);
        return result.rows;
    } catch (error) {
        console.error('Error fetching beverages:', error.message);
        throw error;
    }
};
const getAllMeals = async () => {
    const query = "SELECT * FROM menu_items where item_type='Meals' ORDER BY created_at DESC";
    
    try {
        const result = await pool.query(query);
        return result.rows;
    } catch (error) {
        console.error('Error fetching meals:', error.message);
        throw error;
    }
};
const getAllSnacks = async () => {
    const query = "SELECT * FROM menu_items where item_type='Snacks' ORDER BY created_at DESC";
    
    try {
        const result = await pool.query(query);
        return result.rows;
    } catch (error) {
        console.error('Error fetching snacks:', error.message);
        throw error;
    }
};
const getUserFavourites =async (id)=>{
    const query='SELECT id FROM saved_foods where user_id=$1'
    try{
        const result = await pool.query(query, [id]);
        return result.rows;
    }
    catch(error){
        console.error('Error fetching beverage:', error.message);
        throw error;   
    }
}
const getFavouriteDetails = async (id) => {
    const query = `
        SELECT 
            menu_items.id,
            menu_items.availability,
            menu_items.image_url,
            menu_items.item_type,
            menu_items.name,
            menu_items.selling_price 
        FROM saved_foods 
        INNER JOIN menu_items ON saved_foods.item_id = menu_items.id 
        WHERE saved_foods.user_id = $1
    `;
    
    try {
        if (!id) {
            throw new Error('User ID is required');
        }
        
        const result = await pool.query(query, [id]);
        return result.rows;
    }
    catch (error) {
        console.error('Error in getFavouriteDetails:', error.message);
        throw error;
    }
};


const getMenuItemById = async (id) => {
    const query = 'SELECT * FROM menu_items WHERE id = $1';
    try {
        const result = await pool.query(query, [id]);
        return result.rows[0];
    } catch (error) {
        console.error('Error fetching meals:', error.message);
        throw error;
    }
};
const setUserFavourite=async (user_id,item_id)=>{
    const query='INSERT into saved_foods (user_id,item_id) values($1,$2)';
    try{
        const result=await pool.query(query, [user_id,item_id])
        return
    }
    catch(error){
        throw error;
    }
}
const removeUserFavourite=async(user_id,item_id)=>{
    const query='DELETE FROM saved_foods where user_id=$1 AND item_id=$2';
    try{
        const result=await pool.query(query, [user_id,item_id])
        return
    }
    catch(error){
        throw error;
    }
}

const createUser = async (userData) => {
    const { uid, email, name, created_at } = userData;

    if (!uid) {
        throw new Error('User ID (uid) is required');
    }
    if (!email) {
        throw new Error('Email is required');
    }
    
    console.log("Creating user with data:", { uid, email, name, created_at });

    const query = `
        INSERT INTO users (uid, email, name, created_at)
        VALUES ($1, $2, $3, $4)
        ON CONFLICT (uid) 
        DO UPDATE SET
            email = EXCLUDED.email,
            name = EXCLUDED.name,
            last_login = CURRENT_TIMESTAMP
        RETURNING *;
    `;

    try {
        const result = await pool.query(query, [uid, email, name, created_at]);
        console.log("Database result:", result.rows[0]);
        return result.rows[0];
    } catch (error) {
        console.error('Database error creating/updating user:', error);
        throw error;
    }
};

const getUserByUid = async (uid) => {
    const query = 'SELECT * FROM users WHERE uid = $1';
    
    try {
        const result = await pool.query(query, [uid]);
        return result.rows[0];
    } catch (error) {
        console.error('Error fetching user:', error);
        throw error;
    }
};

const submitContactMessage = async (name, email, subject, message) => {
    const query = `
        INSERT INTO contact_us (name, email, subject, message)
        VALUES ($1, $2, $3, $4)
        RETURNING id, name, email, subject, message;
    `;
    try {
        const result = await pool.query(query, [name, email, subject, message]);
        return result.rows[0]; 
    } 
    catch (error) {
        console.error("Error inserting contact message:", error.message);
        throw error;
    }
};
const gettop10menuItems=async()=>{
    const query='SELECT * FROM menu_items ORDER BY ordered DESC LIMIT 10';
    try{
        const result=await pool.query(query);
        return result;
    }catch(error){
        console.error('Error fetching 10menu items: ',error);
        throw error;
    }
}
const getBottom10MenuItems=async()=>{
    const query='SELECT * FROM menu_items ORDER BY ordered ASC LIMIT 10';
    try{
        const result=await pool.query(query);
        return result;
    }catch(error){
        console.error('Error fetch 10 bottom menu items: ',error);
        throw error;
    }
}
const getCombos = async () => {
    const query = `
      SELECT 
        c.id AS combo_id,
        c.name AS combo_name,
        c.description,
        c.total_price,
        c.discounted_price,
        c.image_url AS combo_image,
        c.availability,
        c.created_at,
        mi1.name AS item1_name,
        mi1.selling_price AS item1_price,
        mi1.image_url AS item1_image,
        mi1.item_type AS item1_type,
        mi2.name AS item2_name,
        mi2.selling_price AS item2_price,
        mi2.image_url AS item2_image,
        mi2.item_type AS item2_type
      FROM 
        combos c
      LEFT JOIN 
        menu_items mi1 ON c.item1_id = mi1.id
      LEFT JOIN 
        menu_items mi2 ON c.item2_id = mi2.id;
    `;
  
    try {
      const result = await pool.query(query);
    //   console.log("Combos with item details: ", result.rows);
      return result.rows;
    } catch (error) {
      console.error("Error fetching combos from backend: ", error);
      throw error;
    }
};
const getTopOrderedItems = async () => {
    const query = `
        SELECT id, name, selling_price, ordered, image_url, item_type, availability
        FROM menu_items 
        WHERE ordered > 0 
        ORDER BY ordered DESC 
        LIMIT 6
    `;
    
    try {
        const result = await pool.query(query);
        return result.rows;
    } catch (error) {
        console.error('Error fetching top ordered items:', error.message);
        throw error;
    }
};
const getSpecialItems = async () => {
    const query = "SELECT * FROM menu_items WHERE special = true ORDER BY created_at DESC";
    try {
        const result = await pool.query(query);
        return result.rows;
    } catch (error) {
        console.error('Error fetching special items:', error.message);
        throw error;
    }
};
// Order specific routes:
const addOrder=async(orderId,user_id,price,serviceCharge)=>{
    try{
        const query="INSERT INTO orders (order_id,order_date,user_id,order_status,price,service_charge) values($1,NOW(),$2,$3,$4,$5)"
        await pool.query(query,[orderId,user_id,"PENDING",price,serviceCharge])
    }
    catch(error){
        console.error("Error adding order status")
        throw error
    }
}
const addOrderItems=async (orderId, items)=> {
    try {
        const values = items.map(item => [orderId, item.item_id, item.quantity]);
        const query = format(
            "INSERT INTO order_items (order_id, item_id, quantity) VALUES %L",
            values
        );
        await pool.query(query);
        console.log("Batch insert successful");
    } catch (error) {
        console.error("Error inserting order items:");
        throw error;
    }
}
const updateOrderStatus=async (orderId,status)=>{
    try {
        const query = 
            `UPDATE orders set order_status=$1 where order_id=$2`
        await pool.query(query,[status,orderId]);
        console.log("Batch insert successful");
    } catch (error) {
        console.error("Error inserting order items:");
        throw error;
    }
}
const getUserOrders=async(user_id)=>{
    try{
        const query=`SELECT * FROM orders where user_id=$1 ORDER BY order_date desc`
        const result=await pool.query(query,[user_id])
        return result.rows;
    }
    catch(error){
        console.error("Error fetching user orders")
        throw error;
    }
}

const fetchReceipt=async(user_id,order_id)=>{
    try{
        const query_order=`SELECT order_no,price as base_amount,service_charge,order_date from orders where order_id=$1
        and user_id=$2`
        const query_items=`SELECT m.id,o.quantity,m.name,m.selling_price from menu_items as m inner join 
        order_items o on o.item_id=m.id where o.order_id=$1`
        const result_order=await pool.query(query_order,[order_id,user_id])
        if(result_order.rowCount>0){
            const result_items=await pool.query(query_items,[order_id])
            return {result_order:result_order.rows[0],result_items:result_items.rows}
        }
        return {result_order:null};
    }
    catch(error){
        console.error("Error fetching user receipt")
        throw error;
    }
}
const getAllCombos = async () => {
    const query = "SELECT * FROM combos WHERE availability = true ORDER BY created_at DESC";
    try {
        const result = await pool.query(query);
        return result.rows;
    } catch (error) {
        console.error('Error fetching combos:', error.message);
        throw error;
    }
};


module.exports = {
    getTopOrderedItems,
    getAllBeverages,
    getAllMeals,
    getAllSnacks,
    getAllCombos,
    setUserFavourite,
    getUserFavourites,
    removeUserFavourite,
    createUser,
    getUserByUid,
    getMenuItemById,
    getFavouriteDetails,
    submitContactMessage,
    getBottom10MenuItems,
    gettop10menuItems, 
    getSpecialItems,
    addOrder,
    addOrderItems,
    updateOrderStatus,
    fetchReceipt,
    getUserOrders,
    getCombos,
     getTopOrderedItems
};