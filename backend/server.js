const express = require('express');
const cors = require('cors');
const path = require('path');
const nodemailer = require('nodemailer');

const app = express();
const PORT = process.env.PORT || 8800;

// Express 5: 명시적 CORS origin 설정 (와일드카드 금지)
app.use(cors({
    origin: [
        'http://localhost:3800',
        'http://localhost:5173',
        'https://decarbon-five.vercel.app',
        'https://decarva.co.kr',
        'https://www.decarva.co.kr',
        'http://decarva.co.kr',
        'http://www.decarva.co.kr'
    ],
    credentials: true
}));
app.use(express.json());

// Serve static files from the React app
app.use(express.static(path.join(__dirname, '../frontend/dist')));

// Mutable news data
let news = [
    {
        id: 1,
        title: "IMO 환경 규제 강화: 탄소 집약도 지수(CII) 본격화",
        summary: "국제해사기구(IMO)의 탄소 배출 규제가 강화됨에 따라 해운사들의 친환경 선박 전환 속도가 빨라지고 있습니다. 새로운 CII 등급 제도가 선박 가치에 미치는 영향 분석.",
        image: "https://images.unsplash.com/photo-1544256718-3bcf237f3974?q=80&w=1000&auto=format&fit=crop",
        link: "https://www.imo.org",
        source: "Maritime News",
        date: "2024-03-15",
        category: "Shipping"
    },
    {
        id: 2,
        title: "LNG 추진선 수요 급증... 국내 조선업계 수주 호황",
        summary: "친환경 연료 선박에 대한 글로벌 수요가 늘어나며 한국 조선사들이 LNG 운반선 및 추진선 수주를 독식하고 있습니다. K-조선의 기술 경쟁력 조명.",
        image: "https://images.unsplash.com/photo-1494412519320-aa613dfb7738?q=80&w=1000&auto=format&fit=crop",
        link: "https://www.kdnd.co.kr",
        source: "Shipbuilding Times",
        date: "2024-03-14",
        category: "Shipbuilding"
    },
    {
        id: 3,
        title: "자율운항 선박 실증 성공... 해운 IT의 미래",
        summary: "해상에서 인공지능(AI) 기반의 자율운항 기술이 성공적으로 실증되었습니다. 선원 부족 문제 해결과 안전 운항의 획기적인 전환점 예상.",
        image: "https://images.unsplash.com/photo-1567427018141-0584f1bcd1b3?q=80&w=1000&auto=format&fit=crop",
        link: "https://www.maritimeit.com",
        source: "Tech Marine",
        date: "2024-03-13",
        category: "IT"
    },
    {
        id: 4,
        title: "EU ETS 해운 분야 적용... 탄소 비용 부담 현실화",
        summary: "유럽연합의 탄소배출권거래제(EU ETS)가 해운 분야로 확대 적용되면서 해운사들의 운영 비용 부담이 커지고 있습니다. 향후 대응 전략 분석.",
        image: "https://images.unsplash.com/photo-1517482754388-7e793917865c?q=80&w=1000&auto=format&fit=crop",
        link: "https://ec.europa.eu",
        source: "EU Report",
        date: "2024-03-12",
        category: "Shipping"
    },
    {
        id: 5,
        title: "스마트 항만 구축 가속화... 물류 혁신의 핵심",
        summary: "자동화 터미널과 IoT 기술이 결합된 스마트 항만이 전 세계적으로 확산되고 있습니다. 항만 효율성 증대와 탄소 배출 감소 효과 기대.",
        image: "https://images.unsplash.com/photo-1521733912148-5bc8e36706e2?q=80&w=1000&auto=format&fit=crop",
        link: "https://www.portofrotterdam.com",
        source: "Logistics Weekly",
        date: "2024-03-11",
        category: "IT"
    }
];

// Sidebar Menu Items
let menuItems = [
    { id: 'co-fleeter', name: 'Co-Fleeter', link: 'https://cofleeter.com' },
    { id: 'marine-market', name: 'Marine Market', link: 'https://marinemarket.com' },
    { id: 'shipping', name: '해운 (Shipping)', link: '#' },
    { id: 'it', name: 'IT', link: '#' },
    { id: 'shipbuilding', name: '조선 (Shipbuilding)', link: '#' }
];

