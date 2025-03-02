const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
app.use(cors({
    origin: ['http://localhost:5173'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

const pool = mysql.createPool({
});

async function queryDatabase(sql, params = []) {
    let connection;
    try {
        connection = await pool.getConnection();
        const [rows] = await connection.execute(sql, params);
        return rows;
    } catch (error) {
        console.error('Database error:', error);
        throw new Error('Internal Server Error');
    } finally {
        if (connection) connection.release();
    }
}

app.get('/books', async (req, res) => {
    try {
        const bookId = req.query.id;
        const allBooks = req.query.all;
        const publisher_id = req.query.publisher_id;

        let sql;
        let params = [];

        if (bookId) {
            sql = `SELECT b.*, a.*, s.*, p.* 
               FROM book_detail b
               LEFT JOIN author a ON b.author_id = a.author_id
               LEFT JOIN serie s ON b.serie_id = s.serie_id
               LEFT JOIN publisher p ON b.publisher_id = p.publisher_id
               WHERE b.book_id = ?`;
            params = [bookId];
        } else if (allBooks) {
            sql = 'SELECT * FROM book_detail';
        } else if (publisher_id) {
            sql = `SELECT *
                   FROM book_detail
                   WHERE  publisher_id = ?`
            params = [publisher_id]
        } else {
            sql = `SELECT *
            FROM book_detail
            WHERE (serie_id = 1) OR
                  (serie_id != 1 AND book_id IN (
                      SELECT MIN(book_id)
                      FROM (
                          SELECT *
                          FROM book_detail
                          WHERE serie_id != 1
                          ORDER BY release_date DESC
                      ) AS sub
                      GROUP BY serie_id
                  ))
            ORDER BY release_date DESC
            LIMIT 10`;
            params = [1, 1];
        }

        const books = await queryDatabase(sql, params);

        if (Array.isArray(books) && books.length > 0 && bookId) {
            res.json(books[0]);
        } else {
            res.json(books);
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/books/one-each', async (req, res) => {
    try {
      const sql = `
        SELECT bd.*, a.*, s.*, p.*
        FROM book_detail bd
        LEFT JOIN author a ON bd.author_id = a.author_id
        LEFT JOIN serie s ON bd.serie_id = s.serie_id
        LEFT JOIN publisher p ON bd.publisher_id = p.publisher_id
        WHERE bd.book_id IN (
          SELECT MIN(book_id)
          FROM book_detail
          GROUP BY serie_id
        );
      `;
  
      const books = await queryDatabase(sql);
  
          const modifiedBooks = books.map(book => {
                  if (typeof book.book_category === 'string' && book.book_category) {
                      book.book_category = book.book_category.split(',').map(s => s.trim());
                  } else {
                      book.book_category = [];
                  }
                  return book;
              });
  
      res.json(modifiedBooks);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
});

app.get('/books/searched/f', async (req, res) => {
    try {
        const name = req.query.name;
        const category = req.query.category;

        let sql = 'SELECT * FROM book_detail WHERE ';
        const params = [];

        if (category) {
            sql += 'FIND_IN_SET(?, book_category) > 0';
            params.push(category);
        } else {
            sql += 'book_name_en LIKE ? OR book_name_originl LIKE ?';
            params.push(`%${name}%`, `%${name}%`);
        }

        const books = await queryDatabase(sql, params);

        if (Array.isArray(books) && books.length > 0) {
            res.json(books);
        } else {
            res.status(404).json({ error: 'No books found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
});

app.get('/books/series/:seriesId', async (req, res) => {
    try {
        const seriesId = req.params.seriesId;
        const sql = `SELECT b.*, a.* 
                     FROM book_detail b
                     LEFT JOIN author a ON b.author_id = a.author_id
                     WHERE b.serie_id = ?`;
        const params = [seriesId];
        const books = await queryDatabase(sql, params);
        res.json(books);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/books/add', async (req, res) => {
    try {
        const entityType = req.query.type; // e.g., /books/add?type=book

        if (entityType === 'book') {
            const book_upload = req.body;
            const keys = Object.keys(book_upload);
            const values = Object.values(book_upload);
            const placeholders = keys.map(() => '?').join(', ');
            const sql = `INSERT INTO book_detail(${keys.join(', ')}) VALUES (${placeholders})`;
            const result = await queryDatabase(sql, values);
            
            res.status(201).json({ message: 'Book added successfully', book_id: result.insertId });

        } else if (entityType === 'serie') {
            const { serie_name } = req.body;
            if (!serie_name) {
                return res.status(400).json({ error: 'Serie name is required' });
            }
            const sql = 'INSERT INTO serie (serie_name) VALUES (?)';
            const result = await queryDatabase(sql, [serie_name]);
            res.status(201).json({ message: 'Serie added successfully', serie_id: result.insertId });

        } else if (entityType === 'shop') {
            const shops = req.body;
            if (!Array.isArray(shops)) {
                return res.status(400).json({ error: 'Invalid shops data' });
            }
            const sql = 'INSERT INTO book_shop (book_id, shop_name, shop_url, shop_price, shop_discount, shop_img) VALUES ?';
            const values = shops.map(shop => [shop.book_id, shop.shop_name, shop.shop_url, shop.shop_price, shop.shop_discount, shop.shop_img]);
            await queryDatabase(sql, [values]);
            res.status(201).json({ message: 'Shops added successfully' });

        } else if (entityType === 'publisher') {
            const { publisher_name } = req.body;
            if (!publisher_name) {
                return res.status(400).json({ error: 'Publisher name is required' });
            }
            const sql = 'INSERT INTO publisher (publisher_name) VALUES (?)';
            const result = await queryDatabase(sql, [publisher_name]);
            res.status(201).json({ message: 'Publisher added successfully', publisher_id: result.insertId });

        }
        else if (entityType === 'author') {
            const { author_name } = req.body;
            if (!author_name) {
                return res.status(400).json({ error: 'Author name is required' });
            }
            const sql = 'INSERT INTO author (author_name) VALUES (?)';
            const result = await queryDatabase(sql, [author_name]);
            res.status(201).json({ message: 'Author added successfully', author_id: result.insertId });

        } else if (entityType === 'history') {
            const { user_id, book_id } = req.body;
            if (!user_id || !book_id) {
                return res.status(400).json({ error: 'User ID and Book ID are required' });
            }
            const checkSql = 'SELECT * FROM history WHERE user_id = ? AND book_id = ?';
            const existingHistory = await queryDatabase(checkSql, [user_id, book_id]);

            let historyId;
            if (existingHistory.length > 0) {
                const updateSql = 'UPDATE history SET time_stamp = CURRENT_TIMESTAMP WHERE user_id = ? AND book_id = ?';
                await queryDatabase(updateSql, [user_id, book_id]);
                historyId = existingHistory[0].history_id;
            } else {
                const insertSql = 'INSERT INTO history (user_id, book_id) VALUES (?, ?)';
                const insertResult = await queryDatabase(insertSql, [user_id, book_id]);
                historyId = insertResult.insertId;
            }
            res.status(201).json({ message: 'History added successfully', history_id: historyId });

        } else if (entityType === 'favorite') {
            const { user_id, book_id } = req.body;
            if (!user_id || !book_id) {
                return res.status(400).json({ error: 'User ID and Book ID are required' });
            }
            const checkSql = 'SELECT * FROM favorite WHERE user_id = ? AND book_id = ?';
            const existingFavorite = await queryDatabase(checkSql, [user_id, book_id]);

            let favoriteId;
            if (existingFavorite.length > 0) {
                const updateSql = 'UPDATE favorite SET time_stamp = CURRENT_TIMESTAMP WHERE user_id = ? AND book_id = ?';
                await queryDatabase(updateSql, [user_id, book_id]);
                favoriteId = existingFavorite[0].favorite_id;
            } else {
                const insertSql = 'INSERT INTO favorite (user_id, book_id) VALUES (?, ?)';
                const insertResult = await queryDatabase(insertSql, [user_id, book_id]);
                favoriteId = insertResult.insertId;
            }
            res.status(201).json({ message: 'Favorite added successfully', favorite_id: favoriteId });

        } else {
            res.status(400).json({ error: 'Invalid entity type specified' });
        }
    } catch (error) {
        console.error('Error adding entity:', error);
        res.status(500).json({ error: 'Failed to add entity' });
    }
});

app.get('/books/get/publisher', async (req, res) => {
    try {
        const sql = 'SELECT * FROM publisher';
        const publishers = await queryDatabase(sql);
        res.json(publishers);
    } catch (error) {
        console.error('Error fetching publishers:', error);
        res.status(500).json({ error: 'Failed to fetch publishers' });
    }
});

app.get('/books/get/serie', async (req, res) => {
    try {
        const sql = 'SELECT * FROM serie';
        const series = await queryDatabase(sql);
        res.json(series);
    } catch (error) {
        console.error('Error fetching series:', error);
        res.status(500).json({ error: 'Failed to fetch series' });
    }
});

app.post('/books/update/book/:bookId', async (req, res) => {
    try {
        const bookId = req.params.bookId;
        const bookData = req.body;

        const keys = Object.keys(bookData);
        const values = Object.values(bookData);
        const setClause = keys.map(key => `${key} = ?`).join(', ');

        const sql = `UPDATE book_detail SET ${setClause} WHERE book_id = ?`;
        values.push(bookId);

        const result = await queryDatabase(sql, values);

        if (result.affectedRows === 0) {
            res.status(404).json({ error: 'Book not found' });
        } else {
            res.json({ message: 'Book updated successfully' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/books/get/shop/:bookId', async (req, res) => {
    try {
        const bookId = req.params.bookId;
        const sql = 'SELECT * FROM book_shop WHERE book_id = ?';
        const shops = await queryDatabase(sql, [bookId]);
        res.json(shops);
    } catch (error) {
        console.error('Error fetching shops:', error);
        res.status(500).json({ error: 'Failed to fetch shops' });
    }
});


app.get('/books/get/author', async (req, res) => {
    try {
        const sql = 'SELECT * FROM author';
        const authors = await queryDatabase(sql);
        res.json(authors);
    } catch (error) {
        console.error('Error fetching authors:', error);
        res.status(500).json({ error: 'Failed to fetch authors' });
    }
});

app.get('/books/get/history/:userId', async (req, res) => {
    try {
        const userId = req.params.userId;
        const sql = `SELECT h.*, u.*, b.*
                     FROM history h
                     JOIN user u ON h.user_id = u.user_id
                     JOIN book_detail b ON h.book_id = b.book_id
                     WHERE h.user_id = ?`;
        const history = await queryDatabase(sql, [userId]);
        res.json(history);
    } catch (error) {
        console.error('Error fetching history:', error);
        res.status(500).json({ error: 'Failed to fetch history' });
    }
});

app.get('/books/get/favorite/:userId', async (req, res) => {
    try {
        const userId = req.params.userId;
        const sql = `SELECT f.*, u.*, b.*
                     FROM favorite f
                     JOIN user u ON f.user_id = u.user_id
                     JOIN book_detail b ON f.book_id = b.book_id
                     WHERE f.user_id = ?`;
        const favorites = await queryDatabase(sql, [userId]);
        res.json(favorites);
    } catch (error) {
        console.error('Error fetching favorites:', error);
        res.status(500).json({ error: 'Failed to fetch favorites' });
    }
});

app.post('/books/drop/favorite', async (req, res) => {
    try {
        const { user_id, book_id } = req.body;
        if (!user_id || !book_id) {
            return res.status(400).json({ error: 'User ID and Book ID are required' });
        }
        const sql = 'DELETE FROM favorite WHERE user_id = ? AND book_id = ?';
        const result = await queryDatabase(sql, [user_id, book_id]);

        if (result.affectedRows === 0) {
            res.status(404).json({ error: 'Favorite not found' });
        } else {
            res.json({ message: 'Favorite dropped successfully' });
        }
    } catch (error) {
        console.error('Error dropping favorite:', error);
        res.status(500).json({ error: 'Failed to drop favorite' });
    }
});

app.get('/books/drop/history/:userId', async (req, res) => {
    try {
        const userId = req.params.userId;
        const sql = 'DELETE FROM history WHERE user_id = ?';
        const result = await queryDatabase(sql, [userId]);

        if (result.affectedRows === 0) {
            res.status(404).json({ error: 'History not found' });
        } else {
            res.json({ message: 'History dropped successfully' });
        }
    } catch (error) {
        console.error('Error dropping history:', error);
        res.status(500).json({ error: 'Failed to drop history' });
    }
});

app.get('/books/drop/book/:bookId', async (req, res) => {
    try {
        const bookId = req.params.bookId;

        const deleteBookSql = 'DELETE FROM book_detail WHERE book_id = ?';
        const deleteShopsSql = 'DELETE FROM book_shop WHERE book_id = ?';

        const [deleteBookResult, deleteShopsResult] = await Promise.all([
            queryDatabase(deleteBookSql, [bookId]),
            queryDatabase(deleteShopsSql, [bookId])
        ]);
        if (deleteBookResult.affectedRows === 0) {
            res.status(404).json({ error: 'Book not found' });
        } else {
            res.json({ message: 'Book and associated shops dropped successfully' });
        }
    } catch (error) {
        console.error('Error dropping book:', error);
        res.status(500).json({ error: 'Failed to drop book' });
    }
});

app.patch('/books/:id/update-score', async (req, res) => {
    try {
        const bookId = req.params.id;
        const commentsSql = 'SELECT score FROM comment WHERE book_id = ? AND score BETWEEN 1 AND 5';
        const comments = await queryDatabase(commentsSql, [bookId]);

        let avgScore = 0;
        if (comments.length > 0) {
            const totalScore = comments.reduce((sum, comment) => sum + comment.score, 0);
            avgScore = totalScore / comments.length;
        }

        const updateSql = 'UPDATE book_detail SET book_score = ? WHERE book_id = ?';
        await queryDatabase(updateSql, [avgScore, bookId]);

        res.json({ message: 'Book score updated successfully' });
    } catch (error) {
        console.error('Error updating book score:', error);
        res.status(500).json({ error: 'Failed to update book score' });
    }
});

app.get('/books/voting-status/:userId', async (req, res) => {
    try {
        const userId = req.params.userId;
        const sql = 'SELECT * FROM voting WHERE user_id = ?';
        const votingStatus = await queryDatabase(sql, [userId]);
        res.json(votingStatus);
    } catch (error) {
        console.error('Error fetching voting status:', error);
        res.status(500).json({ error: 'Failed to fetch voting status' });
    }
});

///USER///

//get all user
app.get('/user' , async (req, res) => {
    try {
        const sql = `SELECT * FROM user WHERE user_permission != 'Manager' ;`;
        const data = await queryDatabase(sql);
        res.status(200).json(data);
    }
    catch (error) {
        console.error('ERROR', error);
        res.status(500).json({
            error: 'Failed to get user',
            details: error.message
        });
    }
});

//delete some user
//โยน token ของคนสั่งลบ กับ user_id ของคนที่จะลบ เเละ เหตุผลที่ลบ ไว้ใน body ที่ยิงมา
app.post('/user/manage/delete' , async (req, res) => {
    try {
        const { token, user_id, reason} = req.body;
        if (!token || !user_id || !reason) {
            return res.status(400).json({ error: 'Token and User_id and reason is required' });
        }
        const decodedToken = await jwt.verify(token, 'itkmitl');
        if(decodedToken.user_permission != 'Manager'){
            return res.status(401).json({ error: 'Permission Denied' });
        }
        let check_id = await queryDatabase("SELECT * FROM user WHERE user_id = ?", [user_id]);
        if(check_id.length === 0){
            return res.status(404).json({ error: 'User not found' });
        }
        const sql = `DELETE FROM user WHERE user_id = ?`;
        const sql_log = `INSERT INTO log_user_status (user_id, status, reason, manager_user_id) VALUEs (?, ?, ?, ?);`;
        const delUsers = await queryDatabase(sql, [user_id]);
        const savelog = await queryDatabase(sql_log, [user_id, 'Deleted', reason, decodedToken.user_id]);
        res.status(200).json({
            detail: 'Success to delete user',
            details: delUsers
        })
    }
    catch (error) {
        console.error('ERROR', error);
        res.status(500).json({
            error: 'Failed to delete user',
            details: error.message
        });
    }
});

//ban user
// ต้องการ tokenผู้สั่งเเบน,  user_idของคนที่จะลบ, เหตุผล, เเบนถึงเวลา..
app.patch('/user/manage/ban' , async (req, res) => {
    try {
        const { token, user_id, reason, user_unban_time} = req.body;
        if (!token || !user_id || !reason || !user_unban_time) {
            return res.status(400).json({ error: 'Information all is required' });
        }
        const decodedToken = await jwt.verify(token, 'itkmitl');
        if(decodedToken.user_permission != 'Manager'){
            return res.status(401).json({ error: 'Permission Denied' });
        }
        let check_id = await queryDatabase("SELECT * FROM user WHERE user_id = ?", [user_id]);
        if(check_id.length === 0){
            return res.status(404).json({ error: 'User not found' });
        }
        const sql = `UPDATE user SET user_status = 'Banned', user_unban_time = ? WHERE user_id = ?`;
        const sql_log = `INSERT INTO log_user_status (user_id, status, reason, manager_user_id, user_unban_time) VALUEs (?, ?, ?, ?, ?);`;
        const banUser = await queryDatabase(sql, [user_unban_time ,user_id]);
        const savelog = await queryDatabase(sql_log, [user_id, 'Banned', reason, decodedToken.user_id, user_unban_time]);
        res.status(200).json({
            detail: 'Success to ban user',
            details: banUser
        })
    }
    catch (error) {
        console.error('ERROR', error);
        res.status(500).json({
            error: 'Failed to ban user',
            details: error.message
        });
    }
});

//unban user
app.patch('/user/manage/unban' , async (req, res) => {
    try {
        const { token, user_id, reason} = req.body;
        if (!token || !user_id || !reason) {
            return res.status(400).json({ error: 'Information all is required' });
        }
        const decodedToken = await jwt.verify(token, 'itkmitl');
        if(decodedToken.user_permission != 'Manager'){
            return res.status(401).json({ error: 'Permission Denied' });
        }
        let check_id = await queryDatabase("SELECT * FROM user WHERE user_id = ?", [user_id]);
        if(check_id.length === 0){
            return res.status(404).json({ error: 'User not found' });
        }
        const sql = `UPDATE user SET user_status = 'Normal', user_unban_time = NULL WHERE user_id = ?`;
        const sql_log = `INSERT INTO log_user_status (user_id, status, reason, manager_user_id) VALUEs (?, ?, ?, ?);`;
        const unBanUser = await queryDatabase(sql, [user_id]);
        const savelog = await queryDatabase(sql_log, [user_id, 'Normal', reason, decodedToken.user_id]);
        res.status(200).json({
            detail: 'Success to unban user',
            details: unBanUser
        })
    }
    catch (error) {
        console.error('ERROR', error);
        res.status(500).json({
            error: 'Failed to unban user',
            details: error.message
        });
    }
});

//restrict user 
//ต้องการ tokenผู้สั่ง, user_idของคนโดน, เหตุผลที่ทำ
app.patch('/user/manage/restrict' , async (req, res) => {
    try {
        const { token, user_id, reason} = req.body;
        if (!token || !user_id || !reason) {
            return res.status(400).json({ error: 'Information all is required' });
        }
        const decodedToken = await jwt.verify(token, 'itkmitl');
        if(decodedToken.user_permission != 'Manager'){
            return res.status(401).json({ error: 'Permission Denied' });
        }
        let check_id = await queryDatabase("SELECT * FROM user WHERE user_id = ?", [user_id]);
        if(check_id.length === 0){
            return res.status(404).json({ error: 'User not found' });
        }
        const sql = `UPDATE user SET user_status = 'Isolated' WHERE user_id = ?`;
        const sql_log = `INSERT INTO log_user_status (user_id, status, reason, manager_user_id) VALUEs (?, ?, ?, ?);`;
        const restrictUser = await queryDatabase(sql, [user_id]);
        const savelog = await queryDatabase(sql_log, [user_id, 'Isolated', reason, decodedToken.user_id]);
        res.status(200).json({
            detail: 'Success to restrict user',
            details: restrictUser
        })
    }
    catch (error) {
        console.error('ERROR', error);
        res.status(500).json({
            error: 'Failed to restrict user',
            details: error.message
        });
    }
});

//unrestrict user
app.patch('/user/manage/unrestrict' , async (req, res) => {
    try {
        const { token, user_id, reason} = req.body;
        if (!token || !user_id || !reason) {
            return res.status(400).json({ error: 'Information all is required' });
        }
        const decodedToken = await jwt.verify(token, 'itkmitl');
        if(decodedToken.user_permission != 'Manager'){
            return res.status(401).json({ error: 'Permission Denied' });
        }
        let check_id = await queryDatabase("SELECT * FROM user WHERE user_id = ?", [user_id]);
        if(check_id.length === 0){
            return res.status(404).json({ error: 'User not found' });
        }
        const sql = `UPDATE user SET user_status = 'Normal' WHERE user_id = ?`;
        const sql_log = `INSERT INTO log_user_status (user_id, status, reason, manager_user_id) VALUEs (?, ?, ?, ?);`;
        const unrestrictUser = await queryDatabase(sql, [user_id]);
        const savelog = await queryDatabase(sql_log, [user_id, 'Normal', reason, decodedToken.user_id]);
        res.status(200).json({
            detail: 'Success to unrestrict user',
            details: unrestrictUser
        })
    }
    catch (error) {
        console.error('ERROR', error);
        res.status(500).json({
            error: 'Failed to unrestrict user',
            details: error.message
        });
    }
});

app.post('/user/register', async (req, res) => {
    try {
        const { user_email, user_name, user_pass, user_phone, user_firstname, user_lastname } = req.body;

        if (!user_email || !user_name || !user_pass || !user_phone || !user_firstname || !user_lastname) {
            return res.status(400).json({
                error: 'All fields are required',
                details: {
                    email: !user_email ? 'Email is required' : null,
                    username: !user_name ? 'Username is required' : null,
                    password: !user_pass ? 'Password is required' : null,
                    phone: !user_phone ? 'Phone number is required' : null,
                    firstname: !user_firstname ? 'Firstname is required' : null,
                    lastname: !user_lastname ? 'Lastname is required' : null
                }
            });
        }

        const existingUserSql = 'SELECT user_name, user_email FROM user WHERE user_name = ? OR user_email = ?';
        const existingUsers = await queryDatabase(existingUserSql, [user_name, user_email]);

        if (existingUsers.length > 0) {
            const existingUser = existingUsers[0];
            const conflictDetails = {
                username: existingUser.user_name === user_name ? 'Username already taken' : null,
                email: existingUser.user_email === user_email ? 'Email already registered' : null
            };

            return res.status(409).json({
                error: 'Account already exists',
                details: conflictDetails
            });
        }

        const passwordHash = await bcrypt.hash(user_pass, 8);
        const insertUserSql = 'INSERT INTO user (user_email, user_name, user_pass, user_phone, user_permission, user_image, user_firstname, user_lastname) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
        await queryDatabase(insertUserSql, [
            user_email,
            user_name,
            passwordHash,
            user_phone,
            '3',
            'https://i.imgur.com/tdrsXyg.jpeg',
            user_firstname,
            user_lastname
        ]);

        res.status(201).json({
            message: 'User registered successfully',
            success: true
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({
            error: 'Failed to register user',
            details: error.message
        });
    }
});

app.post('/user/login', async (req, res) => {
    try {
        const { user_name, user_pass } = req.body;

        if (!user_name || !user_pass) {
            console.log('Missing credentials:', { user_name: !!user_name, user_pass: !!user_pass });
            return res.status(400).json({ error: 'Username and password are required' });
        }

        console.log('Login attempt:', {
            user_name,
            passwordLength: user_pass?.length || 0
        });

        const userSql = 'SELECT * FROM user WHERE user_name = ? OR user_email = ?';
        const users = await queryDatabase(userSql, [user_name, user_name]);

        console.log('Database query result:', {
            usersFound: users.length,
            userDetails: users.length > 0 ? {
                id: users[0].user_id,
                name: users[0].user_name,
                hasPassword: !!users[0].user_pass
            } : null
        });

        if (users.length === 0) {
            return res.status(401).json({
                error: 'Invalid username or password',
                detail: 'User not found'
            });
        }

        const user = users[0];
        const match = await bcrypt.compare(user_pass, user.user_pass);

        console.log('Password verification:', { match });

        if (!match) {
            return res.status(401).json({
                error: 'Invalid username or password',
                detail: 'Password mismatch'
            });
        }

        if (user.user_status == "Banned"){
            const userUnbanTime = new Date(users[0].user_unban_time);
            const now = new Date();
            if (userUnbanTime > now){
                return res.status(401).json({
                    error: 'User has been suspended',
                    detail: `User has been suspended until ${user.user_unban_time}`
                });
            }
            const sql = `UPDATE user SET user_status = 'Normal', user_unban_time = NULL WHERE user_id = ?`;
            await queryDatabase(sql, [user.user_id]);
        }

        const token = jwt.sign(
            {
                user_id: user.user_id,
                user_name: user.user_name,
                user_permission: user.user_permission,
            },
            'itkmitl',
            { expiresIn: '30d' }
        );

        res.json({
            message: 'Login successful',
            userToken: token,
            name_user: user.user_name
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            error: 'Failed to login',
            detail: error.message
        });
    }
});

app.post('/user/getUserProfile', async (req, res) => {
    try {
        const { token } = req.body;
        if (!token) {
            return res.status(401).json({ error: 'Token is required' });
        }
        const decodedToken = jwt.verify(token, 'itkmitl');

        if (!decodedToken.user_name) {
            return res.status(401).json({ error: 'Invalid token' });
        }

        const userSql = 'SELECT * FROM user WHERE user_name = ?';
        const users = await queryDatabase(userSql, [decodedToken.user_name]);

        if (users.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json(users[0]);
    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ error: 'Token is malformed or invalid' });
        }
        console.error('Error in getUserProfile:', error);
        res.status(500).json({ error: 'Failed to get user profile' });
    }
});

// โยนข้อมูลทั้งหมดที่จะเปลี่ยนมา keyจำเป็นต้องตรงกับ database  เช่น { "userdata": {"user_name" : "black", "user_pass": "Hello"}}
// กับ user_id ของคนที่ต้องการเปลี่ยน
app.patch('/user/update', async (req, res) => {
    try {
        const userData = req.body.user_data;
        const user_id = req.body.user_id;
        if(!userData || !user_id){
            return res.status(400).json({ message: 'Information is require' });
        }

        const checkResults = await queryDatabase('SELECT * FROM user WHERE user_id = ?', [user_id]);
        if(checkResults.length == 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (userData.user_name && userData.user_name != checkResults[0].user_name) {
            const checkName = await queryDatabase('SELECT * FROM user WHERE user_name = ?', [userData.user_name]);
            if (checkName.length > 0) {
                return res.status(409).json({ message: 'Username is already registered' });
            }
            checkResults[0].user_name = userData.user_name;
        }
        
        if (userData.user_email && userData.user_email != checkResults[0].user_email) {
            const checkMail = await queryDatabase('SELECT * FROM user WHERE user_email = ?', [userData.user_email]);
            if (checkMail.length > 0) {
                return res.status(409).json({ message: 'Email is already registered' });
            }
        }

        if (userData.user_pass) {
            const passwordHash = await bcrypt.hash(userData.user_pass, 8);
            userData.user_pass = passwordHash;
        }

        let query = 'UPDATE user SET ';
        const values = [];
        const updates = [];
        
        for (const key in userData) {
            if (userData.hasOwnProperty(key)) {
                updates.push(`${key} = ?`);
                values.push(userData[key]);
            }
        }

        query += updates.join(', ');
        query += ' WHERE user_id = ?';
        values.push(checkResults[0].user_id)

        const result = await queryDatabase(query, values);
        if (result.affectedRows === 0) {
            throw {message: 'user not found'}
        }

        const token = jwt.sign(
            {
                user_id: checkResults[0].user_id,
                user_name: checkResults[0].user_name,
                user_permission: checkResults[0].user_permission
            },
            'itkmitl',
            { expiresIn: '30d'}
        )

        res.status(200).json({ message: 'User updated successfully', token: token});
    }
    catch (error) {
        console.log(`EROR : ${error}`)
        res.status(500).json({
            message: 'Update fail',
            error
        });
    }
});

app.get('/user/getUserProfile/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const userSql = 'SELECT * FROM user WHERE user_name = ?';
        const users = await queryDatabase(userSql, [id]);

        if (users.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json(users[0]);
    } catch (error) {
        console.error('Error fetching user profile by ID:', error);
        res.status(500).json({ error: 'Failed to fetch user profile' });
    }
});

app.post('/user/validate-token', async (req, res) => {
    try {
        const { token } = req.body;
        const user = jwt.verify(token, 'itkmitl');
        return res.json({ valid: true, name: user.user_name });
    } catch (error) {
        return res.json({ valid: false, name: '' });
    }
});

app.post('/user/getUserId', async (req, res) => {
    try {
        const { token } = req.body;
        if (!token) {
            return res.status(400).json({ error: 'Token is required' });
        }

        const decoded = jwt.verify(token, 'itkmitl');
        res.json({ userId: decoded.user_id });
    } catch (error) {
        console.error('Error getting user ID:', error);
        res.status(401).json({ error: 'Invalid or expired token' });
    }
});

// Comment
app.post('/books/:bookId/comments', async (req, res) => {
    try {
        const { commentDetail, userId, score, spoiler } = req.body;
        const bookId = parseInt(req.params.bookId, 10);
        console.log(req.body);

        if (isNaN(bookId) || !commentDetail || userId == null || score == null || spoiler == null) {
            return res.status(400).json({ error: 'Invalid request body or parameters.' });
        }

        const bookCheck = await queryDatabase('SELECT book_id FROM book_detail WHERE book_id = ?', [bookId]);
        if (bookCheck.length === 0) {
            return res.status(404).json({ error: 'Book not found' });
        }

        const userCheck = await queryDatabase('SELECT user_id FROM user WHERE user_id = ?', [userId]);
        if (userCheck.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        const sql = `
            INSERT INTO comment (book_id, user_id, comment_detail, score, spoiler, time_stamp)
            VALUES (?, ?, ?, ?, ?, NOW())`;
        await queryDatabase(sql, [bookId, userId, commentDetail, score, spoiler]);
        res.status(201).json({ message: 'Comment added successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to add comment' });
    }
});

app.get('/books/:bookId/comments', async (req, res) => {
    try {
        const bookId = parseInt(req.params.bookId, 10);
        if (isNaN(bookId)) {
            return res.status(400).json({ error: 'Invalid book ID.' });
        }

        const sql = `
            SELECT c.comment_id, c.comment_detail, c.score, c.spoiler, c.time_stamp,
                   u.user_id, u.user_name, u.user_image, c.reply_id
            FROM comment c
            LEFT JOIN user u ON c.user_id = u.user_id
            WHERE c.book_id = ?
            ORDER BY c.time_stamp ASC`;

        const comments = await queryDatabase(sql, [bookId]);
        res.json(comments);

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch comments' });
    }
});

app.post('/comments/:commentId/delete', async (req, res) => {
    try {
        const { userId } = req.body;
        const commentId = parseInt(req.params.commentId, 10);

        if (isNaN(commentId) || userId == null) {
            return res.status(400).json({ error: 'Invalid comment ID or missing userId.' });
        }

        const commentCheck = await queryDatabase(`
            SELECT c.comment_id, c.user_id
            FROM comment c
            WHERE c.comment_id = ?`, [commentId]);

        if (commentCheck.length === 0) {
            return res.status(404).json({ error: 'Comment not found' });
        }

        if (commentCheck[0].user_id !== Number(userId)) {
            return res.status(403).json({ error: 'Unauthorized to delete this comment' }); // 403 Forbidden
        }

        await queryDatabase('DELETE FROM comment WHERE comment_id = ?', [commentId]);

        res.status(200).json({ message: 'Comment deleted successfully' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to delete comment' });
    }
});

app.post('/comments/reply', async (req, res) => {
    const { book_id, comment_detail, user_id, reply_id } = req.body;

    if (!book_id || !comment_detail || !user_id) {
        return res.status(400).json({ message: 'book_id, comment_detail, and user_id are required' });
    }

    try {
        const query = `
            INSERT INTO comment (book_id, comment_detail, user_id, reply_id, time_stamp, up_vote, down_vote)
            VALUES (?, ?, ?, ?, NOW(), 0, 0)
            RETURNING *;
        `;

        const values = [book_id, comment_detail, user_id, reply_id === undefined ? null : reply_id];
        const [results] = await pool.query(query, values);

        if (results.length > 0) { //mysql2 returns an array, not a single result
            res.status(201).json({ message: 'Reply added successfully!', reply: results[0] });  //results[0] for the row
        } else {
           //Note: with returning * , this should probably not happen.
            res.status(500).json({ message: 'Failed to add reply' });
        }

    } catch (error) {
        console.error('Error adding reply:', error);

         //MySQL error codes are different.  You'll need to adapt your error handling.
        if (error.code === 'ER_NO_REFERENCED_ROW_2') { // Foreign key constraint violation
             return res.status(400).json({ message: 'Invalid book_id, user_id, or reply_id' });
         }
         if (error.code === 'ER_DUP_ENTRY')
         {
            //do something
         }
        // ... handle other MySQL error codes ...
        res.status(500).json({ message: 'Error adding reply' });
    }
});

// <<------------------------------- SHOP ------------------------------->>



//  << เพิ่มสินค้าของ publisher ลงตระกร้า >>
// ตัวอย่าง json ที่ต้องส่งมา
// {
//     "custom"(optional) : {"cover_color":"red", "font_family":"nato", "font_size":"500", "paper_type":"ไวเบรเนี่ยม", "marker": "none", "cover_type":"หนังหมู"},
//     "token" :"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxLCJ1c2VyX25hbWUiOiJhMTAiLCJ1c2VyX3Blcm1pc3Npb24iOiJNYW5hZ2VyIiwiaWF0IjoxNzM5NTY0MjA5LCJleHAiOjE3NDIxNTYyMDl9.M7r3crMAQUcg-1rCQ2sVMCVG5TpSBeUeysGbRo8XZ4A",
//     "book_id" : "12",
//     "amount" : "1"
// }
app.post('/shop/publisher/cart/add' , async (req, res) => {
    try {
        const { book_id, token, amount, custom }  = req.body;

        if ( !book_id || !token || !amount) {
            return res.status(400).json({ error: 'Information all is required' });
        }
        const decodedToken = await jwt.verify(token, 'itkmitl');
        let user_querry = await queryDatabase("SELECT * FROM user WHERE user_id = ?", [decodedToken.user_id]);
        if(user_querry.length === 0){
            return res.status(404).json({ error: 'User not found' });
        }

        let book_querry = await queryDatabase("SELECT book_price FROM book_detail WHERE book_id = ?", [book_id]);
        if(book_querry.length === 0){
            return res.status(404).json({ error: 'Book not found' });
        }

        let create_custom;
        
        if (!custom) {
            create_custom = await queryDatabase(
                "INSERT INTO custom_order(book_id, amount, item_price) VALUES (?, ?, ?)",
                [book_id, amount, book_querry[0].book_price]);
        }
        else {
            if ( !custom) {
                return res.status(400).json({ error: 'Information all is required' });
            }
            create_custom = await queryDatabase(
                "INSERT INTO custom_order(book_id, cover_color, cover_type, font_family, font_size, paper_type, marker, amount, item_price) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
                [book_id, custom.cover_color, custom.cover_type , custom.font_family, custom.font_size, custom.paper_type, custom.marker ,amount, book_querry[0].book_price]);
        }

        await queryDatabase("INSERT INTO cart(user_id, item_id) VALUES (?, ?)", [decodedToken.user_id, create_custom.insertId]);
        return res.status(201).json({ message: 'Add product to cart successfully'});
    }
    catch (error) {
        console.error('ERROR', error);
        res.status(500).json({
            error: 'Fail to add product to cart',
            details: error.message
        });
    }
});

//ลบสินค้าในตระกร้า
// ตัวอย่าง JSON { "item_id" : "3"}
app.delete('/shop/publisher/cart/delete' , async (req, res) => {
    try {
        const { item_id }  = req.body;

        if ( !item_id) {
            return res.status(400).json({ error: 'Information all is required' });
        }
       
        await queryDatabase(
            "DELETE FROM cart WHERE item_id=?",
            [item_id]);
       
        await queryDatabase(
            "DELETE FROM custom_order WHERE item_id = ?",
            [item_id]);
        return res.status(200).json({ message: 'Delete product at cart successfully'});
    }
    catch (error) {
        console.error('ERROR', error);
        res.status(500).json({
            error: 'Fail to delete product to cart',
            details: error.message
        });
    }
});

app.post('/shop/publisher/cart/get' , async (req, res) => {
    try {
        const { token }  = req.body;

        if ( !token) {
            return res.status(400).json({ error: 'Information all is required' });
        }

        const decodedToken = await jwt.verify(token, 'itkmitl');

        let user_querry = await queryDatabase("SELECT * FROM user WHERE user_id = ?", [decodedToken.user_id]);
        if(user_querry.length === 0){
            return res.status(404).json({ error: 'User not found' });
        }
        let query = await queryDatabase(
            `SELECT
                c.user_id,
                co.item_id,
                co.book_id,
                co.cover_color,
                co.cover_type,
                co.font_family,
                co.font_size,
                co.paper_type,
                co.marker,
                co.amount,
                b.book_name_th,
                b.book_name_en,
                b.book_price,
                b.book_image
            FROM cart c
            JOIN custom_order co ON c.item_id = co.item_id
            JOIN book_detail b ON co.book_id = b.book_id
            WHERE c.user_id = ?`,
            [decodedToken.user_id]);
   
        return res.status(200).json({ cart_info: query});
    }
    catch (error) {
        console.error('ERROR', error);
        res.status(500).json({
            error: 'Fail to get product in cart',
            details: error.message
        });
    }
});

//เหมือนกับของ publisher เเค่ไม่มี custom
app.post('/shop/seller/cart/add' , async (req, res) => {
    try {
        const { seller_book_id, token, amount}  = req.body;

        if ( !seller_book_id || !token || !amount) {
            return res.status(400).json({ error: 'Information all is required' });
        }
        const decodedToken = await jwt.verify(token, 'itkmitl');

        let user_querry = await queryDatabase("SELECT * FROM user WHERE user_id = ?", [decodedToken.user_id]);
        if(user_querry.length === 0){
            return res.status(404).json({ error: 'User not found' });
        }

        let book_querry = await queryDatabase("SELECT book_price FROM seller_book_detail WHERE seller_book_id = ?", [seller_book_id]);
        if(book_querry.length === 0){
            return res.status(404).json({ error: 'Book not found' });
        }

        let create_custom = await queryDatabase(
                "INSERT INTO seller_order(seller_book_id, amount, item_price) VALUES (?, ?, ?)",
                [seller_book_id, amount, book_querry[0].book_price]);
        
    

        await queryDatabase("INSERT INTO seller_cart(user_id, seller_item_id) VALUES (?, ?)", [decodedToken.user_id, create_custom.insertId]);
        return res.status(201).json({ message: 'Add product to cart successfully'});
    }
    catch (error) {
        console.error('ERROR', error);
        res.status(500).json({
            error: 'Fail to add product to cart',
            details: error.message
        });
    }
});

//เหมือน publisher เเค่เปลี่ยน key
app.delete('/shop/seller/cart/delete' , async (req, res) => {
    try {
        const { seller_item_id }  = req.body;

        if ( !seller_item_id) {
            return res.status(400).json({ error: 'Information all is required' });
        }
       
        await queryDatabase(
            "DELETE FROM seller_cart WHERE seller_item_id=?",
            [seller_item_id]);
       
        await queryDatabase(
            "DELETE FROM seller_order WHERE seller_item_id = ?",
            [seller_item_id]);
        return res.status(200).json({ message: 'Delete product at cart successfully'});
    }
    catch (error) {
        console.error('ERROR', error);
        res.status(500).json({
            error: 'Fail to delete product to cart',
            details: error.message
        });
    }
});

app.post('/shop/seller/cart/get' , async (req, res) => {
    try {
        const { token }  = req.body;

        if ( !token) {
            return res.status(400).json({ error: 'Information all is required' });
        }

        const decodedToken = await jwt.verify(token, 'itkmitl');

        let user_querry = await queryDatabase("SELECT * FROM user WHERE user_id = ?", [decodedToken.user_id]);
        if(user_querry.length === 0){
            return res.status(404).json({ error: 'User not found' });
        }
        let query = await queryDatabase(
            `SELECT
                c.user_id,
                co.seller_item_id,
                co.seller_book_id,
                b.book_name,
                b.book_price,
                b.book_image
            FROM seller_cart c
            JOIN seller_order co ON c.seller_item_id = co.seller_item_id
            JOIN seller_book_detail b ON co.seller_book_id = b.seller_book_id
            WHERE c.user_id = ?`,
            [decodedToken.user_id]);
   
        return res.status(200).json({ cart_info: query});
    }
    catch (error) {
        console.error('ERROR', error);
        res.status(500).json({
            error: 'Fail to get product in cart',
            details: error.message
        });
    }
});


//body คือ tokenคนสั่ง เบอร์ เมล์ ที่อยู่ ชื่อเต็ม 
app.post('/shop/order/create' , async (req, res) => {
    try {
        const { token , phone, email, address, fullname }  = req.body;

        if ( !token || !phone || !email || !address || !fullname ) {
            return res.status(400).json({ error: 'Information all is required' });
        }
        const decodedToken = await jwt.verify(token, 'itkmitl');

        let cart_publisher_querry = await queryDatabase("SELECT * FROM cart WHERE user_id = ?", [decodedToken.user_id]);
    
        if(cart_publisher_querry.length != 0){
            let querry_custom = await queryDatabase(
                `SELECT bd.publisher_id, SUM(co.amount)*bd.book_price AS total_price
                FROM cart c
                JOIN custom_order co ON c.item_id = co.item_id
                JOIN book_detail bd ON co.book_id = bd.book_id
                WHERE c.user_id = ?
                GROUP BY bd.publisher_id
                ORDER BY bd.publisher_id;`, 
                [decodedToken.user_id]);

                for (const item of querry_custom) {
                    let owner = await queryDatabase(
                        `SELECT * FROM user WHERE publisher_id = ?`,
                        [item.publisher_id]
                    )
                    owner = owner[0]

                    let insert_order = await queryDatabase(
                        `INSERT INTO order_list (user_id, owner_id, total_price, order_status, phone, email, address, fullname, status_time, order_time) VALUES (?, ?, ?, ?, ?, ?, ?, ?, current_timestamp(), current_timestamp());`, 
                        [decodedToken.user_id, owner, item.total_price, "Payment Pending", phone, email, address, fullname]
                    );
                
                    let traverst_cart = await queryDatabase(
                        `SELECT c.item_id , bd.publisher_id FROM cart c
                        JOIN custom_order co ON c.item_id = co.item_id
                        JOIN book_detail bd ON co.book_id = bd.book_id
                        WHERE c.user_id = ?;`, 
                        [decodedToken.user_id]
                    );
                
                    for (const item_cart of traverst_cart) {
                        if (item_cart.publisher_id == item.publisher_id) {
                            await queryDatabase(
                                `INSERT INTO order_bridge (item_id, order_id) VALUES (?, ?);`, 
                                [item_cart.item_id, insert_order.insertId]
                            );
                
                            await queryDatabase(
                                `DELETE FROM cart WHERE item_id = ?;`, 
                                [item_cart.item_id]
                            );
                        }
                    }
                }
        }
        let cart_seller_querry = await queryDatabase("SELECT * FROM seller_cart WHERE user_id = ?", [decodedToken.user_id]);
        if(cart_seller_querry.length != 0){
            let querry_seller_order = await queryDatabase(
                `SELECT sbd.owner_id, SUM(so.amount)*sbd.book_price AS total_price
                FROM seller_cart c
                JOIN seller_order so ON c.seller_item_id = so.seller_item_id
                JOIN seller_book_detail sbd ON so.seller_book_id = sbd.seller_book_id
                WHERE c.user_id = ?
                GROUP BY sbd.owner_id
                ORDER BY sbd.owner_id;`, 
                [decodedToken.user_id]);
                for (const item of querry_seller_order) {
                    let insert_order = await queryDatabase(
                        current_timestamp()
                        `INSERT INTO seller_order_list (user_id, owner_id, total_price, order_status, phone, email, address, fullname, order_time, status_time) VALUES (?, ?, ?, ?, ?, ?, ?, ?, current_timestamp(), current_timestamp());`, 
                        [decodedToken.user_id, item.owner_id, item.total_price, "Payment Pending", phone, email, address, fullname]
                    );
                
                    console.log(insert_order);
                
                    let traverst_cart = await queryDatabase(
                        `SELECT c.seller_item_id , bd.owner_id FROM seller_cart c
                        JOIN seller_order so ON c.seller_item_id = so.seller_item_id
                        JOIN seller_book_detail bd ON so.seller_book_id = bd.seller_book_id
                        WHERE c.user_id = ?;`, 
                        [decodedToken.user_id]
                    );
                
                    for (const item_cart of traverst_cart) {
                        if (item_cart.owner_id == item.owner_id) {
                            await queryDatabase(
                                `INSERT INTO seller_order_bridge (seller_item_id, seller_order_id) VALUES (?, ?);`, 
                                [item_cart.seller_item_id, insert_order.insertId]
                            );
                
                            await queryDatabase(
                                `DELETE FROM seller_cart WHERE seller_item_id = ?;`, 
                                [item_cart.seller_item_id]
                            );
                        }
                    }
                }
        }

        if (cart_publisher_querry.length == 0 && cart_seller_querry.length == 0) {
            return res.status(204).json({ message: "No products found in the cart"});
        }

        return res.status(200).json({ message: "Order created successfully"});
    }
    catch (error) {
        console.error('ERROR', error);
        res.status(500).json({
            error: 'Fail to create order',
            details: error.message
        });
    }
});

app.delete('/shop/publisher/order/delete' , async (req, res) => {
    try {
        const { order_id }  = req.body;

        if ( !order_id ) {
            return res.status(400).json({ error: 'Information all is required' });
        }

        let order_bridge = await queryDatabase("SELECT item_id FROM order_bridge WHERE order_id = ?;", [order_id]);
        
        for (const item of order_bridge){
                await queryDatabase("DELETE FROM custom_order WHERE item_id=?;", [item.item_id])
        }

        await queryDatabase("DELETE FROM order_bridge WHERE order_id=?;", [order_id])
        await queryDatabase("DELETE FROM order_list WHERE order_id=?;", [order_id])
        return res.status(200).json({message: "Delete order_list successfuldly"});
    }
    catch (error) {
        console.error('ERROR', error);
        res.status(500).json({
            error: 'Fail to delete order',
            details: error.message
        });
    }
});

app.delete('/shop/seller/order/delete' , async (req, res) => {
    try {
        const { seller_order_id }  = req.body;

        if ( !seller_order_id ) {
            return res.status(400).json({ error: 'Information all is required' });
        }

        let order_bridge = await queryDatabase("SELECT seller_item_id FROM seller_order_bridge WHERE seller_order_id = ?;", [seller_order_id]);
        for (const item of order_bridge){
                await queryDatabase("DELETE FROM seller_order WHERE seller_item_id=?;", [item.seller_item_id])
        }

        await queryDatabase("DELETE FROM seller_order_bridge WHERE seller_order_id=?;", [seller_order_id])
        await queryDatabase("DELETE FROM seller_order_list WHERE seller_order_id=?;", [seller_order_id])
        return res.status(200).json({message: "Delete order_list successfuldly"});
    }
    catch (error) {
        console.error('ERROR', error);
        res.status(500).json({
            error: 'Fail to delete order',
            details: error.message
        });
    }
});

app.get('/seller/all', async (req, res) => {
    try {
        let sql = `SELECT * FROM seller_book_detail`;
        const books = await queryDatabase(sql);

        res.json(books);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/shop/publisher/payment/upload-proof' , async (req, res) => {
    try {
        const { order_id, payment_slip, payment_time}  = req.body;

        if ( !order_id || !payment_slip || !payment_time) {
            return res.status(400).json({ error: 'Information all is required' });
        }

        const querry_status = await queryDatabase("SELECT order_status FROM order_list WHERE order_id=?", [order_id]);
        if (querry_status[0].order_status != "Payment Pending") {
            return res.status(400).json({message: "Please wait for review"})
        }

        await queryDatabase("UPDATE order_list SET payment_slip=?, payment_time=?, order_status=?, status_time=current_timestamp() WHERE order_id=?", [payment_slip, payment_time, "Waiting for review", order_id]);
        return res.status(200).json({message: "Payment proof submitted successfully"});
    }
    catch (error) {
        console.error('ERROR', error);
        res.status(500).json({
            error: 'Fail to payment proof submission',
            details: error.message
        });
    }
});

app.post('/shop/seller/payment/upload-proof' , async (req, res) => {
    try {
        const { seller_order_id, payment_slip, payment_time}  = req.body;

        if ( !seller_order_id || !payment_slip || !payment_time) {
            return res.status(400).json({ error: 'Information all is required' });
        }

        const querry_status = await queryDatabase("SELECT order_status FROM seller_order_list WHERE seller_order_id=?", [seller_order_id]);
        if (querry_status[0].order_status != "Payment Pending") {
            return res.status(400).json({message: "Please wait for review"})
        }

        await queryDatabase("UPDATE seller_order_list SET payment_slip=?, payment_time=?, order_status=?, status_time=current_timestamp() WHERE seller_order_id=?", [payment_slip, payment_time, "Waiting for review", seller_order_id]);
        return res.status(200).json({message: "Payment proof submitted successfully"});
    }
    catch (error) {
        console.error('ERROR', error);
        res.status(500).json({
            error: 'Fail to payment proof submission',
            details: error.message
        });
    }
});

app.patch('/shop/seller/payment/approve' , async (req, res) => {
    try {
        const { seller_order_id }  = req.body;

        if ( !seller_order_id ) {
            return res.status(400).json({ error: 'Information all is required' });
        }

        await queryDatabase("UPDATE seller_order_list SET order_status='Checked', status_time=current_timestamp() WHERE seller_order_id=?", [seller_order_id]);
        return res.status(200).json({message: "Payment approve successfully"});
    }
    catch (error) {
        console.error('ERROR', error);
        res.status(500).json({
            error: 'Fail to payment approve',
            details: error.message
        });
    }
});

app.patch('/shop/publisher/payment/approve' , async (req, res) => {
    try {
        const { order_id }  = req.body;

        if ( !order_id ) {
            return res.status(400).json({ error: 'Information all is required' });
        }

        await queryDatabase("UPDATE order_list SET order_status='Checked', status_time=current_timestamp() WHERE order_id=?", [order_id]);
        return res.status(200).json({message: "Payment approve successfully"});
    }
    catch (error) {
        console.error('ERROR', error);
        res.status(500).json({
            error: 'Fail to payment approve',
            details: error.message
        });
    }
});

app.get('/shop/publisher/order/get/:order_id' , async (req, res) => {
    try {
        const order_id = req.params.order_id;
       
        const querry_order = await queryDatabase("SELECT * FROM order_list WHERE order_id=?", [order_id]);
        if (querry_order[0].length == 0){
            return res.status(204).json({ message: "No order found in the order_list"}); 
        } 
        const querry_item = await queryDatabase (
            `SELECT *
            FROM order_bridge ob
            JOIN custom_order co ON ob.item_id = co.item_id
            JOIN book_detail bd ON co.book_id  = bd.book_id
            WHERE order_id = ?;`, [order_id]);
        const querry_buyer = await queryDatabase (
            `SELECT user.*
            FROM order_list
            JOIN user ON order_list.user_id = user.user_id
            WHERE order_id = ?;`, [order_id]
        );

        return res.status(200).json({order_info: querry_order, item: querry_item, buyer:querry_buyer});
    }
    catch (error) {
        console.error('ERROR', error);
        res.status(500).json({
            error: 'Fail to get order',
            details: error.message
        });
    }
});

app.get('/shop/seller/order/get/:seller_order_id' , async (req, res) => {
    try {
        const seller_order_id = req.params.seller_order_id;
       
        const querry_order = await queryDatabase("SELECT * FROM seller_order_list WHERE seller_order_id=?", [seller_order_id]);
        if (querry_order[0].length == 0){
            return res.status(204).json({ message: "No order found in the seller_order_list"}); 
        } 
        const querry_item = await queryDatabase (
            `SELECT *
            FROM seller_order_bridge ob
            JOIN seller_order co ON ob.seller_item_id = co.seller_item_id
            JOIN seller_book_detail bd ON co.seller_book_id  = bd.seller_book_id
            WHERE seller_order_id = ?;`, [seller_order_id]);

        const querry_buyer = await queryDatabase (
            `SELECT user.*
            FROM seller_order_list
            JOIN user ON seller_order_list.user_id = user.user_id
            WHERE seller_order_id = ?;`, [seller_order_id]
        );

        return res.status(200).json({order_info: querry_order, item: querry_item, buyer:querry_buyer});
    }
    catch (error) {
        console.error('ERROR', error);
        res.status(500).json({
            error: 'Fail to get order',
            details: error.message
        });
    }
});

// user_id ของ publisher
app.post('/shop/publisher/order/getall' , async (req, res) => {
    try {
        const { user_id }  = req.body;

        if ( !user_id ) {
            return res.status(400).json({ error: 'Information all is required' });
        }
        const querry_order = await queryDatabase("SELECT * FROM order_list WHERE owner_id=?", [user_id]);
        return res.status(200).json({order_all: querry_order});
    }
    catch (error) {
        console.error('ERROR', error);
        res.status(500).json({
            error: 'Fail to get order',
            details: error.message
        });
    }
});

// seller_id คือ user_id ของ seller
app.post('/shop/seller/order/getall' , async (req, res) => {
    try {
        const { seller_id }  = req.body;

        if ( !seller_id ) {
            return res.status(400).json({ error: 'Information all is required' });
        }
        const querry_order = await queryDatabase("SELECT * FROM seller_order_list WHERE owner_id=?", [seller_id]);
        return res.status(200).json({order_all: querry_order});
    }
    catch (error) {
        console.error('ERROR', error);
        res.status(500).json({
            error: 'Fail to get order',
            details: error.message
        });
    }
});

app.patch('/shop/publisher/order/shipping' , async (req, res) => {
    try {
        const { order_id, tracking_number}  = req.body;
        if ( !order_id || !tracking_number) {
            return res.status(400).json({ error: 'Information all is required' });
        }
        await queryDatabase(`UPDATE order_list SET order_status='Shipped', status_time=current_timestamp(), tracking_number=?  WHERE order_id=?`, [tracking_number, order_id]);
        return res.status(200).json({message: "Status updated successfully"});
    }
    catch (error) {
        console.error('ERROR', error);
        res.status(500).json({
            error: 'Status update failed',
            details: error.message
        });
    }
});

app.patch('/shop/seller/order/shipping' , async (req, res) => {
    try {
        const { seller_order_id, tracking_number}  = req.body;
        if ( !seller_order_id || !tracking_number) {
            return res.status(400).json({ error: 'Information all is required' });
        }
        await queryDatabase(`UPDATE seller_order_list SET order_status='Shipped', status_time=current_timestamp(), tracking_number=?  WHERE seller_order_id=?`, [tracking_number, seller_order_id]);
        return res.status(200).json({message: "Status updated successfully"});
    }
    catch (error) {
        console.error('ERROR', error);
        res.status(500).json({
            error: 'Status update failed',
            details: error.message
        });
    }
});

app.post('/shop/buyer/order/getall' , async (req, res) => {
    try {
        const { user_id }  = req.body;

        if ( !user_id ) {
            return res.status(400).json({ error: 'Information all is required' });
        }
        const query_order = await queryDatabase("SELECT * FROM order_list WHERE user_id=?", [user_id]);
        const query_order_selleter = await queryDatabase("SELECT * FROM seller_order_list WHERE user_id=?", [user_id]);
        return res.status(200).json({publisher_order_all: query_order, seller_order_all:query_order_selleter});
    }
    catch (error) {
        console.error('ERROR', error);
        res.status(500).json({
            error: 'Fail to get order',
            details: error.message
        });
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
