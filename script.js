/* ========================================
   Loterica Eldorado - JavaScript
   ======================================== */

document.addEventListener('DOMContentLoaded', function() {
    // Inicializar todas as funcionalidades
    initHeader();
    initMobileMenu();
    initScrollAnimations();
    initFAQ();
    initFormValidation();
    initSmoothScroll();
    
    // Inicializar resultados da API (apenas na página de resultados)
    if (document.getElementById('results-container')) {
        ResultsRenderer.renderResults();
    }
});

/* ----- Header Fixo ao Rolar ----- */
function initHeader() {
    const header = document.getElementById('header');
    let lastScroll = 0;

    window.addEventListener('scroll', function() {
        const currentScroll = window.pageYOffset;

        // Adicionar classe scrolled quando rolar mais de 50px
        if (currentScroll > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        lastScroll = currentScroll;
    });
}

/* ----- Menu Mobile ----- */
function initMobileMenu() {
    const mobileToggle = document.getElementById('mobileToggle');
    const navMenu = document.getElementById('navMenu');

    if (mobileToggle && navMenu) {
        mobileToggle.addEventListener('click', function() {
            // Toggle menu
            navMenu.classList.toggle('active');
            mobileToggle.classList.toggle('active');
        });

        // Fechar menu ao clicar em um link
        const navLinks = navMenu.querySelectorAll('a');
        navLinks.forEach(function(link) {
            link.addEventListener('click', function() {
                navMenu.classList.remove('active');
                mobileToggle.classList.remove('active');
            });
        });

        // Fechar menu ao clicar fora
        document.addEventListener('click', function(e) {
            if (!navMenu.contains(e.target) && !mobileToggle.contains(e.target)) {
                navMenu.classList.remove('active');
                mobileToggle.classList.remove('active');
            }
        });
    }
}

/* ----- Animações ao Rolar ----- */
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('[data-animate]');

    if (animatedElements.length > 0) {
        // Verificar se o navegador suporta Intersection Observer
        if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver(function(entries) {
                entries.forEach(function(entry) {
                    if (entry.isIntersecting) {
                        // Adicionar delay se especificado
                        const delay = entry.target.dataset.delay || 0;
                        setTimeout(function() {
                            entry.target.classList.add('animated');
                        }, delay);
                        observer.unobserve(entry.target);
                    }
                });
            }, {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            });

            animatedElements.forEach(function(element) {
                observer.observe(element);
            });
        } else {
            // Fallback para navegadores antigos
            animatedElements.forEach(function(element) {
                element.classList.add('animated');
            });
        }
    }
}

/* ----- FAQ Accordion ----- */
function initFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(function(item) {
        const question = item.querySelector('.faq-question');
        
        if (question) {
            question.addEventListener('click', function() {
                // Toggle item ativo
                const isActive = item.classList.contains('active');
                
                // Fechar todos os outros
                faqItems.forEach(function(otherItem) {
                    otherItem.classList.remove('active');
                });

                // Toggle item atual
                if (!isActive) {
                    item.classList.add('active');
                }
            });
        }
    });
}

/* ----- Validação de Formulário ----- */
function initFormValidation() {
    const contactForm = document.getElementById('contactForm');

    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();

            // Validar campos
            const nome = document.getElementById('nome');
            const email = document.getElementById('email');
            const telefone = document.getElementById('telefone');
            const mensagem = document.getElementById('mensagem');

            let isValid = true;

            // Validar nome
            if (nome.value.trim().length < 3) {
                showError(nome, 'Por favor, insira seu nome completo');
                isValid = false;
            } else {
                removeError(nome);
            }

            // Validar email
            if (!isValidEmail(email.value)) {
                showError(email, 'Por favor, insira um e-mail válido');
                isValid = false;
            } else {
                removeError(email);
            }

            // Validar telefone
            if (telefone.value.trim().length < 14) {
                showError(telefone, 'Por favor, insira um telefone válido');
                isValid = false;
            } else {
                removeError(telefone);
            }

            // Validar mensagem
            if (mensagem.value.trim().length < 10) {
                showError(mensagem, 'Por favor, insira uma mensagem com pelo menos 10 caracteres');
                isValid = false;
            } else {
                removeError(mensagem);
            }

            // Se válido, enviar
            if (isValid) {
                // Simular envio
                const submitBtn = contactForm.querySelector('button[type="submit"]');
                const originalText = submitBtn.innerHTML;
                
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
                submitBtn.disabled = true;

                // Simular sucesso após 2 segundos
                setTimeout(function() {
                    // Mostrar mensagem de sucesso
                    alert('Mensagem enviada com sucesso! Em breve responderemos seu contato.');
                    
                    // Resetar formulário
                    contactForm.reset();
                    
                    // Restaurar botão
                    submitBtn.innerHTML = originalText;
                    submitBtn.disabled = false;
                }, 2000);
            }
        });

        // Máscara de telefone
        const telefoneInput = document.getElementById('telefone');
        if (telefoneInput) {
            telefoneInput.addEventListener('input', function(e) {
                let value = e.target.value.replace(/\D/g, '');
                if (value.length > 0) {
                    value = value.match(/(\d{0,2})(\d{0,5})(\d{0,4})/);
                    value = !value[2] ? value[1] : '(' + value[1] + ') ' + value[2] + (value[3] ? '-' + value[3] : '');
                }
                e.target.value = value;
            });
        }
    }
}