// Categories
let categories = [
    { id: 'shipping', name: 'Shipping', color: '#3b82f6' },
    { id: 'it', name: 'IT', color: '#8b5cf6' },
    { id: 'shipbuilding', name: 'Shipbuilding', color: '#10b981' },
    { id: 'market', name: 'Market', color: '#f59e0b' },
    { id: 'news', name: 'News', color: '#64748b' }
];

// Admin Credentials (mutable for password change)
let ADMIN_USER = {
    email: "decarbon@decarva.co.kr",
    password: "00000000"
};

// Verification code storage
let verificationStore = {
    code: null,
    expiresAt: null,
    newPassword: null
};

// Email transporter (Hiworks SMTP configuration)
const SMTP_CONFIG = {
    host: 'smtp.hiworks.com',
    port: 465,
    secure: true, // SSL
    auth: {
        user: process.env.SMTP_USER || 'decarbon@decarva.co.kr',
        pass: process.env.SMTP_PASS || 'decarb0nizer#'
    }
};

const createTransporter = () => {
    return nodemailer.createTransport(SMTP_CONFIG);
// Admin Credentials
const ADMIN_USER = {
    email: "decarvaadmin@decarva.com",
    password: "1234"
};

// Auth Middleware (Simplified for demo)
const adminOnly = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (authHeader === "Basic AdminToken") {
        next();
    } else {
        res.status(401).json({ message: "Unauthorized" });
    }
};

const SHEET_ID = '1MgwthoOxFmhPRj--RvP0fUS9f-IRrBzGy_z00xDXQpA';

async function fetchSheetData(sheetName) {
    try {
        const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(sheetName)}`;
        const res = await fetch(url);
        const text = await res.text();
        const rows = text.split('\n').filter(r => r.trim()).slice(1); // skip header
        return rows.map(row => {
            // Robust CSV split for "No","Address" format
            const columns = row.split('","').map(col => col.replace(/"/g, '').trim());
            return {
                no: columns[0],
                address: columns[1]
            };
        }).filter(item => item.address && item.address.startsWith('http'));
    } catch (error) {
        console.error(`Error fetching sheet ${sheetName}:`, error);
        return [];
    }
}

async function fetchMetadata(url, isMain = false) {
    try {
        console.log(`Scraping: ${url}`);
        const res = await fetch(url, { 
            signal: AbortSignal.timeout(10000), 
            headers: { 
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
                'Accept-Language': 'en-US,en;q=0.9,ko;q=0.8',
                'Referer': 'https://www.google.com/'
            } 
        });
        
        const html = await res.text();
        
        const getMeta = (prop) => {
            const propRegex = new RegExp(`<meta [^>]*property=["'](?:og:)?${prop}["'] [^>]*content=["']([^"']*)["']`, 'i');
            const nameRegex = new RegExp(`<meta [^>]*name=["'](?:og:)?${prop}["'] [^>]*content=["']([^"']*)["']`, 'i');
            const contentFirstPropRegex = new RegExp(`<meta [^>]*content=["']([^"']*)["'] [^>]*property=["'](?:og:)?${prop}["']`, 'i');
            const contentFirstNameRegex = new RegExp(`<meta [^>]*content=["']([^"']*)["'] [^>]*name=["'](?:og:)?${prop}["']`, 'i');
            
            const match = html.match(propRegex) || html.match(nameRegex) || html.match(contentFirstPropRegex) || html.match(contentFirstNameRegex);
            return match ? (match[1] || null) : null;
        };

        const rawTitle = getMeta('title') || (html.match(/<title>(.*?)<\/title>/i) || [])[1] || url;
        const description = getMeta('description') || "";
        let image = getMeta('image') || getMeta('twitter:image');

        // Fallback: search for first <img> that might be the featured image
        if (!image) {
            const imgRegex = /<img [^>]*src=["']([^"']*)["']/gi;
            let imgMatch;
            while ((imgMatch = imgRegex.exec(html)) !== null) {
                const src = imgMatch[1];
                if (src.includes('logo') || src.includes('icon') || src.includes('default') || src.length < 10) continue;
                image = src;
                break;
            }
        }

        // Make image URL absolute if needed
        if (image && !image.startsWith('http')) {
            try {
                image = new URL(image, url).href;
            } catch (e) {
                console.error("Error formatting image URL:", e);
            }
        }

        const siteName = getMeta('site_name') || new URL(url).hostname;

        return {
            id: Math.random().toString(36).substr(2, 9),
            title: rawTitle.trim(),
            summary: description.trim(),
            image: image || "https://images.unsplash.com/photo-1544256718-3bcf237f3974?q=80&w=1000&auto=format&fit=crop",
            source: siteName,
            link: url,
            date: new Date().toISOString().split('T')[0],
            category: "News",
            isMain
        };
    } catch (e) {
        return {
            id: Math.random().toString(36).substr(2, 9),
            title: url,
            summary: "내용을 불러올 수 없습니다.",
            image: "https://images.unsplash.com/photo-1544256718-3bcf237f3974?q=80&w=1000&auto=format&fit=crop",
            source: new URL(url).hostname,
            link: url,
            date: new Date().toISOString().split('T')[0],
            category: "News",
            isMain
        };
    }
}

