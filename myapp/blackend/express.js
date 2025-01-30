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
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

const pool = mysql.createPool({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '',
    database: 'books',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
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

        let sql;
        let params = [];
        let shouldModifyCategory = false;

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
        } else {
            sql = 'SELECT * FROM book_detail WHERE serie_id = ? OR book_id IN (SELECT MIN(book_id) FROM book_detail WHERE serie_id != ? GROUP BY serie_id)';
            params = [1, 1];
            shouldModifyCategory = true;
        }

        const books = await queryDatabase(sql, params);

        if (shouldModifyCategory) {
            const modifiedBooks = books.map(book => {
                if (typeof book.book_category === 'string' && book.book_category) {
                    book.book_category = book.book_category.split(',').map(s => s.trim());
                } else {
                    book.book_category = [];
                }
                return book;
            });

            res.json(modifiedBooks);
        }
        else if (Array.isArray(books) && books.length > 0 && bookId) {
            res.json(books[0]);
        } else {
            res.json(books);
        }
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
            const bookData = req.body;
            const sql = 'INSERT INTO book_detail SET ?';
            const result = await queryDatabase(sql, [bookData]);
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
        const sql = 'UPDATE book_detail SET ? WHERE book_id = ?';
        const result = await queryDatabase(sql, [bookData, bookId]);

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

        const updateSql = 'UPDATE book SET book_score = ? WHERE book_id = ?';
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

app.post('/user/register', async (req, res) => {
    try {
        const { user_email, user_name, user_pass, user_phone } = req.body;

        if (!user_email || !user_name || !user_pass || !user_phone) {
            return res.status(400).json({
                error: 'All fields are required',
                details: {
                    email: !user_email ? 'Email is required' : null,
                    username: !user_name ? 'Username is required' : null,
                    password: !user_pass ? 'Password is required' : null,
                    phone: !user_phone ? 'Phone number is required' : null
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
        const insertUserSql = 'INSERT INTO user (user_email, user_name, user_pass, user_phone, user_permission, user_image) VALUES (?, ?, ?, ?, ?, ?)';
        await queryDatabase(insertUserSql, [
            user_email,
            user_name,
            passwordHash,
            user_phone,
            '3',
            'https://i.imgur.com/tdrsXyg.jpeg'
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

app.post('/user/change/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { user_id, data, password } = req.body;
        const findUserSql = 'SELECT * FROM user WHERE user_id = ?';
        const users = await queryDatabase(findUserSql, [user_id]);

        if (users.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        const user = users[0];
        const match = await bcrypt.compare(password, user.user_pass);

        if (!match) {
            return res.status(401).json({ error: 'Invalid password' });
        }
        if (id === 'user_name' || id === 'user_email') {
            const column = id === 'user_name' ? 'user_name' : 'user_email';
            const existingUserSql = `SELECT * FROM user WHERE ${column} = ?`;
            const existingUser = await queryDatabase(existingUserSql, [data]);
            if (existingUser.length > 0) {
                return res.status(409).json({ error: `${column === 'user_name' ? 'Username' : 'Email'} already exists` });
            }
        }

        let updateData = data;
        if (id === 'user_pass') {
            updateData = await bcrypt.hash(data, 8);
        }

        const updateUserSql = `UPDATE user SET ${id} = ? WHERE user_id = ?`;
        await queryDatabase(updateUserSql, [updateData, user_id]);

        const updatedUserSql = 'SELECT * FROM user WHERE user_id = ?';
        const updatedUsers = await queryDatabase(updatedUserSql, [user_id]);
        const updatedUser = updatedUsers[0];

        const token = jwt.sign(
            {
                user_id: updatedUser.user_id,
                user_name: updatedUser.user_name,
                user_permission: updatedUser.user_permission,
            },
            'itkmitl',
            { expiresIn: '30d' }
        );

        res.json({ message: 'User information updated successfully', userToken: token, name_user: updatedUser.user_name });
    } catch (error) {
        console.error('Error updating user information:', error);
        res.status(500).json({ error: 'Failed to update user information' });
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


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});