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
    initWhatsAppFloat();
    
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

/* ========================================
   BOTÃO FLUTUANTE WHATSAPP
   ======================================== */

// Configuração do WhatsApp - Altere aqui o número desejado
const WhatsAppConfig = {
    // Número do WhatsApp (apenas dígitos, com código do país)
    // Exemplo: 5511999999999 (55 = Brasil, 11 = São Paulo, 999999999 = número)
    phoneNumber: '5511999999999',
    
    // Mensagem padrão que será enviada
    defaultMessage: 'Olá! Gostaria de mais informações sobre os serviços da Loterica Eldorado.',
    
    // Texto do tooltip
    tooltipText: 'Fale conosco no WhatsApp'
};

/* ----- Inicializar Botão Flutuante WhatsApp ----- */
function initWhatsAppFloat() {
    // Verificar se o botão já existe
    if (document.querySelector('.whatsapp-float')) {
        return;
    }

    // Criar elemento do botão
    const whatsappBtn = document.createElement('a');
    whatsappBtn.className = 'whatsapp-float';
    whatsappBtn.href = generateWhatsAppLink(WhatsAppConfig.phoneNumber, WhatsAppConfig.defaultMessage);
    whatsappBtn.target = '_blank';
    whatsappBtn.rel = 'noopener noreferrer';
    whatsappBtn.setAttribute('aria-label', 'WhatsApp');

    // Ícone do WhatsApp
    whatsappBtn.innerHTML = `
        <i class="fab fa-whatsapp"></i>
        <span class="whatsapp-tooltip">${WhatsAppConfig.tooltipText}</span>
    `;

    // Adicionar ao body
    document.body.appendChild(whatsappBtn);
}

/* ----- Gerar Link do WhatsApp ----- */
function generateWhatsAppLink(phoneNumber, message) {
    // Remove caracteres não numéricos do número
    const cleanPhone = phoneNumber.replace(/\D/g, '');
    
    // Codifica a mensagem para URL
    const encodedMessage = encodeURIComponent(message);
    
    // Retorna o link no formato do WhatsApp Web
    return `https://wa.me/${cleanPhone}?text=${encodedMessage}`;
}

/* ----- Atualizar Configuração do WhatsApp (para uso futuro) ----- */
function updateWhatsAppConfig(phoneNumber, message) {
    WhatsAppConfig.phoneNumber = phoneNumber;
    WhatsAppConfig.defaultMessage = message;
    
    // Atualizar link do botão existente
    const whatsappBtn = document.querySelector('.whatsapp-float');
    if (whatsappBtn) {
        whatsappBtn.href = generateWhatsAppLink(phoneNumber, message);
    }
}

// Exportar para uso global
window.WhatsAppConfig = WhatsAppConfig;
window.updateWhatsAppConfig = updateWhatsAppConfig;

/* ========================================
   API DE RESULTADOS DAS LOTERIAS - CAIXA
   ======================================== */

/**
 * ==========================================
 * CONFIGURAÇÃO DA API
 * ==========================================
 * 
 * A API da CAIXA usa o seguinte formato de URL:
 * https://servicebus2.caixa.gov.br/portaldeloterias/api/{loteria}
 * 
 * Loteria disponíveis:
 * - megasena
 * - lotofacil
 * - quina
 * - duplasena
 * - federal
 * - timemania
 * - lotomania
 * - diadesorte
 * - supersete
 * 
 * Para adicionar uma nova loteria, basta adicionar ao objeto lotteries abaixo.
 */
const LotteryAPI = {
    // ==========================================
    // URL DO PROXY PHP - Use o arquivo api-proxy.php para evitar CORS
    // ==========================================
    baseURL: 'api-proxy.php',
    
    // ==========================================
    // CONFIGURAÇÃO DAS LOTERIAS
    // ==========================================
    // Para adicionar/alterar uma loteria, modifique este objeto:
    // - name: Nome exibido na página
    // - icon: Ícone do Font Awesome
    // - color: Classe CSS para cor do cabeçalho
    // - numbers: Quantidade de números sorteados
    lotteries: {
        'megasena': { 
            name: 'Mega-Sena', 
            icon: 'fa-trophy', 
            color: 'mega-sena', 
            numbers: 6 
        },
        'lotofacil': { 
            name: 'Lotofácil', 
            icon: 'fa-star', 
            color: 'lotofacil', 
            numbers: 15 
        },
        'quina': { 
            name: 'Quina', 
            icon: 'fa-gem', 
            color: 'quina', 
            numbers: 5 
        }
    },

    // ==========================================
    // BUSCAR RESULTADO DE UMA LOTERIA
    // ==========================================
    // Parâmetro: nome da loteria (ex: 'megasena', 'lotofacil', 'quina')
    // Retorna: objeto com os dados do resultado
    async getResult(lottery) {
        try {
            const response = await fetch(`${this.baseURL}/${lottery}`);
            if (!response.ok) throw new Error('Erro ao buscar resultado');
            return await response.json();
        } catch (error) {
            console.error(`Erro ao buscar ${lottery}:`, error);
            return null;
        }
    },

    // ==========================================
    // BUSCAR TODOS OS RESULTADOS PRINCIPAIS
    // ==========================================
    async getAllResults() {
        const mainLotteries = ['megasena', 'quina', 'lotofacil'];
        const results = {};
        
        for (const lottery of mainLotteries) {
            results[lottery] = await this.getResult(lottery);
        }
        
        return results;
    },

    // ==========================================
    // FORMATAR NÚMERO COM ZERO À ESQUERDA
    // ==========================================
    formatNumber(num) {
        return String(num).padStart(2, '0');
    },

    // ==========================================
    // FORMATAR VALOR EM REAIS
    // ==========================================
    formatCurrency(value) {
        if (!value) return 'R$ 0,00';
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(value);
    },

    // ==========================================
    // FORMATAR DATA
    // ==========================================
    formatDate(dateString) {
        if (!dateString) return '--/--/----';
        // A data vem no formato: /Date(1704734400000)/
        const timestamp = parseInt(dateString.replace(/\D/g, ''));
        const date = new Date(timestamp);
        return date.toLocaleDateString('pt-BR');
    }
};

