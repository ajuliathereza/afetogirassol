// Suaviza a rolagem para os links de navegação
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            const headerHeight = document.querySelector('header').offsetHeight;
            const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
            
            // Fechar menu mobile se estiver aberto
            const nav = document.querySelector('nav');
            const menuToggle = document.querySelector('.menu-toggle');
            if (nav.classList.contains('active')) {
                nav.classList.remove('active');
                menuToggle.classList.remove('active');
                document.body.style.overflow = ''; // Reativa o scroll
            }
        }
    });
});

// Adiciona classe ao header quando rolar a página
window.addEventListener('scroll', function() {
    const header = document.querySelector('header');
    if (window.scrollY > 100) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// Adiciona classe de ativo ao link de navegação ativo
const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('nav a');

function updateActiveLink() {
    let current = '';
    const scrollPosition = window.scrollY + 150;
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            current = sectionId;
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
}

// Executa ao carregar a página e ao rolar
window.addEventListener('load', updateActiveLink);
window.addEventListener('scroll', updateActiveLink);

// Adiciona animação de fade-in nos elementos ao rolar a página
const animateOnScroll = () => {
    const elements = document.querySelectorAll('.fade-in');
    
    elements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;
        
        if (elementTop < windowHeight - 100) {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }
    });
};

// Adiciona a classe de animação aos elementos da seção de produtos
const productCards = document.querySelectorAll('.product-card');
productCards.forEach((card, index) => {
    card.classList.add('fade-in');
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    card.style.transition = `opacity 0.5s ease ${index * 0.2}s, transform 0.5s ease ${index * 0.2}s`;
});

// Adiciona a classe de animação à seção sobre
const aboutSection = document.querySelector('.about');
if (aboutSection) {
    aboutSection.classList.add('fade-in');
    aboutSection.style.opacity = '0';
    aboutSection.style.transform = 'translateY(20px)';
    aboutSection.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
}

// Adiciona o evento de scroll para animação
window.addEventListener('scroll', animateOnScroll);

// Executa uma vez no carregamento da página para verificar elementos já visíveis
window.addEventListener('load', () => {
    animateOnScroll();
    
    // Adiciona a classe de carregamento concluído ao body para ativar as transições
    document.body.classList.add('loaded');

    // Botão flutuante do WhatsApp
    const floatingWhatsApp = document.createElement('div');
    floatingWhatsApp.className = 'floating-whatsapp';
    floatingWhatsApp.innerHTML = `
        <a href="https://wa.me/555193833178" class="btn-whatsapp">
            <i class="fab fa-whatsapp"></i>
            <span>Fale Conosco</span>
        </a>
    `;
    document.body.appendChild(floatingWhatsApp);

    // Esconde o botão inicialmente
    const floatingBtn = document.querySelector('.floating-whatsapp');
    floatingBtn.style.display = 'none';
    floatingBtn.style.transition = 'opacity 0.3s ease, transform 0.3s ease';

    // Mostra/oculta o botão do WhatsApp baseado na posição do scroll
    function toggleWhatsAppButton() {
        const heroSection = document.querySelector('.hero');
        if (!heroSection) return;
        
        const heroHeight = heroSection.offsetHeight;
        const scrollPosition = window.scrollY;
        
        // Mostra o botão apenas após passar do banner (hero)
        if (scrollPosition > heroHeight - 100) {
            floatingBtn.style.display = 'block';
            setTimeout(() => {
                floatingBtn.style.opacity = '1';
                floatingBtn.style.transform = 'translateY(0)';
            }, 10);
        } else {
            floatingBtn.style.opacity = '0';
            floatingBtn.style.transform = 'translateY(100px)';
            // Esconde o botão após a animação
            setTimeout(() => {
                if (window.scrollY <= heroHeight - 100) {
                    floatingBtn.style.display = 'none';
                }
            }, 300);
        }
    }

    // Adiciona o evento de scroll
    window.addEventListener('scroll', toggleWhatsAppButton, { passive: true });
    
    // Executa uma vez para verificar a posição inicial
    toggleWhatsAppButton();

    // Carregamento otimizado de imagens
    document.addEventListener('DOMContentLoaded', function() {
        const lazyImages = [].slice.call(document.querySelectorAll('img.lazy'));
        
        if ('IntersectionObserver' in window) {
            const lazyImageObserver = new IntersectionObserver(function(entries, observer) {
                entries.forEach(function(entry) {
                    if (entry.isIntersecting) {
                        const lazyImage = entry.target;
                        lazyImage.src = lazyImage.dataset.src;
                        lazyImage.classList.remove('lazy');
                        lazyImageObserver.unobserve(lazyImage);
                    }
                });
            });

            lazyImages.forEach(function(lazyImage) {
                lazyImageObserver.observe(lazyImage);
            });
        }
        
        // Inicializa a galeria com filtros
        initGallery();
    });
    
    // Função para inicializar a galeria com filtros
    function initGallery() {
        const filterButtons = document.createElement('div');
        filterButtons.className = 'gallery-filters';
        filterButtons.innerHTML = `
            <button class="filter-btn active" data-filter="all">Todas</button>
            <button class="filter-btn" data-filter="cafe">Café da Manhã</button>
            <button class="filter-btn" data-filter="presente">Kits Presente</button>
            <button class="filter-btn" data-filter="especial">Edições Especiais</button>
        `;
        
        const gallerySection = document.querySelector('.gallery .container');
        const galleryGrid = document.querySelector('.gallery-grid');
        
        // Insere os filtros antes da galeria
        if (galleryGrid) {
            gallerySection.insertBefore(filterButtons, galleryGrid);
            
            // Adiciona evento de clique nos botões de filtro
            const filterBtns = filterButtons.querySelectorAll('.filter-btn');
            filterBtns.forEach(btn => {
                btn.addEventListener('click', filterGallery);
            });
            
            // Adiciona animação de hover nas imagens
            const galleryItems = document.querySelectorAll('.gallery-item');
            galleryItems.forEach(item => {
                // Adiciona um pequeno atraso para a animação de cada item
                const delay = Math.random() * 0.3;
                item.style.animationDelay = `${delay}s`;
                
                // Efeito de brilho ao passar o mouse
                item.addEventListener('mousemove', (e) => {
                    const rect = item.getBoundingClientRect();
                    const x = e.clientX - rect.left;
                    const y = e.clientY - rect.top;
                    
                    item.style.setProperty('--x', `${x}px`);
                    item.style.setProperty('--y', `${y}px`);
                });
            });
        }
    }
    
    // Função para filtrar a galeria
    function filterGallery(e) {
        const filterValue = this.getAttribute('data-filter');
        const galleryItems = document.querySelectorAll('.gallery-item');
        
        // Atualiza o botão ativo
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        this.classList.add('active');
        
        // Filtra os itens da galeria
        galleryItems.forEach(item => {
            if (filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
                item.style.display = 'block';
                // Adiciona animação de fade in
                item.style.animation = 'fadeInUp 0.6s ease-out forwards';
            } else {
                item.style.display = 'none';
            }
        });
        
        // Adiciona um pequeno efeito de "pulo" no botão clicado
        this.style.transform = 'translateY(-3px)';
        setTimeout(() => {
            this.style.transform = 'translateY(0)';
        }, 200);
    }
});

