console.log("Script carregado");

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
    if (document.getElementById('resultados')) {
        carregarResultados();
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
    defaultMessage: 'Olá! Gostaria de mais informações sobre os serviços da Mega Mania.',
    
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
const LotteryAPI = {
    baseURL: "/api",
    lotteries: {
        lotofacil: { name: "Lotofácil", icon: "fa-clover", color: "lotofacil" },
        megasena: { name: "Mega-Sena", icon: "fa-trophy", color: "mega-sena" },
        quina: { name: "Quina", icon: "fa-gem", color: "quina" },
        lotomania: { name: "Lotomania", icon: "fa-bolt", color: "lotomania" },
        timemania: { name: "Timemania", icon: "fa-futbol", color: "timemania" },
        duplasena: { name: "Dupla Sena", icon: "fa-layer-group", color: "dupla-sena" },
        diadesorte: { name: "Dia de Sorte", icon: "fa-sun", color: "diadesorte" },
        supersete: { name: "Super Sete", icon: "fa-hashtag", color: "supersete" },
    },

    async getResult(lottery) {
        try {
            const response = await fetch(`${this.baseURL}/${lottery}`);
            if (!response.ok) throw new Error("Erro ao buscar resultado");
            const data = await response.json();
            console.log("Resposta da API:", data);
            return data;
        } catch (error) {
            console.error(`Erro ao buscar ${lottery}:`, error);
            return null;
        }
    },

    async getAllResults() {
        const entries = Object.keys(this.lotteries);
        const results = {};

        const requests = entries.map((lottery) =>
            this.getResult(lottery).then((data) => ({ lottery, data }))
        );

        const settled = await Promise.allSettled(requests);
        settled.forEach((item) => {
            if (item.status === "fulfilled") {
                results[item.value.lottery] = item.value.data;
            }
        });

        return results;
    },

    formatNumber(num) {
        return String(num).padStart(2, "0");
    },

    formatDate(dateString) {
        if (!dateString) return "--/--/----";
        if (typeof dateString === "string") return dateString;
        try {
            return new Date(dateString).toLocaleDateString("pt-BR");
        } catch (error) {
            return "--/--/----";
        }
    },
};

const ResultsRenderer = {
    async renderResults() {
        const container = document.getElementById("resultados");
        if (!container) return;

        container.innerHTML =
            '<div class="loading-results"><i class="fas fa-spinner fa-spin"></i><p>Carregando resultados...</p></div>';

        try {
            const results = await LotteryAPI.getAllResults();
            container.innerHTML = "";

            for (const [key, data] of Object.entries(results)) {
                if (data && data.dezenas && data.dezenas.length > 0) {
                    const card = this.createResultCard(key, data);
                    container.appendChild(card);
                } else {
                    const card = this.createErrorCard(key);
                    container.appendChild(card);
                }
            }
            if (container.children.length === 0) {
                container.innerHTML =
                    '<div class="error-results"><i class="fas fa-exclamation-triangle"></i><p>Nao foi possivel carregar os resultados.</p></div>';
            }
        } catch (error) {
            container.innerHTML =
                '<div class="error-results"><i class="fas fa-exclamation-triangle"></i><p>Nao foi possivel carregar os resultados.</p></div>';
        }
    },

    createResultCard(lotteryKey, data) {
        const config = LotteryAPI.lotteries[lotteryKey];
        const card = document.createElement("div");
        card.className = "result-full-card";
        card.setAttribute("data-animate", "fade-up");

        const dezenas = data.dezenas || [];
        const concurso = data.concurso || "0000";
        const dataSorteio = data.data;

        const numbersHTML = `
            <div class="result-full-numbers ${lotteryKey === "lotofacil" ? "lotofacil-numbers" : ""}">
                ${dezenas
                    .map((n) => `<span class="number-ball">${LotteryAPI.formatNumber(n)}</span>`)
                    .join("")}
            </div>
        `;

        card.innerHTML = `
            <div class="result-full-header ${config.color || ""}">
                <div class="result-full-title">
                    <i class="fas ${config.icon}"></i>
                    <h2>${config.name}</h2>
                </div>
                <div class="result-full-info">
                    <span class="concurso">Concurso ${concurso}</span>
                    <span class="date">${LotteryAPI.formatDate(dataSorteio)}</span>
                </div>
            </div>
            <div class="result-full-body">
                ${numbersHTML}
            </div>
        `;

        return card;
    },

    createErrorCard(lotteryKey) {
        const config = LotteryAPI.lotteries[lotteryKey];
        const card = document.createElement("div");
        card.className = "result-full-card";
        card.setAttribute("data-animate", "fade-up");

        card.innerHTML = `
            <div class="result-full-header ${config.color || ""}">
                <div class="result-full-title">
                    <i class="fas ${config.icon}"></i>
                    <h2>${config.name}</h2>
                </div>
                <div class="result-full-info">
                    <span class="concurso">Indisponível</span>
                    <span class="date">--/--/----</span>
                </div>
            </div>
            <div class="result-full-body">
                <div class="error-results">
                    <i class="fas fa-triangle-exclamation"></i>
                    <p>Nao foi possivel carregar este resultado.</p>
                </div>
            </div>
        `;

        return card;
    },
};

window.LotteryAPI = LotteryAPI;
window.ResultsRenderer = ResultsRenderer;





async function carregarResultados() {
    console.log("Buscando resultados...");
    const container = document.getElementById("resultados");
    if (!container) {
        console.error("Container #resultados nao encontrado.");
        return;
    }

    try {
        const resposta = await fetch("/api/lotofacil");
        if (!resposta.ok) {
            throw new Error(`HTTP ${resposta.status}`);
        }
        const data = await resposta.json();
        console.log("Dados recebidos:", data);

        container.innerHTML = `
            <h2>${data.loteria}</h2>
            <p>Concurso ${data.concurso} - ${data.data}</p>
            <div class="numeros">
                ${data.dezenas.map(n => `<span class="bola">${n}</span>`).join("")}
            </div>
        `;
    } catch (erro) {
        console.error("Erro ao carregar resultados:", erro);
        container.innerHTML = "Erro ao carregar resultados.";
    }
}

window.addEventListener("load", carregarResultados);

