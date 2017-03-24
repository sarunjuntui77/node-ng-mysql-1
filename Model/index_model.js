module.exports = (app,dirName,con,session,cors)=>{
app.get('/', (req, res) => {
    res.render(dirName+'/View/index');        
});
app.get('/get_session', (req, res) => {
	let sess = req.session;
	if(!sess.member){
	res.send('no_session');

	}else{
	res.send('session');
	}
});
app.post('/login', (req, res) => {
	res.header("Content-Type", "application/json; charset=utf-8");
	let sess = req.session;
	let sql = "SELECT * FROM member WHERE member_username = ? AND member_password = ? ";
	let data_r = [ req.body.username,req.body.password];
	con.query(sql,data_r,(err, rows, fields)=> {
  	if (err) throw err;
	  	if(rows.length != 0){
	  		sess.member = rows[0];
	  	}
	  		res.send(rows);
	});    
});

app.post('/logout', (req, res) => {
	req.session.destroy((err)=> {
		res.send('logout');
  	})
});

app.get('/search/:text', (req, res) => {
	let sql = "SELECT * FROM products WHERE  product_name like '%"+req.params.text+"%' ;";
    con.query(sql,(err, rows, fields)=> {
  	if (err) throw err;
 
  	res.send(rows);
	});    
});
app.get('/get_all_products', (req, res) => {
	cors(res);
	let sql ="SELECT * FROM products "
	+"INNER JOIN suppliers ON suppliers.supplier_id = products.supplier_id ORDER BY product_id DESC";
	
	con.query(sql, (err, rows, fields) =>{
  	if (err) throw err;
 	
  	res.send(rows);
	});
});
app.get('/get_products_by_id/:id', (req, res) => {
	let sql ="SELECT * FROM products "
	+"INNER JOIN suppliers ON suppliers.supplier_id = products.supplier_id "
	+"WHERE products.product_id = "+req.params.id;
	con.query(sql, (err, rows, fields) =>{
  	if (err) throw err;
 	res.send(rows);
	});
});
app.get('/get_all_suppliers', (req, res) => {
	let sql ="SELECT * FROM suppliers ";
	con.query(sql, (err, rows, fields) =>{
  	if (err) throw err;
  	res.send(rows);
	});
});
app.get('/get_all_suppliers/not/:id', (req, res) => {
	let sql ="SELECT * FROM suppliers WHERE supplier_id != "+req.params.id;
	con.query(sql, (err, rows, fields) =>{
  	if (err) throw err;
  	res.send(rows);
	});
});
app.get('/delete/:id', (req, res) => {
	con.query('DELETE FROM products  WHERE product_id = ?', [req.params.id], (err, results) =>{
	if (err) throw err;
	res.send('success');
	});
	           
});

app.post('/edit_product', (req, res) => {

	let sql = "UPDATE products SET product_code = ? , supplier_id = ? , product_name = ? , description = ? "
	+", standard_cost = ? ,list_price = ? ,reorder_level = ? "
	+", target_level = ? , quantity_per_unit = ? , discontinued = ? "
	+", minimum_reorder_quantity = ? , category = ?  "
	+" WHERE product_id = ? ;";
	let data_r = [req.body.product_code,req.body.supplier_id.supplier_id,req.body.product_name , req.body.description
	,req.body.standard_cost,req.body.list_price,req.body.reorder_level
	,req.body.target_level,req.body.quantity_per_unit,req.body.discontinued
	,req.body.minimum_reorder_quantity,req.body.category
	,req.body.product_id
	];


	con.query(sql, data_r, (err, results) =>{
	if (err) throw err;
	
	res.send('success');
	});
	           
});

app.post('/add_product', (req, res) => {

	let sql = "INSERT INTO products(product_code,product_name,list_price,category,supplier_id)"
	+" value(?,?,?,?,?) ;";

	let data_r = [ req.body.product_code
	,req.body.product_name
	,req.body.list_price
	,req.body.category
	,req.body.supplier_id.supplier_id
	];

	con.query(sql, data_r, (err, results) =>{
	if (err) throw err;
	res.send('success');
	});
	        
});
}