// Menu responsivo com ícone de sol
const menuToggle = document.createElement('button');
menuToggle.className = 'menu-toggle';
menuToggle.setAttribute('aria-label', 'Menu');
menuToggle.setAttribute('aria-expanded', 'false');
menuToggle.innerHTML = '<span></span>';
const header = document.querySelector('header .container');
header.insertBefore(menuToggle, document.querySelector('nav'));

// Atualiza o atributo aria-expanded quando o menu é aberto/fechado
menuToggle.addEventListener('click', () => {
    const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
    menuToggle.setAttribute('aria-expanded', !isExpanded);
});

menuToggle.addEventListener('click', () => {
    const nav = document.querySelector('nav');
    const isActive = nav.classList.toggle('active');
    menuToggle.classList.toggle('active');
    document.body.style.overflow = isActive ? 'hidden' : ''; // Bloqueia o scroll quando o menu está aberto
});

// Fechar menu ao clicar fora
document.addEventListener('click', (e) => {
    const nav = document.querySelector('nav');
    const menuToggle = document.querySelector('.menu-toggle');
    
    if (!nav.contains(e.target) && !menuToggle.contains(e.target) && nav.classList.contains('active')) {
        nav.classList.remove('active');
        menuToggle.classList.remove('active');
        document.body.style.overflow = ''; // Reativa o scroll
    }
});

// Fecha o menu ao clicar em um item no mobile
document.querySelectorAll('nav a').forEach(link => {
    link.addEventListener('click', () => {
        const nav = document.querySelector('nav');
        if (nav.classList.contains('active')) {
            nav.classList.remove('active');
            menuToggle.classList.remove('active');
        }
    });
});

// Adiciona estilos para o menu responsivo
const style = document.createElement('style');
style.textContent = `
    .menu-toggle {
        display: none;
        font-size: 1.5rem;
        cursor: pointer;
        color: var(--dark);
    }
    
    @media (max-width: 768px) {
        .menu-toggle {
            display: block;
            position: absolute;
            top: 1rem;
            right: 1rem;
            z-index: 1001;
        }
        
        nav {
            position: fixed;
            top: 0;
            right: -300px;
            width: 250px;
            height: 100vh;
            background-color: var(--white);
            box-shadow: -5px 0 15px rgba(0, 0, 0, 0.1);
            transition: right 0.3s ease;
            padding-top: 5rem;
            z-index: 1000;
        }
        
        nav.active {
            right: 0;
        }
        
        nav ul {
            flex-direction: column;
            padding: 1rem;
        }
        
        nav ul li {
            margin: 1rem 0;
        }
    }
`;
document.head.appendChild(style);

// Atualiza dinamicamente o ano no rodapé
document.addEventListener('DOMContentLoaded', () => {
    const year = new Date().getFullYear();
    const yearElement = document.querySelector('footer p');
    if (yearElement) {
        yearElement.textContent = `© ${year} Girassol Cestas Afetivas - Todos os direitos reservados`;
    }
});
