import { readJSONFile, writeJSONFile, getNextId } from '../models/jsonDb.js';

const PRODUCTS_FILE = 'products.json';

// Get all products
export const getAllProducts = async (req, res) => {
    try {
        const products = await readJSONFile(PRODUCTS_FILE);
        res.json({
            success: true,
            data: products,
            count: products.length
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching products',
            error: error.message
        });
    }
};

// Get product by ID
export const getProductById = async (req, res) => {
    try {
        const products = await readJSONFile(PRODUCTS_FILE);
        const product = products.find(p => p.id === parseInt(req.params.id));
        
        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }
        
        res.json({
            success: true,
            data: product
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching product',
            error: error.message
        });
    }
};

// Create new product
export const createProduct = async (req, res) => {
    try {
        const { name, description, price, stock } = req.body;
        
        if (!name || price === undefined) {
            return res.status(400).json({
                success: false,
                message: 'Name and price are required fields'
            });
        }
        
        const products = await readJSONFile(PRODUCTS_FILE);
        
        const newProduct = {
            id: getNextId(products),
            name,
            description: description || null,
            price: parseFloat(price),
            stock: stock !== undefined ? parseInt(stock) : 0,
            createdAt: new Date().toISOString()
        };
        
        products.push(newProduct);
        await writeJSONFile(PRODUCTS_FILE, products);
        
        res.status(201).json({
            success: true,
            message: 'Product created successfully',
            data: newProduct
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error creating product',
            error: error.message
        });
    }
};

// Update product
export const updateProduct = async (req, res) => {
    try {
        const { name, description, price, stock } = req.body;
        const productId = parseInt(req.params.id);
        
        const products = await readJSONFile(PRODUCTS_FILE);
        const productIndex = products.findIndex(p => p.id === productId);
        
        if (productIndex === -1) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }
        
        products[productIndex] = {
            ...products[productIndex],
            name: name || products[productIndex].name,
            description: description !== undefined ? description : products[productIndex].description,
            price: price !== undefined ? parseFloat(price) : products[productIndex].price,
            stock: stock !== undefined ? parseInt(stock) : products[productIndex].stock
        };
        
        await writeJSONFile(PRODUCTS_FILE, products);
        
        res.json({
            success: true,
            message: 'Product updated successfully',
            data: products[productIndex]
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error updating product',
            error: error.message
        });
    }
};

// Delete product
export const deleteProduct = async (req, res) => {
    try {
        const productId = parseInt(req.params.id);
        const products = await readJSONFile(PRODUCTS_FILE);
        const productIndex = products.findIndex(p => p.id === productId);
        
        if (productIndex === -1) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }
        
        products.splice(productIndex, 1);
        await writeJSONFile(PRODUCTS_FILE, products);
        
        res.json({
            success: true,
            message: 'Product deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error deleting product',
            error: error.message
        });
    }
};