app.post('/api/login', (req, res) => {
    const { email, password } = req.body;
    if (email === ADMIN_USER.email && password === ADMIN_USER.password) {
        res.json({ token: "Basic AdminToken", user: { email: ADMIN_USER.email, role: "admin" } });
    } else {
        res.status(401).json({ message: "Invalid email or password" });
    }
});

app.get('/api/news', async (req, res) => {
    try {
        console.log("Fetching sheet data...");
        const [mainData, newsData] = await Promise.all([
            fetchSheetData('Main Sheet'),
            fetchSheetData('NEWS')
        ]);
        console.log(`Found ${mainData.length} items in Main, ${newsData.length} in NEWS`);

        const mainItems = await Promise.all(mainData.slice(0, 4).map(item => {
            console.log(`Scraping Main: ${item.address}`);
            return fetchMetadata(item.address, true);
        }));
        const recentItems = await Promise.all(newsData.slice(0, 10).map(item => {
            console.log(`Scraping NEWS: ${item.address}`);
            return fetchMetadata(item.address, false);
        }));

        console.log("All scraping done.");
        res.json([...mainItems, ...recentItems]);
    } catch (error) {
        console.error("Error in /api/news:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

app.get('/api/news/search', async (req, res) => {
    const query = req.query.q ? req.query.q.toLowerCase() : "";
    try {
        // For search, we still fetch fresh but maybe more items or just filter current
        // For now, let's just filter the combined set
        const [mainData, newsData] = await Promise.all([
            fetchSheetData('Main Sheet'),
            fetchSheetData('NEWS')
        ]);
        const allUrls = [...mainData, ...newsData];
        const items = await Promise.all(allUrls.slice(0, 20).map(item => fetchMetadata(item.address)));
        const filteredNews = items.filter(n => 
            n.title.toLowerCase().includes(query) || 
            n.summary.toLowerCase().includes(query)
        );
        res.json(filteredNews);
    } catch (error) {
        res.status(500).json({ message: "Error searching news" });
    }
});

// Admin CRUD Operations
app.post('/api/news', adminOnly, (req, res) => {
    const newPost = {
        id: Date.now(),
        ...req.body,
        date: new Date().toISOString().split('T')[0]
    };
    news.unshift(newPost);
    res.status(201).json(newPost);
});

app.put('/api/news/:id', adminOnly, (req, res) => {
    const id = parseInt(req.params.id);
    const index = news.findIndex(n => n.id === id);
    if (index !== -1) {
        news[index] = { ...news[index], ...req.body };
        res.json(news[index]);
    } else {
        res.status(404).json({ message: "News not found" });
    }
});

app.delete('/api/news/:id', adminOnly, (req, res) => {
    const id = parseInt(req.params.id);
    news = news.filter(n => n.id !== id);
    res.json({ message: "Deleted successfully" });
});

// Menu Management Endpoints
app.get('/api/menu', (req, res) => {
    res.json(menuItems);
});

app.put('/api/menu', adminOnly, (req, res) => {
    const updatedMenu = req.body;
    if (Array.isArray(updatedMenu)) {
        menuItems = updatedMenu;
        res.json(menuItems);
    } else {
        res.status(400).json({ message: "Invalid data format" });
    }
});

// Category Management Endpoints
app.get('/api/categories', (req, res) => {
    res.json(categories);
});

app.put('/api/categories', adminOnly, (req, res) => {
    const updatedCategories = req.body;
    if (Array.isArray(updatedCategories)) {
        categories = updatedCategories;
        res.json(categories);
    } else {
        res.status(400).json({ message: "Invalid data format" });
    }
});

// Password Change: Step 1 - Send verification code
app.post('/api/send-verification-code', adminOnly, async (req, res) => {
    const { newPassword } = req.body;
    if (!newPassword || newPassword.length < 4) {
        return res.status(400).json({ message: '새 비밀번호는 최소 4자 이상이어야 합니다.' });
    }

    // Generate 6-digit code
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 5 * 60 * 1000; // 5 minutes

    verificationStore = { code, expiresAt, newPassword };

    console.log(`\n===================================`);
    console.log(`[인증 코드] ${code}`);
    console.log(`[발송 대상] ${ADMIN_USER.email}`);
    console.log(`[만료 시간] 5분`);
    console.log(`===================================\n`);

    // Try to send email
    try {
        const smtpPass = SMTP_CONFIG.auth.pass;
        if (!smtpPass) {
            console.log('[이메일] SMTP 비밀번호가 설정되지 않아 이메일 발송을 건너뜁니다. 서버 콘솔의 인증 코드를 사용하세요.');
            return res.json({ 
                success: true, 
                message: '인증 코드가 생성되었습니다.',
                emailSent: false,
                hint: '서버 콘솔에서 인증 코드를 확인하세요.'
            });
        }

        const transporter = createTransporter();
        await transporter.sendMail({
            from: `"Decarva Admin" <${SMTP_CONFIG.auth.user}>`,
            to: ADMIN_USER.email,
            subject: '[Decarva] 비밀번호 변경 인증 코드',
            html: `
                <div style="font-family: 'Helvetica', sans-serif; max-width: 480px; margin: 0 auto; padding: 2rem;">
                    <h2 style="color: #0f1e3a; margin-bottom: 1rem;">비밀번호 변경 인증</h2>
                    <p style="color: #64748b; margin-bottom: 1.5rem;">아래 인증 코드를 입력하여 비밀번호 변경을 완료하세요.</p>
                    <div style="background: #f1f5f9; padding: 1.5rem; border-radius: 0.75rem; text-align: center; margin-bottom: 1.5rem;">
                        <span style="font-size: 2rem; font-weight: 800; color: #ff8031; letter-spacing: 0.3em;">${code}</span>
                    </div>
                    <p style="color: #94a3b8; font-size: 0.85rem;">이 코드는 5분 후 만료됩니다.</p>
                    <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 1.5rem 0;" />
                    <p style="color: #94a3b8; font-size: 0.75rem;">본인이 요청하지 않은 경우 이 이메일을 무시해 주세요.</p>
                </div>
            `
        });

        console.log('[이메일] 인증 코드 이메일 발송 완료');
        res.json({ success: true, message: '인증 코드가 이메일로 발송되었습니다.', emailSent: true });
    } catch (error) {
        console.error('[이메일] 발송 실패:', error.message);
        res.json({ 
            success: true, 
            message: '인증 코드가 생성되었습니다. (이메일 발송 실패 - 서버 콘솔 확인)',
            emailSent: false,
            hint: '서버 콘솔에서 인증 코드를 확인하세요.'
        });
    }
});

// Password Change: Step 2 - Verify code and change password
app.post('/api/change-password', adminOnly, (req, res) => {
    const { code } = req.body;

    if (!verificationStore.code) {
        return res.status(400).json({ message: '인증 코드가 요청되지 않았습니다. 먼저 인증 코드를 요청해 주세요.' });
    }

    if (Date.now() > verificationStore.expiresAt) {
        verificationStore = { code: null, expiresAt: null, newPassword: null };
        return res.status(400).json({ message: '인증 코드가 만료되었습니다. 다시 요청해 주세요.' });
    }

    if (code !== verificationStore.code) {
        return res.status(400).json({ message: '인증 코드가 올바르지 않습니다.' });
    }

    // Change password
    ADMIN_USER.password = verificationStore.newPassword;
    verificationStore = { code: null, expiresAt: null, newPassword: null };

    console.log(`[비밀번호 변경] 관리자 비밀번호가 변경되었습니다.`);
    res.json({ success: true, message: '비밀번호가 성공적으로 변경되었습니다.' });
});

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.use((req, res, next) => {
    if (req.method === 'GET' && !req.path.startsWith('/api')) {
        res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
    } else {
        next();
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
