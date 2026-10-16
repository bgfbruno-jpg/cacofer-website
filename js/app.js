/**
 * CACOFER TECNOLOGIA — WEB APPLICATION LOGIC & CYBERSECURITY CONTROLS
 * Security Principles:
 * - Anti-XSS: Zero unsafe innerHTML injection of untrusted user input.
 * - Anti-Bot: Honeypot trap validation + Timestamp submission analysis.
 * - Anti-Flood: Client-side rate limiting and button throttling.
 * - Strict Input Validation: Regex-based phone and string sanitization.
 */

"use strict";

document.addEventListener("DOMContentLoaded", () => {
  // Page load timestamp for timelock bot detection
  const PAGE_LOAD_TIME = Date.now();
  let lastSubmissionTime = 0;
  const SUBMISSION_COOLDOWN_MS = 25000; // 25 seconds anti-spam throttle

  /* ==========================================================================
     1. CYBERSECURITY UTILITIES & SANITIZATION
  ========================================================================== */
  function sanitizeText(str) {
    if (typeof str !== "string") return "";
    return str
      .replace(/[<>'"&]/g, (char) => {
        const entities = {
          "<": "&lt;",
          ">": "&gt;",
          "'": "&#39;",
          '"': "&quot;",
          "&": "&amp;",
        };
        return entities[char] || char;
      })
      .trim();
  }

  function validateBRPhone(phone) {
    // Accepts (XX) 9XXXX-XXXX or XX9XXXXXXXX format
    const cleaned = phone.replace(/\D/g, "");
    return cleaned.length === 10 || cleaned.length === 11;
  }

  /* ==========================================================================
     2. MOBILE NAVIGATION DRAWER
  ========================================================================== */
  const mobileToggle = document.getElementById("mobileToggle");
  const mainNav = document.getElementById("mainNav");

  if (mobileToggle && mainNav) {
    mobileToggle.addEventListener("click", () => {
      const isOpen = mainNav.classList.toggle("is-open");
      mobileToggle.setAttribute("aria-expanded", isOpen);
      mobileToggle.textContent = isOpen ? "✕" : "☰";
    });

    // Close menu on link click
    mainNav.querySelectorAll(".nav-link, .nav-cta-btn").forEach((link) => {
      link.addEventListener("click", () => {
        if (window.innerWidth <= 768) {
          mainNav.classList.remove("is-open");
          mobileToggle.textContent = "☰";
          mobileToggle.setAttribute("aria-expanded", "false");
        }
      });
    });
  }

  /* ==========================================================================
     3. INTERACTIVE WHATSAPP SIMULATOR (LIVE DEMO)
  ========================================================================== */
  const chatMessages = document.getElementById("chatMessages");
  const typingIndicator = document.getElementById("typingIndicator");
  const simButtons = document.querySelectorAll(".sim-btn");

  const SIMULATOR_SCENARIOS = {
    agendamento: {
      userText: "Olá! Gostaria de saber valores do botox e se tem horário pra amanhã.",
      isAudio: false,
      botResponse:
        "Boa tarde! Tudo bem? Sou a Sofia, concierge da clínica. O procedimento depende de avaliação prévia da Dra. Nossa consulta de avaliação é R$ 150 (100% dedutível se realizar o tratamento). Tenho vaga para amanhã às 14h ou sexta às 10h, qual fica melhor para você?",
    },
    audio: {
      userText: "🎙️ [Áudio de 18s]: 'Oi Sofia, moro longe, como faço para chegar aí de carro?'",
      isAudio: true,
      botResponse:
        "Olá! Nosso espaço fica no Edifício Prime Design Offices, na Estrada Cel. Pedro Corrêa, 740 (Sala 327) - Barra Olímpica. O prédio conta com estacionamento rotativo e segurança 24h. Seguem os links direto do Waze e Google Maps para você abrir agora no GPS!",
    },
    cancelamento: {
      userText: "Tive um imprevisto e preciso desmarcar meu horário de amanhã.",
      isAudio: false,
      botResponse:
        "Sem problemas! Compreendo perfeitamente. O seu horário já foi liberado da agenda médica com sucesso. Gostaria de remarcar para a próxima semana em algum dia específico?",
    },
    humano: {
      userText: "Quero falar com uma pessoa de verdade da recepção.",
      isAudio: false,
      botResponse:
        "Com certeza! Já notifiquei a recepção da clínica e pausei minhas respostas temporariamente. A nossa equipe entrará em contato com você por aqui em instantes!",
    },
  };

  function appendChatBubble(text, sender, isAudio = false) {
    if (!chatMessages) return;

    const bubble = document.createElement("div");
    bubble.className = `chat-bubble ${sender === "user" ? "bubble-user" : "bubble-sofia"}`;

    if (isAudio && sender === "user") {
      bubble.style.borderLeft = "3px solid #38bdf8";
      bubble.style.background = "#0369a1";
    }

    const messageText = document.createElement("span");
    messageText.textContent = text;
    bubble.appendChild(messageText);

    const timeSpan = document.createElement("span");
    timeSpan.className = "bubble-time";
    const now = new Date();
    timeSpan.textContent = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
    bubble.appendChild(timeSpan);

    chatMessages.appendChild(bubble);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  simButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const scenarioKey = btn.getAttribute("data-scenario");
      const scenario = SIMULATOR_SCENARIOS[scenarioKey];
      if (!scenario) return;

      // Disable buttons temporarily
      simButtons.forEach((b) => (b.disabled = true));

      // Append user message
      appendChatBubble(scenario.userText, "user", scenario.isAudio);

      // Show typing indicator
      if (typingIndicator) {
        typingIndicator.style.display = "inline-flex";
        chatMessages.scrollTop = chatMessages.scrollHeight;
      }

      // Simulate realistic AI thinking/typing delay (1.2s)
      setTimeout(() => {
        if (typingIndicator) {
          typingIndicator.style.display = "none";
        }
        appendChatBubble(scenario.botResponse, "sofia");
        simButtons.forEach((b) => (b.disabled = false));
      }, 1200);
    });
  });

  /* ==========================================================================
     4. INTERACTIVE ROI CALCULATOR
  ========================================================================== */
  const ticketRange = document.getElementById("ticketRange");
  const ticketValDisplay = document.getElementById("ticketValDisplay");
  const lostRange = document.getElementById("lostRange");
  const lostValDisplay = document.getElementById("lostValDisplay");

  const calcBigValue = document.getElementById("calcBigValue");
  const calcBreakdown = document.getElementById("calcBreakdown");

  function updateROICalculation() {
    if (!ticketRange || !lostRange || !calcBigValue) return;

    const ticket = parseFloat(ticketRange.value) || 350;
    const lostCount = parseInt(lostRange.value, 10) || 12;

    if (ticketValDisplay) {
      ticketValDisplay.textContent = `R$ ${ticket.toLocaleString("pt-BR")}`;
    }
    if (lostValDisplay) {
      lostValDisplay.textContent = `${lostCount} pacientes`;
    }

    // Mathematical projection:
    // Monthly waste = ticket * lostCount
    // Sofia recovers ~70% of lost appointments (D-1 anti no-show + 24/7 night bookings)
    const totalLostMonthly = ticket * lostCount;
    const recoveredMonthly = Math.round(totalLostMonthly * 0.7);
    const planCost = 790; // Pro Plan benchmark
    const netGain = recoveredMonthly - planCost;
    const roiMultiplier = Math.round((netGain / planCost) * 100);

    calcBigValue.textContent = `+ R$ ${recoveredMonthly.toLocaleString("pt-BR")}`;

    if (calcBreakdown) {
      calcBreakdown.innerHTML = `
        Com base no seu ticket de <strong>R$ ${ticket}</strong> e <strong>${lostCount} perdas/mês</strong>:<br>
        • Desperdício atual: <strong>R$ ${totalLostMonthly.toLocaleString("pt-BR")}/mês</strong><br>
        • Faturamento resgatado: <strong>R$ ${recoveredMonthly.toLocaleString("pt-BR")}/mês</strong><br>
        • Investimento no Plano Pro: <strong>R$ ${planCost}/mês</strong><br>
        ✨ <strong>Retorno sobre Investimento: ${roiMultiplier}% (se paga em ~${Math.max(1, Math.round(30 / (recoveredMonthly / planCost)))} dias)!</strong>
      `;
    }
  }

  if (ticketRange && lostRange) {
    ticketRange.addEventListener("input", updateROICalculation);
    lostRange.addEventListener("input", updateROICalculation);
    updateROICalculation(); // Initialize
  }

  /* ==========================================================================
     5. FAQ ACCORDION (ACCESSIBLE VIA ARIA & KEYBOARD)
  ========================================================================== */
  const faqItems = document.querySelectorAll(".faq-item");

  faqItems.forEach((item) => {
    const btn = item.querySelector(".faq-question-btn");
    if (!btn) return;

    btn.addEventListener("click", () => {
      const isActive = item.classList.contains("active");

      // Close all
      faqItems.forEach((other) => other.classList.remove("active"));

      // Toggle current
      if (!isActive) {
        item.classList.add("active");
      }
    });
  });

  /* ==========================================================================
     6. HARDENED LEAD CAPTURE FORM (ANTI-BOT & CYBERSECURITY)
  ========================================================================== */
  const contactForm = document.getElementById("leadForm");
  const formStatus = document.getElementById("formStatus");

  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();

      // 1. Anti-Bot: Honeypot trap check
      const honeypot = document.getElementById("website_trap");
      if (honeypot && honeypot.value.trim() !== "") {
        console.warn("[Cybersecurity Alert] Bot submission detected via honeypot.");
        // Pretend success to deceive bot without taking action
        displayFormMessage("Solicitação recebida com sucesso! Em instantes entraremos em contato.", "success");
        contactForm.reset();
        return;
      }

      // 2. Anti-Bot: Timelock inspection (less than 3.5 seconds = automated script)
      const submitDuration = (Date.now() - PAGE_LOAD_TIME) / 1000;
      if (submitDuration < 3.5) {
        console.warn("[Cybersecurity Alert] Bot submission detected via sub-second timelock.");
        displayFormMessage("Falha na validação de segurança. Por favor, tente novamente.", "error");
        return;
      }

      // 3. Anti-Flood: Throttle repeated submissions
      const now = Date.now();
      if (now - lastSubmissionTime < SUBMISSION_COOLDOWN_MS) {
        displayFormMessage("Por favor, aguarde alguns segundos antes de enviar outra solicitação.", "error");
        return;
      }

      // 4. Input Extraction & Sanitization
      const nameInput = document.getElementById("leadName");
      const companyInput = document.getElementById("leadCompany");
      const phoneInput = document.getElementById("leadPhone");
      const segmentInput = document.getElementById("leadSegment");
      const consentCheck = document.getElementById("leadConsent");

      const rawName = nameInput ? nameInput.value : "";
      const rawCompany = companyInput ? companyInput.value : "";
      const rawPhone = phoneInput ? phoneInput.value : "";
      const rawSegment = segmentInput ? segmentInput.value : "";

      const cleanName = sanitizeText(rawName);
      const cleanCompany = sanitizeText(rawCompany);
      const cleanPhone = sanitizeText(rawPhone);
      const cleanSegment = sanitizeText(rawSegment);

      // Validation
      if (!cleanName || cleanName.length < 3) {
        displayFormMessage("Por favor, informe seu nome completo.", "error");
        return;
      }

      if (!validateBRPhone(cleanPhone)) {
        displayFormMessage("Por favor, informe um WhatsApp válido com DDD (ex: 21999999999).", "error");
        return;
      }

      if (!consentCheck || !consentCheck.checked) {
        displayFormMessage("É necessário aceitar os termos de contato para prosseguir.", "error");
        return;
      }

      lastSubmissionTime = now;

      // Construct encrypted/sanitized message for direct WhatsApp connection
      const whatsAppMessage = encodeURIComponent(
        `Olá, Bruno! Gostaria de agendar uma demonstração gratuita da Concierge IA da Cacofer Tecnologia.\n\n` +
        `👤 *Nome:* ${cleanName}\n` +
        `🏢 *Empresa/Clínica:* ${cleanCompany || "Não informado"}\n` +
        `📱 *WhatsApp:* ${cleanPhone}\n` +
        `🩺 *Ramo:* ${cleanSegment || "Clínica/Saúde"}`
      );

      // Primary destination: Cacofer Official WhatsApp (Bruno)
      const officialPhone = "5521995260032";
      const targetUrl = `https://wa.me/${officialPhone}?text=${whatsAppMessage}`;

      displayFormMessage("Diagnóstico enviado com sucesso! Redirecionando para o WhatsApp oficial...", "success");

      setTimeout(() => {
        window.open(targetUrl, "_blank", "noopener,noreferrer");
      }, 1200);
    });
  }

  function displayFormMessage(msg, type) {
    if (!formStatus) return;
    formStatus.textContent = msg;
    formStatus.style.display = "block";
    formStatus.style.padding = "12px 16px";
    formStatus.style.borderRadius = "8px";
    formStatus.style.marginTop = "16px";
    formStatus.style.fontSize = "0.9rem";
    formStatus.style.fontWeight = "600";
    formStatus.style.textAlign = "center";

    if (type === "success") {
      formStatus.style.background = "rgba(16, 185, 129, 0.15)";
      formStatus.style.color = "#34d399";
      formStatus.style.border = "1px solid rgba(16, 185, 129, 0.4)";
    } else {
      formStatus.style.background = "rgba(239, 68, 68, 0.15)";
      formStatus.style.color = "#f87171";
      formStatus.style.border = "1px solid rgba(239, 68, 68, 0.4)";
    }
  }
});
