/**
 * products.js - Product data and filtering logic
 */

export const PRODUCTS = [

  // ── Electronics (14) ──
  { id: 1,  name: "AirPods Pro Max",       category: "Electronics", price: 549,  originalPrice: 699,  rating: 4.9, reviews: 2847,  badge: "hot",  image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&q=80",  colors: ["#1a1a1a","#e8e8e8","#4a90d9"], stock: 15, description: "Premium wireless headphones with active noise cancellation and spatial audio." },
  { id: 4,  name: "Sony WH-1000XM5",       category: "Electronics", price: 349,  originalPrice: 399,  rating: 4.8, reviews: 3412,  badge: "sale", image: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=400&q=80",  colors: ["#1a1a1a","#c8b8a2"], stock: 20, description: "Industry-leading noise canceling headphones with 30-hour battery and multipoint connection." },
  { id: 5,  name: "iPhone 15 Pro",         category: "Electronics", price: 999,  originalPrice: 1099, rating: 4.9, reviews: 8934,  badge: "hot",  image: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400&q=80",  colors: ["#4a4a4a","#c8b8a2","#1a1a1a","#4a90d9"], stock: 45, description: "Pro-grade titanium design with A17 Pro chip, 48MP camera system, and USB-C." },
  { id: 7,  name: "Samsung 4K OLED TV",    category: "Electronics", price: 1799, originalPrice: 2199, rating: 4.7, reviews: 1245,  badge: "sale", image: "https://images.unsplash.com/photo-1461151304267-38535e780c79?w=400&q=80",  colors: ["#1a1a1a"], stock: 5, description: "65-inch OLED display with quantum dot technology, 120Hz refresh rate, and Dolby Vision." },
  { id: 11, name: "Apple Watch Ultra 2",   category: "Electronics", price: 799,  originalPrice: 899,  rating: 4.9, reviews: 1678,  badge: "new",  image: "https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=400&q=80",  colors: ["#c0c0c0","#1a1a1a","#f5c518"], stock: 18, description: "The most rugged Apple Watch with titanium case, precision GPS, and 60-hour battery." },
  { id: 13, name: "Kindle Paperwhite",     category: "Electronics", price: 139,  originalPrice: 159,  rating: 4.7, reviews: 9234,  badge: null,   image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&q=80",  colors: ["#1a1a1a","#e8e8e8"], stock: 50, description: "Waterproof e-reader with 6.8-inch glare-free display and weeks of battery life." },
  { id: 16, name: "Canon EOS R50",         category: "Electronics", price: 679,  originalPrice: 799,  rating: 4.7, reviews: 987,   badge: "new",  image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400&q=80",  colors: ["#1a1a1a","#e8e8e8"], stock: 10, description: "Compact mirrorless camera with 24.2MP sensor, 4K video, and AI-powered autofocus." },
  { id: 17, name: "Samsung Galaxy S24",    category: "Electronics", price: 899,  originalPrice: 999,  rating: 4.8, reviews: 4321,  badge: "new",  image: "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=400&q=80",  colors: ["#6c63ff","#f5c518","#1a1a1a"], stock: 30, description: "Galaxy AI-powered smartphone with 200MP camera and titanium frame." },
  { id: 18, name: "GoPro Hero 12",         category: "Electronics", price: 399,  originalPrice: 449,  rating: 4.6, reviews: 2103,  badge: null,   image: "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=400&q=80",  colors: ["#1a1a1a","#e63946"], stock: 22, description: "5.3K action camera with HyperSmooth 6.0 stabilization and waterproof design." },
  { id: 19, name: "JBL Charge 5",          category: "Electronics", price: 179,  originalPrice: 219,  rating: 4.7, reviews: 6712,  badge: "sale", image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&q=80",  colors: ["#e63946","#4a90d9","#2d6a4f","#1a1a1a"], stock: 40, description: "Portable Bluetooth speaker with 20-hour playtime and IP67 waterproof rating." },
  { id: 20, name: "iPad Pro 12.9\"",       category: "Electronics", price: 1099, originalPrice: 1299, rating: 4.8, reviews: 3156,  badge: "hot",  image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&q=80",  colors: ["#c0c0c0","#1a1a1a"], stock: 14, description: "M2-powered tablet with Liquid Retina XDR display and Apple Pencil support." },
  { id: 21, name: "Bose QuietComfort 45",  category: "Electronics", price: 279,  originalPrice: 329,  rating: 4.7, reviews: 4890,  badge: null,   image: "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400&q=80",  colors: ["#1a1a1a","#e8e8e8","#4a6fa5"], stock: 25, description: "Wireless headphones with world-class noise cancellation and 24-hour battery." },
  { id: 22, name: "DJI Mini 4 Pro Drone",  category: "Electronics", price: 759,  originalPrice: 899,  rating: 4.8, reviews: 1432,  badge: "new",  image: "https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=400&q=80",  colors: ["#e8e8e8","#1a1a1a"], stock: 8, description: "Foldable drone with 4K/60fps camera, 34-min flight time, and omnidirectional obstacle sensing." },
  { id: 23, name: "Anker 65W Charger",     category: "Electronics", price: 45,   originalPrice: 59,   rating: 4.6, reviews: 11234, badge: "sale", image: "https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=400&q=80",  colors: ["#1a1a1a","#ffffff"], stock: 100, description: "Compact 3-port GaN charger with PowerIQ 4.0 for fast charging all your devices." },

  // ── Computers (11) ──
  { id: 2,  name: "MacBook Air M3",        category: "Computers", price: 1299, originalPrice: 1499, rating: 4.8, reviews: 1923,  badge: "new",  image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&q=80",  colors: ["#c0c0c0","#f5e6c8","#1a1a1a"], stock: 8, description: "Ultra-thin laptop powered by Apple M3 chip with all-day battery life and Retina display." },
  { id: 24, name: "Dell XPS 15",           category: "Computers", price: 1599, originalPrice: 1899, rating: 4.7, reviews: 2341,  badge: "sale", image: "https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=400&q=80",  colors: ["#c0c0c0","#1a1a1a"], stock: 10, description: "15.6-inch OLED laptop with Intel Core i9, 32GB RAM, and NVIDIA RTX 4070." },
  { id: 25, name: "ASUS ROG Gaming PC",    category: "Computers", price: 2199, originalPrice: 2599, rating: 4.8, reviews: 876,   badge: "hot",  image: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=400&q=80",  colors: ["#1a1a1a","#e63946","#6c63ff"], stock: 6, description: "High-performance gaming desktop with RTX 4080, AMD Ryzen 9, and RGB lighting." },
  { id: 26, name: "LG UltraWide Monitor",  category: "Computers", price: 699,  originalPrice: 849,  rating: 4.6, reviews: 1567,  badge: null,   image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400&q=80",  colors: ["#1a1a1a"], stock: 15, description: "34-inch curved UltraWide QHD monitor with 144Hz refresh rate and HDR10." },
  { id: 27, name: "Logitech MX Master 3",  category: "Computers", price: 99,   originalPrice: 119,  rating: 4.8, reviews: 8923,  badge: null,   image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400&q=80",  colors: ["#1a1a1a","#c8b8a2","#4a6fa5"], stock: 55, description: "Advanced wireless mouse with MagSpeed scroll, ergonomic design, and 70-day battery." },
  { id: 28, name: "Mechanical Keyboard",   category: "Computers", price: 149,  originalPrice: 179,  rating: 4.7, reviews: 5432,  badge: "new",  image: "https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=400&q=80",  colors: ["#ffffff","#1a1a1a","#e63946","#f5c518"], stock: 35, description: "Tenkeyless mechanical keyboard with Cherry MX switches and per-key RGB backlighting." },
  { id: 29, name: "Samsung 2TB SSD",       category: "Computers", price: 179,  originalPrice: 219,  rating: 4.9, reviews: 12341, badge: "sale", image: "https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=400&q=80",  colors: ["#1a1a1a","#4a90d9"], stock: 60, description: "NVMe SSD with 7,000MB/s read speed and 5-year warranty for blazing-fast storage." },
  { id: 30, name: "iPad Pro Keyboard",     category: "Computers", price: 299,  originalPrice: 349,  rating: 4.5, reviews: 2109,  badge: null,   image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400&q=80",  colors: ["#c0c0c0","#1a1a1a"], stock: 20, description: "Magic Keyboard with trackpad and backlit keys for iPad Pro and iPad Air." },
  { id: 31, name: "Razer DeathAdder V3",   category: "Computers", price: 69,   originalPrice: 89,   rating: 4.7, reviews: 7654,  badge: null,   image: "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=400&q=80",  colors: ["#1a1a1a","#e63946"], stock: 45, description: "Ergonomic gaming mouse with 30K DPI optical sensor and 90-hour battery life." },
  { id: 32, name: "HP Spectre x360",       category: "Computers", price: 1449, originalPrice: 1699, rating: 4.6, reviews: 1234,  badge: "new",  image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&q=80",  colors: ["#1a1a1a","#4a6fa5","#c8a96e"], stock: 9, description: "2-in-1 convertible laptop with OLED display, Intel Evo platform, and 360° hinge." },
  { id: 33, name: "USB-C Hub 10-in-1",     category: "Computers", price: 59,   originalPrice: 79,   rating: 4.6, reviews: 9871,  badge: "sale", image: "https://images.unsplash.com/photo-1625842268584-8f3296236761?w=400&q=80",  colors: ["#c0c0c0","#1a1a1a"], stock: 80, description: "Multiport USB-C hub with 4K HDMI, 100W PD, SD card reader, and Gigabit Ethernet." },

  // ── Clothing (12) ──
  { id: 6,  name: "Levi's 501 Jeans",      category: "Clothing", price: 89,  originalPrice: 120, rating: 4.5, reviews: 7823,  badge: "sale", image: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&q=80", colors: ["#4a6fa5","#1a1a1a","#8b7355"], stock: 60, description: "The original straight-fit jeans crafted from premium denim with a timeless silhouette." },
  { id: 12, name: "Patagonia Fleece Jacket",category: "Clothing", price: 229, originalPrice: 279, rating: 4.7, reviews: 2341,  badge: null,   image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=400&q=80", colors: ["#2d6a4f","#1a1a1a","#e63946","#4a6fa5"], stock: 25, description: "Sustainable fleece jacket made from recycled materials with DWR finish." },
  { id: 34, name: "Nike Dri-FIT T-Shirt",   category: "Clothing", price: 35,  originalPrice: 45,  rating: 4.6, reviews: 14532, badge: "sale", image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&q=80", colors: ["#e63946","#4a90d9","#2d6a4f","#1a1a1a","#ffffff"], stock: 120, description: "Lightweight performance tee with sweat-wicking fabric for training and everyday wear." },
  { id: 35, name: "Zara Floral Dress",      category: "Clothing", price: 79,  originalPrice: 99,  rating: 4.5, reviews: 3421,  badge: "new",  image: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=400&q=80", colors: ["#e63946","#f5c518","#4a6fa5"], stock: 40, description: "Elegant floral midi dress with adjustable straps and flowy silhouette." },
  { id: 36, name: "H&M Oversized Hoodie",   category: "Clothing", price: 49,  originalPrice: 65,  rating: 4.4, reviews: 8901,  badge: null,   image: "https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=400&q=80", colors: ["#c8b8a2","#1a1a1a","#e63946","#4a6fa5"], stock: 75, description: "Cozy oversized hoodie in soft cotton blend with kangaroo pocket." },
  { id: 37, name: "Tommy Hilfiger Polo",    category: "Clothing", price: 69,  originalPrice: 89,  rating: 4.6, reviews: 5678,  badge: null,   image: "https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=400&q=80", colors: ["#ffffff","#4a90d9","#e63946","#2d6a4f"], stock: 55, description: "Classic piqué polo shirt with embroidered logo and slim fit cut." },
  { id: 38, name: "Leather Biker Jacket",   category: "Clothing", price: 299, originalPrice: 399, rating: 4.8, reviews: 1987,  badge: "hot",  image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&q=80", colors: ["#1a1a1a","#8b4513","#c8b8a2"], stock: 18, description: "Genuine leather biker jacket with asymmetric zip and quilted lining." },
  { id: 39, name: "Adidas Track Pants",     category: "Clothing", price: 65,  originalPrice: 85,  rating: 4.5, reviews: 6234,  badge: "sale", image: "https://images.unsplash.com/photo-1552902865-b72c031ac5ea?w=400&q=80", colors: ["#1a1a1a","#4a90d9","#e63946"], stock: 65, description: "Classic 3-stripe track pants in recycled polyester with tapered fit." },
  { id: 40, name: "Linen Summer Shirt",     category: "Clothing", price: 55,  originalPrice: 75,  rating: 4.4, reviews: 2876,  badge: null,   image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400&q=80", colors: ["#ffffff","#c8b8a2","#4a6fa5","#2d6a4f"], stock: 48, description: "Breathable linen shirt with relaxed fit, perfect for warm weather." },
  { id: 41, name: "Wool Blend Coat",        category: "Clothing", price: 349, originalPrice: 449, rating: 4.7, reviews: 1543,  badge: "new",  image: "https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=400&q=80", colors: ["#c8b8a2","#1a1a1a","#8b4513"], stock: 20, description: "Tailored wool-blend overcoat with notch lapels and double-breasted buttons." },
  { id: 42, name: "Yoga Leggings",          category: "Clothing", price: 58,  originalPrice: 78,  rating: 4.8, reviews: 9123,  badge: "hot",  image: "https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=400&q=80", colors: ["#1a1a1a","#6c63ff","#e63946","#2d6a4f"], stock: 90, description: "High-waist compression leggings with 4-way stretch and moisture-wicking fabric." },
  { id: 43, name: "Denim Jacket",           category: "Clothing", price: 99,  originalPrice: 129, rating: 4.6, reviews: 4321,  badge: null,   image: "https://images.unsplash.com/photo-1576871337622-98d48d1cf531?w=400&q=80", colors: ["#4a6fa5","#1a1a1a","#8b7355"], stock: 38, description: "Classic denim jacket with button-front closure and chest pockets." },

  // ── Footwear (11) ──
  { id: 3,  name: "Nike Air Jordan 1",     category: "Footwear", price: 180, originalPrice: 220, rating: 4.7, reviews: 5621,  badge: "sale", image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80", colors: ["#e63946","#1a1a1a","#ffffff"], stock: 32, description: "Iconic basketball sneakers with premium leather upper and Air cushioning." },
  { id: 8,  name: "Adidas Ultraboost 23",  category: "Footwear", price: 190, originalPrice: 230, rating: 4.6, reviews: 4521,  badge: "new",  image: "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=400&q=80", colors: ["#ffffff","#1a1a1a","#e63946"], stock: 28, description: "High-performance running shoes with Boost midsole for maximum energy return." },
  { id: 44, name: "Converse Chuck Taylor",  category: "Footwear", price: 65,  originalPrice: 80,  rating: 4.5, reviews: 18923, badge: null,   image: "https://images.unsplash.com/photo-1463100099107-aa0980c362e6?w=400&q=80", colors: ["#ffffff","#1a1a1a","#e63946","#4a90d9"], stock: 80, description: "Timeless canvas high-top sneakers with vulcanized rubber sole." },
  { id: 45, name: "Vans Old Skool",        category: "Footwear", price: 70,  originalPrice: 85,  rating: 4.6, reviews: 12456, badge: "sale", image: "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=400&q=80", colors: ["#1a1a1a","#ffffff","#e63946","#4a6fa5"], stock: 65, description: "Classic skate shoe with signature side stripe and padded collar." },
  { id: 46, name: "New Balance 574",       category: "Footwear", price: 89,  originalPrice: 110, rating: 4.7, reviews: 8765,  badge: null,   image: "https://images.unsplash.com/photo-1539185441755-769473a23570?w=400&q=80", colors: ["#c8b8a2","#2d6a4f","#e63946","#4a90d9"], stock: 50, description: "Retro-inspired lifestyle sneaker with ENCAP midsole cushioning." },
  { id: 47, name: "Timberland Boots",      category: "Footwear", price: 198, originalPrice: 240, rating: 4.8, reviews: 6543,  badge: "hot",  image: "https://images.unsplash.com/photo-1520639888713-7851133b1ed0?w=400&q=80", colors: ["#c8a96e","#1a1a1a","#8b4513"], stock: 30, description: "Waterproof premium leather boots with anti-fatigue technology." },
  { id: 48, name: "Puma RS-X Sneakers",    category: "Footwear", price: 110, originalPrice: 140, rating: 4.5, reviews: 3421,  badge: "new",  image: "https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=400&q=80", colors: ["#ffffff","#e63946","#4a90d9","#f5c518"], stock: 42, description: "Bold chunky sneaker with RS cushioning and retro-futuristic design." },
  { id: 49, name: "Birkenstock Arizona",   category: "Footwear", price: 99,  originalPrice: 120, rating: 4.6, reviews: 7234,  badge: null,   image: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=400&q=80", colors: ["#c8a96e","#1a1a1a","#8b7355"], stock: 55, description: "Classic two-strap sandal with contoured cork footbed for all-day comfort." },
  { id: 50, name: "Nike Air Max 270",      category: "Footwear", price: 150, originalPrice: 180, rating: 4.7, reviews: 9876,  badge: "sale", image: "https://images.unsplash.com/photo-1514989940723-e8e51635b782?w=400&q=80", colors: ["#1a1a1a","#ffffff","#e63946","#f5c518"], stock: 38, description: "Lifestyle sneaker with the largest Air unit yet for all-day cushioning." },
  { id: 51, name: "Dr. Martens 1460",      category: "Footwear", price: 170, originalPrice: 200, rating: 4.7, reviews: 5432,  badge: null,   image: "https://images.unsplash.com/photo-1605812860427-4024433a70fd?w=400&q=80", colors: ["#1a1a1a","#8b4513","#e63946"], stock: 25, description: "Iconic 8-eye leather boots with air-cushioned sole and yellow welt stitching." },
  { id: 52, name: "Crocs Classic Clog",    category: "Footwear", price: 49,  originalPrice: 59,  rating: 4.4, reviews: 22341, badge: "hot",  image: "https://images.unsplash.com/photo-1603487742131-4160ec999306?w=400&q=80", colors: ["#e63946","#f5c518","#4a90d9","#2d6a4f","#ffffff"], stock: 100, description: "Lightweight, comfortable clog with Croslite foam and ventilation ports." },

  // ── Home & Kitchen (11) ──
  { id: 9,  name: "Dyson V15 Detect",      category: "Home", price: 749, originalPrice: 849, rating: 4.8, reviews: 2156,  badge: "hot",  image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80", colors: ["#f5c518","#1a1a1a"], stock: 12, description: "Intelligent cordless vacuum with laser dust detection and HEPA filtration." },
  { id: 14, name: "Instant Pot Duo 7-in-1", category: "Home", price: 99,  originalPrice: 129, rating: 4.8, reviews: 15234, badge: "hot",  image: "https://images.unsplash.com/photo-1585515320310-259814833e62?w=400&q=80", colors: ["#c0c0c0","#1a1a1a"], stock: 35, description: "Multi-use pressure cooker that replaces 7 kitchen appliances with smart programs." },
  { id: 53, name: "Nespresso Vertuo Pop",   category: "Home", price: 149, originalPrice: 199, rating: 4.7, reviews: 8765,  badge: "sale", image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&q=80", colors: ["#e63946","#1a1a1a","#4a90d9","#2d6a4f"], stock: 28, description: "Compact coffee machine with centrifusion technology for barista-quality coffee." },
  { id: 54, name: "KitchenAid Stand Mixer", category: "Home", price: 449, originalPrice: 549, rating: 4.9, reviews: 12341, badge: "hot",  image: "https://images.unsplash.com/photo-1594385208974-2e75f8d7bb48?w=400&q=80", colors: ["#e63946","#f5c518","#4a90d9","#c0c0c0","#1a1a1a"], stock: 15, description: "Iconic tilt-head stand mixer with 10 speeds and 5-quart stainless steel bowl." },
  { id: 55, name: "Philips Air Fryer XXL",  category: "Home", price: 249, originalPrice: 299, rating: 4.7, reviews: 9876,  badge: "sale", image: "https://images.unsplash.com/photo-1648170645898-e0a0e5e5e5e5?w=400&q=80", colors: ["#1a1a1a","#e8e8e8"], stock: 22, description: "7.3L air fryer with Rapid Air technology for crispy results with 90% less fat." },
  { id: 56, name: "Dyson Pure Cool Fan",    category: "Home", price: 549, originalPrice: 649, rating: 4.6, reviews: 3421,  badge: null,   image: "https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=400&q=80", colors: ["#c0c0c0","#4a90d9","#f5c518"], stock: 10, description: "Air purifier and fan with HEPA H13 filter and 350° oscillation." },
  { id: 57, name: "Le Creuset Dutch Oven",  category: "Home", price: 399, originalPrice: 479, rating: 4.9, reviews: 6543,  badge: null,   image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&q=80", colors: ["#e63946","#f5c518","#4a90d9","#2d6a4f","#1a1a1a"], stock: 18, description: "Enameled cast iron Dutch oven for braising, roasting, and baking." },
  { id: 58, name: "Roomba i7+ Robot",       category: "Home", price: 599, originalPrice: 799, rating: 4.7, reviews: 4321,  badge: "sale", image: "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&q=80", colors: ["#1a1a1a","#c0c0c0"], stock: 8, description: "Self-emptying robot vacuum with smart mapping and automatic dirt disposal." },
  { id: 59, name: "Vitamix Blender",        category: "Home", price: 449, originalPrice: 549, rating: 4.8, reviews: 7654,  badge: "hot",  image: "https://images.unsplash.com/photo-1570197788417-0e82375c9371?w=400&q=80", colors: ["#e63946","#1a1a1a","#c0c0c0"], stock: 14, description: "Professional-grade blender with aircraft-grade stainless steel blades." },
  { id: 60, name: "Himalayan Salt Lamp",    category: "Home", price: 39,  originalPrice: 55,  rating: 4.5, reviews: 11234, badge: null,   image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400&q=80", colors: ["#e63946","#f5c518","#c8a96e"], stock: 60, description: "Natural Himalayan pink salt lamp with warm amber glow and wooden base." },
  { id: 61, name: "Philips Hue Starter Kit",category: "Home", price: 199, originalPrice: 249, rating: 4.7, reviews: 5432,  badge: "new",  image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80", colors: ["#f5c518","#e63946","#4a90d9","#2d6a4f"], stock: 30, description: "Smart LED bulb starter kit with Bridge for 16 million colors and voice control." },

  // ── Accessories (11) ──
  { id: 10, name: "Ray-Ban Aviator",        category: "Accessories", price: 163, originalPrice: 195, rating: 4.6, reviews: 3892,  badge: null,   image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&q=80", colors: ["#c8a96e","#1a1a1a","#c0c0c0"], stock: 40, description: "Classic aviator sunglasses with polarized lenses and lightweight metal frame." },
  { id: 15, name: "Fossil Gen 6 Watch",     category: "Accessories", price: 299, originalPrice: 349, rating: 4.4, reviews: 1823,  badge: null,   image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&q=80", colors: ["#c0c0c0","#c8a96e","#1a1a1a"], stock: 22, description: "Smartwatch with Wear OS, health tracking, and classic leather strap design." },
  { id: 62, name: "Louis Vuitton Belt",     category: "Accessories", price: 450, originalPrice: 520, rating: 4.7, reviews: 2341,  badge: "hot",  image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&q=80", colors: ["#c8a96e","#1a1a1a"], stock: 12, description: "Iconic monogram canvas belt with gold-tone LV buckle." },
  { id: 63, name: "Herschel Backpack",      category: "Accessories", price: 89,  originalPrice: 110, rating: 4.6, reviews: 8765,  badge: "sale", image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&q=80", colors: ["#1a1a1a","#4a6fa5","#e63946","#2d6a4f"], stock: 45, description: "Classic 30L backpack with laptop sleeve and signature stripe lining." },
  { id: 64, name: "Polaroid Sunglasses",    category: "Accessories", price: 49,  originalPrice: 69,  rating: 4.5, reviews: 5432,  badge: "sale", image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=400&q=80", colors: ["#1a1a1a","#c8a96e","#e63946","#4a90d9"], stock: 70, description: "Polarized UV400 sunglasses with lightweight TR90 frame." },
  { id: 65, name: "Leather Wallet",         category: "Accessories", price: 79,  originalPrice: 99,  rating: 4.7, reviews: 9123,  badge: null,   image: "https://images.unsplash.com/photo-1627123424574-724758594e93?w=400&q=80", colors: ["#8b4513","#1a1a1a","#c8a96e"], stock: 55, description: "Slim bifold wallet in full-grain leather with RFID blocking protection." },
  { id: 66, name: "Casio G-Shock Watch",    category: "Accessories", price: 129, originalPrice: 159, rating: 4.8, reviews: 12341, badge: "hot",  image: "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=400&q=80", colors: ["#1a1a1a","#e63946","#f5c518","#4a90d9"], stock: 35, description: "Shock-resistant watch with 200m water resistance and solar charging." },
  { id: 67, name: "Silk Scarf",             category: "Accessories", price: 65,  originalPrice: 85,  rating: 4.5, reviews: 3456,  badge: "new",  image: "https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=400&q=80", colors: ["#e63946","#f5c518","#4a6fa5","#2d6a4f"], stock: 48, description: "100% pure silk scarf with vibrant print, versatile for any occasion." },
  { id: 68, name: "Tote Bag Canvas",        category: "Accessories", price: 35,  originalPrice: 49,  rating: 4.4, reviews: 6789,  badge: null,   image: "https://images.unsplash.com/photo-1544816155-12df9643f363?w=400&q=80", colors: ["#ffffff","#1a1a1a","#c8b8a2","#e63946"], stock: 90, description: "Durable canvas tote with interior zip pocket and reinforced handles." },
  { id: 69, name: "Titanium Bracelet",      category: "Accessories", price: 149, originalPrice: 189, rating: 4.6, reviews: 2109,  badge: null,   image: "https://images.unsplash.com/photo-1573408301185-9519f94816b5?w=400&q=80", colors: ["#c0c0c0","#c8a96e","#1a1a1a"], stock: 28, description: "Lightweight titanium link bracelet with magnetic clasp closure." },
  { id: 70, name: "Perfume Gift Set",       category: "Accessories", price: 199, originalPrice: 249, rating: 4.8, reviews: 4321,  badge: "hot",  image: "https://images.unsplash.com/photo-1541643600914-78b084683702?w=400&q=80", colors: ["#c8a96e","#e63946","#4a90d9"], stock: 20, description: "Luxury fragrance gift set with 3 signature scents in elegant packaging." },

];

export const CATEGORIES = [
  { id: "electronics", name: "Electronics",   icon: "💻", count: 14, color: "#6c63ff", image: "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400&q=80" },
  { id: "clothing",    name: "Clothing",       icon: "👕", count: 12, color: "#ff6584", image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&q=80" },
  { id: "footwear",    name: "Footwear",       icon: "👟", count: 11, color: "#43e97b", image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80" },
  { id: "home",        name: "Home & Kitchen", icon: "🏠", count: 11, color: "#f7971e", image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&q=80" },
  { id: "accessories", name: "Accessories",    icon: "⌚", count: 11, color: "#4facfe", image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&q=80" },
  { id: "computers",   name: "Computers",      icon: "🖥️", count: 11, color: "#a18cd1", image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&q=80" }
];

/**
 * Filter products by criteria
 */
export function filterProducts({ category, minPrice, maxPrice, minRating, search, sort } = {}) {
  let results = [...PRODUCTS];

  if (category && category !== "all") {
    results = results.filter(p => p.category.toLowerCase() === category.toLowerCase());
  }
  if (minPrice !== undefined) results = results.filter(p => p.price >= minPrice);
  if (maxPrice !== undefined) results = results.filter(p => p.price <= maxPrice);
  if (minRating !== undefined) results = results.filter(p => p.rating >= minRating);

  if (search) {
    const q = search.toLowerCase();
    results = results.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q)
    );
  }

  switch (sort) {
    case "price-asc":  results.sort((a, b) => a.price - b.price); break;
    case "price-desc": results.sort((a, b) => b.price - a.price); break;
    case "rating":     results.sort((a, b) => b.rating - a.rating); break;
    case "newest":     results.sort((a, b) => b.id - a.id); break;
    case "popular":    results.sort((a, b) => b.reviews - a.reviews); break;
    default: break;
  }

  return results;
}

export function getProductById(id) {
  return PRODUCTS.find(p => p.id === Number(id)) || null;
}

export function getRelatedProducts(product, limit = 4) {
  return PRODUCTS
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, limit);
}

export function renderStars(rating) {
  const full  = Math.floor(rating);
  const half  = rating % 1 >= 0.5 ? 1 : 0;
  const empty = 5 - full - half;
  return '★'.repeat(full) + (half ? '½' : '') + '☆'.repeat(empty);
}

export function formatPrice(price) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(price);
}

export function discountPercent(price, original) {
  return Math.round((1 - price / original) * 100);
}

export function buildProductCard(product, wishlist = []) {
  const isWished = wishlist.includes(product.id);
  const discount = product.originalPrice ? discountPercent(product.price, product.originalPrice) : 0;

  return `
    <article class="product-card reveal" data-id="${product.id}" role="article" aria-label="${product.name}">
      <div class="product-card__image-wrap">
        <img
          class="product-card__image"
          src="${product.image}"
          alt="${product.name}"
          loading="lazy"
          width="400" height="400"
        />
        <div class="product-card__badges">
          ${product.badge ? `<span class="badge badge-${product.badge}">${product.badge.toUpperCase()}</span>` : ''}
          ${discount > 0 ? `<span class="badge badge-sale">-${discount}%</span>` : ''}
        </div>
        <div class="product-card__actions">
          <button
            class="product-card__action-btn wishlist-btn ${isWished ? 'active' : ''}"
            data-id="${product.id}"
            aria-label="${isWished ? 'Remove from wishlist' : 'Add to wishlist'}"
            title="Wishlist"
          >♥</button>
          <button
            class="product-card__action-btn quickview-btn"
            data-id="${product.id}"
            aria-label="Quick view ${product.name}"
            title="Quick View"
          >👁</button>
        </div>
      </div>
      <div class="product-card__body">
        <div class="product-card__category">${product.category}</div>
        <h3 class="product-card__name">
          <a href="product.html?id=${product.id}">${product.name}</a>
        </h3>
        <div class="product-card__rating">
          <div class="stars" aria-label="Rating: ${product.rating} out of 5">${renderStars(product.rating)}</div>
          <span class="rating-count">(${product.reviews.toLocaleString()})</span>
        </div>
        <div class="product-card__footer">
          <div class="product-card__price">
            <span class="price-current">${formatPrice(product.price)}</span>
            ${product.originalPrice ? `<span class="price-original">${formatPrice(product.originalPrice)}</span>` : ''}
          </div>
          <button
            class="product-card__add-btn add-to-cart-btn"
            data-id="${product.id}"
            aria-label="Add ${product.name} to cart"
            title="Add to Cart"
          >+</button>
        </div>
      </div>
    </article>
  `;
}