/* ========================================
   RENDERIZADOR DE RESULTADOS
   ======================================== */

/**
 * ==========================================
 * ESTILIZAÇÃO
 * ==========================================
 * 
 * Para alterar o estilo dos cards, procure no CSS:
 * - .result-full-card: Card principal
 * - .result-full-header: Cabeçalho com cor
 * - .result-full-numbers: Container dos números
 * - .number-ball: Bolas dos números
 * - .result-full-prizes: Prêmios
 * 
 * O arquivo style.css contém todas as classes de estilo.
 */
const ResultsRenderer = {
    // ==========================================
    // RENDERIZAR TODOS OS RESULTADOS
    // ==========================================
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
                if (data && data.dezenas) {
                    const card = this.createResultCard(key, data);
                    container.appendChild(card);
                }
            }

        } catch (error) {
            container.innerHTML = `<div class="error-results"><i class="fas fa-exclamation-triangle"></i><p>Erro ao carregar resultados. Tente novamente mais tarde.</p></div>`;
        }
    },

    // ==========================================
    // CRIAR CARD DE RESULTADO
    // ==========================================
    createResultCard(lotteryKey, data) {
        const config = LotteryAPI.lotteries[lotteryKey];
        const card = document.createElement('div');
        card.className = 'result-full-card';
        card.setAttribute('data-animate', 'fade-up');

        // Extrair dados do JSON da API da CAIXA
        const dezenas = data.dezenas || [];
        const concurso = data.numeroConcurso || data.concurso || '0000';
        const dataSorteio = data.dataApuracao || data.dataSorteio;
        const valorEstimado = data.valorEstimadoProximoConcurso || data.valorAcumulado;
        const dataProximo = data.dataProximoConcurso;

        // Gerar HTML dos números
        const numbersHTML = `
            <div class="result-full-numbers ${lotteryKey === 'lotofacil' ? 'lotofacil-numbers' : ''}">
                ${dezenas.map(n => `<span class="number-ball">${LotteryAPI.formatNumber(n)}</span>`).join('')}
            </div>
        `;

        // Gerar HTML dos prêmios (se houver)
        let prizesHTML = '';
        if (data.rateioPremio && data.rateioPremio.length > 0) {
            prizesHTML = `
                <div class="result-full-prizes">
                    ${data.rateioPremio.map(p => `
                        <div class="prize">
                            <span class="prize-label">${p.descricao}</span>
                            <span class="prize-value">${LotteryAPI.formatCurrency(p.valorPremio)}</span>
                        </div>
                    `).join('')}
                </div>
            `;
        }

        // Gerar HTML do rodapé com próximo prêmio
        let footerHTML = '';
        if (valorEstimado && valorEstimado > 0) {
            footerHTML = `
                <div class="result-full-footer">
                    <span class="estimated">Próximo prêmio: ${LotteryAPI.formatCurrency(valorEstimado)}</span>
                    ${dataProximo ? `<span class="draw-date">Sorteio: ${LotteryAPI.formatDate(dataProximo)}</span>` : ''}
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
                    <span class="concurso">Concurso ${concurso}</span>
                    <span class="date">${LotteryAPI.formatDate(dataSorteio)}</span>
                </div>
            <div class="result-full-body">
                ${numbersHTML}
                ${prizesHTML}
            </div>
            ${footerHTML}
        `;

        return card;
    }
};

/* ========================================
   EXPORTAR PARA USO GLOBAL
   ======================================== */
window.LotteryAPI = LotteryAPI;
window.ResultsRenderer = ResultsRenderer;
