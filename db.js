var db;
var DB_NAME = 'SweetCakesPOS';
var DB_VERSION = 1;

function initDB() {
    return new Promise(function(resolve, reject) {
        var request = indexedDB.open(DB_NAME, DB_VERSION);
        
        request.onerror = function() {
            reject('Database failed to open');
        };
        
        request.onsuccess = function() {
            db = request.result;
            console.log('Database opened successfully');
            
            // 초기 데이터 확인
            getAllProducts().then(function(products) {
                if (products.length === 0) {
                    // 초기 상품 데이터 삽입
                    var initialProducts = [
                        { name: 'Chocolate Cake', price: 850, stock: 25, category: 'Chocolate' },
                        { name: 'Vanilla Cake', price: 750, stock: 30, category: 'Vanilla' },
                        { name: 'Red Velvet', price: 950, stock: 20, category: 'Specialty' },
                        { name: 'Strawberry Cake', price: 900, stock: 18, category: 'Fruit' },
                        { name: 'Cheesecake', price: 1050, stock: 15, category: 'Specialty' },
                        { name: 'Carrot Cake', price: 800, stock: 22, category: 'Specialty' },
                        { name: 'Tiramisu', price: 1100, stock: 12, category: 'Specialty' },
                        { name: 'Black Forest', price: 950, stock: 16, category: 'Chocolate' }
                    ];
                    
                    var promises = initialProducts.map(function(p) {
                        return saveProduct(p);
                    });
                    
                    return Promise.all(promises);
                }
            }).then(function() {
                resolve();
            });
        };
        
        request.onupgradeneeded = function(e) {
            db = e.target.result;
            
            // Products 테이블
            if (!db.objectStoreNames.contains('products')) {
                var productsStore = db.createObjectStore('products', { keyPath: 'id', autoIncrement: true });
                productsStore.createIndex('name', 'name', { unique: false });
                productsStore.createIndex('category', 'category', { unique: false });
            }
            
            // Sales 테이블
            if (!db.objectStoreNames.contains('sales')) {
                var salesStore = db.createObjectStore('sales', { keyPath: 'id', autoIncrement: true });
                salesStore.createIndex('date', 'date', { unique: false });
            }
            
            console.log('Database setup complete');
        };
    });
}

// Products CRUD
function saveProduct(product) {
    return new Promise(function(resolve, reject) {
        var transaction = db.transaction(['products'], 'readwrite');
        var store = transaction.objectStore('products');
        var request = store.add(product);
        
        request.onsuccess = function() {
            resolve(request.result);
        };
        request.onerror = function() {
            reject('Error saving product');
        };
    });
}

function getProduct(id) {
    return new Promise(function(resolve, reject) {
        var transaction = db.transaction(['products'], 'readonly');
        var store = transaction.objectStore('products');
        var request = store.get(id);
        
        request.onsuccess = function() {
            resolve(request.result);
        };
        request.onerror = function() {
            reject('Error getting product');
        };
    });
}

function getAllProducts() {
    return new Promise(function(resolve, reject) {
        var transaction = db.transaction(['products'], 'readonly');
        var store = transaction.objectStore('products');
        var request = store.getAll();
        
        request.onsuccess = function() {
            resolve(request.result);
        };
        request.onerror = function() {
            reject('Error getting products');
        };
    });
}

function updateProduct(product) {
    return new Promise(function(resolve, reject) {
        var transaction = db.transaction(['products'], 'readwrite');
        var store = transaction.objectStore('products');
        var request = store.put(product);
        
        request.onsuccess = function() {
            resolve(request.result);
        };
        request.onerror = function() {
            reject('Error updating product');
        };
    });
}

function deleteProduct(id) {
    return new Promise(function(resolve, reject) {
        var transaction = db.transaction(['products'], 'readwrite');
        var store = transaction.objectStore('products');
        var request = store.delete(id);
        
        request.onsuccess = function() {
            resolve();
        };
        request.onerror = function() {
            reject('Error deleting product');
        };
    });
}

// Sales CRUD
function addSale(sale) {
    return new Promise(function(resolve, reject) {
        var transaction = db.transaction(['sales'], 'readwrite');
        var store = transaction.objectStore('sales');
        var request = store.add(sale);
        
        request.onsuccess = function() {
            resolve(request.result);
        };
        request.onerror = function() {
            reject('Error saving sale');
        };
    });
}

function getAllSales() {
    return new Promise(function(resolve, reject) {
        var transaction = db.transaction(['sales'], 'readonly');
        var store = transaction.objectStore('sales');
        var request = store.getAll();
        
        request.onsuccess = function() {
            resolve(request.result);
        };
        request.onerror = function() {
            reject('Error getting sales');
        };
    });
}