/* ----- Validar Email ----- */
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/* ----- Mostrar Erro ----- */
function showError(input, message) {
    removeError(input);
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    errorDiv.style.color = '#e74c3c';
    errorDiv.style.fontSize = '0.875rem';
    errorDiv.style.marginTop = '5px';
    
    input.style.borderColor = '#e74c3c';
    input.parentNode.appendChild(errorDiv);
}

/* ----- Remover Erro ----- */
function removeError(input) {
    input.style.borderColor = '';
    const errorDiv = input.parentNode.querySelector('.error-message');
    if (errorDiv) {
        errorDiv.remove();
    }
}

/* ----- Smooth Scroll ----- */
function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');

    links.forEach(function(link) {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            if (href !== '#') {
                e.preventDefault();
                
                const target = document.querySelector(href);
                
                if (target) {
                    const headerHeight = document.getElementById('header').offsetHeight;
                    const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
}

/* ----- Efeito de Números Sortudos (para uso futuro) ----- */
function animateNumbers(element, finalValue, duration) {
    const startValue = 0;
    const startTime = performance.now();
    
    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        
        const currentValue = Math.floor(easeOutQuart * finalValue);
        element.textContent = currentValue;
        
        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }
    
    requestAnimationFrame(update);
}

/* ----- Máscara de CPF (para uso futuro) ----- */
function maskCPF(input) {
    let value = input.value.replace(/\D/g, '');
    if (value.length > 0) {
        value = value.match(/(\d{0,3})(\d{0,3})(\d{0,3})(\d{0,2})/);
        value = !value[2] ? value[1] : value[1] + '.' + value[2] + (value[3] ? '.' + value[3] : '') + (value[4] ? '-' + value[4] : '');
    }
    input.value = value;
}

/* ----- Máscara de CEP (para uso futuro) ----- */
function maskCEP(input) {
    let value = input.value.replace(/\D/g, '');
    if (value.length > 0) {
        value = value.match(/(\d{0,5})(\d{0,3})/);
        value = !value[2] ? value[1] : value[1] + '-' + value[2];
    }
    input.value = value;
}

/* ----- API Integration - Resultados de Loterias ----- */
const LotteryAPI = {
    // API base URL - API oficial das Loterias Caixa
    baseURL: 'https://loteriascaixa-api.herokuapp.com/api',
    
    // API alternativa para teste
    altBaseURL: 'https://api.guidi.dev.br/loteria',
    
    // Mapeamento de loterias
    lotteries: {
        'megasena': { name: 'Mega-Sena', icon: 'fa-trophy', color: 'mega-sena', numbers: 6 },
        'quina': { name: 'Quina', icon: 'fa-gem', color: 'quina', numbers: 5 },
        'lotofacil': { name: 'Lotofácil', icon: 'fa-star', color: 'lotofacil', numbers: 15 },
        'duplasena': { name: 'Dupla Sena', icon: 'fa-crown', color: 'dupla-sena', numbers: 6 },
        'federal': { name: 'Lot Federal', icon: 'fa-money-bill-alt', color: 'federal', numbers: 5 },
        'timemania': { name: 'Timemania', icon: 'fa-futbol', color: 'timemania', numbers: 7 },
        'lotomania': { name: 'Lotomania', icon: 'fa-dice', color: 'lotomania', numbers: 20 },
        'diadesorte': { name: 'Dia de Sorte', icon: 'fa-calendar-alt', color: 'dia-de-sorte', numbers: 7 },
        'supersete': { name: 'Super Sete', icon: 'fa-coins', color: 'super-sete', numbers: 7 }
    },

    // Buscar resultado mais recente de uma loteria específica
    async getResult(lottery) {
        try {
            const response = await fetch(`${this.baseURL}/${lottery}/latest`);
            if (!response.ok) throw new Error('Erro ao buscar resultado');
            return await response.json();
        } catch (error) {
            console.error(`Erro ao buscar ${lottery}:`, error);
            return null;
        }
    },

    // Buscar todos os resultados principais
    async getAllResults() {
        const mainLotteries = ['megasena', 'quina', 'lotofacil', 'duplasena', 'federal'];
        const results = {};
        
        for (const lottery of mainLotteries) {
            results[lottery] = await this.getResult(lottery);
        }
        
        return results;
    },

    // Função de teste usando API alternativa
    async testAPI() {
        console.log('=== Testando API de Loterias ===');
        try {
            // Testar Mega-Sena
            const res = await fetch('https://api.guidi.dev.br/loteria/megasena/ultimo');
            const data = await res.json();
            console.log('Mega-Sena:', data.dezenas, 'Concurso:', data.concurso, 'Data:', data.data);
            return data;
        } catch (error) {
            console.error('Erro ao testar API:', error);
            return null;
        }
    },

    // Formatar número com zero à esquerda
    formatNumber(num) {
        return String(num).padStart(2, '0');
    },

    // Formatar valor em reais
    formatCurrency(value) {
        if (!value) return 'R$ 0,00';
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(value);
    },

    // Formatar data
    formatDate(dateString) {
        if (!dateString) return '--/--/----';
        const date = new Date(dateString);
        return date.toLocaleDateString('pt-BR');
    }
};

/* ----- Renderizador de Resultados ----- */
const ResultsRenderer = {
    // Renderizar cards de resultados na página
    async renderResults() {
        const container = document.getElementById('results-container');
        if (!container) return;

        // Mostrar indicador de carregamento
        container.innerHTML = '<div class="loading-results"><i class="fas fa-spinner fa-spin"></i><p>Carregando resultados...</p></div>';

        try {
            const results = await LotteryAPI.getAllResults();
            container.innerHTML = '';

            // Renderizar cada loteria
            for (const [key, data] of Object.entries(results)) {
                if (data && data.numerosSorteados) {
                    const card = this.createResultCard(key, data);
                    container.appendChild(card);
                }
            }

            // Adicionar seção de outras loterias
            this.renderOtherLotteries(container);

        } catch (error) {
            container.innerHTML = `<div class="error-results"><i class="fas fa-exclamation-triangle"></i><p>Erro ao carregar resultados. Tente novamente mais tarde.</p></div>`;
        }
    },

    // Criar card de resultado
    createResultCard(lotteryKey, data) {
        const config = LotteryAPI.lotteries[lotteryKey];
        const card = document.createElement('div');
        card.className = 'result-full-card';
        card.setAttribute('data-animate', 'fade-up');

        const numbers = data.numerosSorteados || [];
        const prizes = data.rateioPremio || [];

        let numbersHTML = '';
        
        if (lotteryKey === 'duplasena') {
            // Dupla Sena tem 2 sorteios
            const primeiro = numbers.slice(0, 6);
            const segundo = numbers.slice(6, 12);
            numbersHTML = `
                <div class="dupla-sena-results">
                    <div class="sena-draw">
                        <h4>1º Sorteio</h4>
                        <div class="result-full-numbers">
                            ${primeiro.map(n => `<span class="number-ball">${LotteryAPI.formatNumber(n)}</span>`).join('')}
                        </div>
                    </div>
                    <div class="sena-draw">
                        <h4>2º Sorteio</h4>
                        <div class="result-full-numbers">
                            ${segundo.map(n => `<span class="number-ball">${LotteryAPI.formatNumber(n)}</span>`).join('')}
                        </div>
                    </div>
                </div>
            `;
        } else if (lotteryKey === 'federal') {
            // Federal tem formato diferente
            numbersHTML = `
                <div class="federal-results">
                    ${numbers.map((n, i) => `
                        <div class="federal-prize">
                            <span class="prize-number">${i + 1}º</span>
                            <span class="prize-value">${prizes[i] ? LotteryAPI.formatCurrency(prizes[i].valorPremio) : 'R$ 0,00'}</span>
                            <span class="prize-bill">${String(n).padStart(5, '0').slice(0, 5)}-${String(n).slice(-1)}</span>
                        </div>
                    `).join('')}
                </div>
            `;
        } else {
            // Outras loterias
            numbersHTML = `
                <div class="result-full-numbers ${lotteryKey === 'lotofacil' ? 'lotofacil-numbers' : ''}">
                    ${numbers.map(n => `<span class="number-ball">${LotteryAPI.formatNumber(n)}</span>`).join('')}
                </div>
            `;
        }

        let prizesHTML = '';
        if (prizes.length > 0 && lotteryKey !== 'federal') {
            prizesHTML = `
                <div class="result-full-prizes">
                    ${prizes.map(p => `
                        <div class="prize">
                            <span class="prize-label">${p.descricao}</span>
                            <span class="prize-value">${LotteryAPI.formatCurrency(p.valorPremio)}</span>
                        </div>
                    `).join('')}
                </div>
            `;
        }

        card.innerHTML = `
            <div class="result-full-header ${config.color}">
                <div class="result-full-title">
                    <i class="fas ${config.icon}"></i>
                    <h2>${config.name}</h2>
                </div>
                <div class="result-full-info">
                    <span class="concurso">Concurso ${data.numeroConcurso || '0000'}</span>
                    <span class="date">${data.dataConcurso ? LotteryAPI.formatDate(data.dataConcurso) : '--/--/----'}</span>
                </div>
            </div>
            <div class="result-full-body">
                ${numbersHTML}
                ${prizesHTML}
            </div>
            ${data.valorAcumuladoConcurso_0_5 !== undefined && data.valorAcumuladoConcurso_0_5 > 0 ? `
                <div class="result-full-footer">
                    <span class="estimated">Próximo prêmio: ${LotteryAPI.formatCurrency(data.valorAcumuladoConcurso_0_5)}</span>
                    <span class="draw-date">Sorteio: ${data.dataProximoConcurso ? LotteryAPI.formatDate(data.dataProximoConcurso) : '--/--/----'}</span>
                </div>
            ` : ''}
        `;

        return card;
    },

    // Renderizar outras loterias
    renderOtherLotteries(container) {
        const otherSection = document.createElement('div');
        otherSection.className = 'other-lotteries';
        otherSection.setAttribute('data-animate', 'fade-up');
        
        otherSection.innerHTML = `
            <h2 class="section-title">Outras Loterias</h2>
            <div class="other-lotteries-grid" id="other-lotteries-grid">
                <!-- Outras loterias serão carregadas aqui -->
            </div>
        `;
        
        container.appendChild(otherSection);
        
        // Carregar outras loterias
        this.loadOtherLotteries();
    },

    // Carregar outras loterias
    async loadOtherLotteries() {
        const grid = document.getElementById('other-lotteries-grid');
        if (!grid) return;

        const otherLotteries = ['timemania', 'lotomania', 'diadesorte', 'supersete'];

        for (const lottery of otherLotteries) {
            try {
                const data = await LotteryAPI.getResult(lottery);
                if (data) {
                    const config = LotteryAPI.lotteries[lottery];
                    const card = document.createElement('div');
                    card.className = 'other-lottery-card';
                    card.innerHTML = `
                        <i class="fas ${config.icon}"></i>
                        <h3>${config.name}</h3>
                        <p>Concurso ${data.numeroConcurso || '0000'}</p>
                        <p class="date">${data.dataConcurso ? LotteryAPI.formatDate(data.dataConcurso) : '--/--/----'}</p>
                        <button class="btn btn-small" onclick="viewLotteryDetails('${lottery}')">Ver Resultado</button>
                    `;
                    grid.appendChild(card);
                }
            } catch (error) {
                console.error(`Erro ao carregar ${lottery}:`, error);
            }
        }
    }
};

// Função global para ver detalhes de uma loteria
function viewLotteryDetails(lottery) {
    // Implementar modal ou navegação para detalhes
    alert(`Em breve: Detalhes da ${LotteryAPI.lotteries[lottery].name}`);
}

/* ----- Exportar para uso global ----- */
window.LotteryAPI = LotteryAPI;
window.maskCPF = maskCPF;
window.maskCEP = maskCEP;

