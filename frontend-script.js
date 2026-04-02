// Sample Data (Real data from API)
const sampleVideos = [
    {id:1,title:"হট দেশি গার্লস 2026",thumb:"https://via.placeholder.com/400x225/ff6b6b/fff?text=DESI",views:"2.5M",duration:"14:32",category:"desi"},
    {id:2,title:"বলিউড সেক্সি স্টার",thumb:"https://via.placeholder.com/400x225/feca57/000?text=BOLLYWOOD",views:"1.8M",duration:"10:45",category:"bollywood"},
    {id:3,title:"ভাইরাল হট ভিডিও",thumb:"https://via.placeholder.com/400x225/48dbfb/fff?text=VIRAL",views:"4.2M",duration:"8:23",category:"viral"}
];

const categories = [
    {id:"desi",name:"দেশি",icon:"🇮🇳"},
    {id:"bollywood",name:"বলিউড",icon:"🎬"},
    {id:"viral",name:"ভাইরাল",icon:"🔥"}
];

// Initialize
document.addEventListener('DOMContentLoaded', initApp);

function initApp() {
    initParticles();
    initNavbar();
    initCounters();
    renderCategories();
    loadVideos();
}

function initParticles() {
    const canvas = document.getElementById('particlesCanvas');
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    // Simple particle animation
    let particles = [];
    for(let i=0; i<50; i++) {
        particles.push({
            x: Math.random()*canvas.width,
            y: Math.random()*canvas.height,
            vx: (Math.random()-0.5)*0.5,
            vy: (Math.random()-0.5)*0.5,
            radius: Math.random()*2 + 1
        });
    }
    
    function animate() {
        ctx.clearRect(0,0,canvas.width,canvas.height);
        particles.forEach(p => {
            p.x += p.vx;
            p.y += p.vy;
            if(p.x<0 || p.x>canvas.width) p.vx *= -1;
            if(p.y<0 || p.y>canvas.height) p.vy *= -1;
            
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI*2);
            ctx.fillStyle = 'rgba(255,255,255,0.5)';
            ctx.fill();
        });
        requestAnimationFrame(animate);
    }
    animate();
}

function initNavbar() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    hamburger.addEventListener('click', () => {
        navMenu.classList.toggle('active');
    });
}

function initCounters() {
    const counters = document.querySelectorAll('.stat-num');
    counters.forEach(counter => {
        const target = counter.getAttribute('data-count');
        let current = 0;
        const increment = target / 100;
        const timer = setInterval(() => {
            current += increment;
            if(current >= target) {
                counter.textContent = target + (target>10 ? 'K+' : '+');
                clearInterval(timer);
            } else {
                counter.textContent = Math.floor(current);
            }
        }, 50);
    });
}

function renderCategories() {
    const grid = document.getElementById('categoriesGrid');
    categories.forEach(cat => {
        const div = document.createElement('div');
        div.className = 'category-card';
        div.innerHTML = `
            <div class="cat-icon">${cat.icon}</div>
            <h4>${cat.name}</h4>
            <span>50K+ ভিডিও</span>
        `;
        div.onclick = () => filterVideos(cat.id);
        grid.appendChild(div);
    });
}

function loadVideos(filter = 'all') {
    const grid = document.getElementById('videosGrid');
    grid.innerHTML = '';
    
    // Real API Call
    fetch('api/videos.php?action=list&filter=' + filter)
    .then(res => res.json())
    .then(data => {
        data.videos.forEach(video => {
            const card = document.createElement('div');
            card.className = 'video-card';
            card.innerHTML = `
                <div class="video-thumb">
                    <img src="${video.thumbnail}" alt="${video.title}" loading="lazy">
                </div>
                <div class="video-info">
                    <h4>${video.title}</h4>
                    <div class="video-meta">
                        <span>${video.views} views</span>
                        <span>${video.duration}</span>
                    </div>
                </div>
            `;
            card.onclick = () => playVideo(video);
            grid.appendChild(card);
        });
    })
    .catch(() => renderSampleVideos(filter)); // Fallback
}

function renderSampleVideos(filter) {
    const filtered = filter === 'all' ? sampleVideos : sampleVideos.filter(v => v.category === filter);
    const grid = document.getElementById('videosGrid');
    
    filtered.forEach(video => {
        const card = document.createElement('div');
        card.className = 'video-card';
        card.innerHTML = `
            <div class="video-thumb">
                <img src="${video.thumb}" alt="${video.title}" loading="lazy">
            </div>
            <div class="video-info">
                <h4>${video.title}</h4>
                <div class="video-meta">
                    <span>${video.views} views</span>
                    <span>${video.duration}</span>
                </div>
            </div>
        `;
        card.onclick = () => playVideo(video);
        grid.appendChild(card);
    });
}

function playVideo(video) {
    const modal = document.getElementById('videoModal');
    const player = document.getElementById('player');
    const title = document.getElementById('modalTitle');
    const views = document.getElementById('modalViews');
    
    title.textContent = video.title;
    views.textContent = video.views + ' views';
    player.src = video.video || 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4';
    
    modal.classList.add('active');
    player.play();
    
    // Update views (API call)
    fetch('api/videos.php?action=view&id=' + video.id);
}

function filterVideos(category) {
    document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    loadVideos(category);
}

// Modal Controls
document.querySelector('.close').onclick = () => {
    document.getElementById('videoModal').classList.remove('active');
    document.getElementById('player').pause();
};

document.getElementById('videoModal').onclick = (e) => {
    if(e.target === e.currentTarget) {
        e.currentTarget.classList.remove('active');
        document.getElementById('player').pause();
    }
};

// Smooth Scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});
