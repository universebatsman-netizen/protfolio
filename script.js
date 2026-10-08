/**
 * Portfolio Interactive Scripts
 * - Vertical Navigation Bar: ScrollSpy & Mobile Drawer handling
 * - Night Mode Toggle: Synchronized across sidebar and mobile bar with CSS media query detection
 * - Interactive Resume Chat Assistant: Answers strictly with verified resume data
 * - Dynamic Year
 */

document.addEventListener('DOMContentLoaded', () => {

  // --------------------------------------------------------------------------
  // 1. NIGHT MODE TOGGLE & BROWSER THEME DETECTION
  // --------------------------------------------------------------------------
  const themeToggleBtns = document.querySelectorAll('.theme-toggle-btn');
  const htmlRoot = document.documentElement;
  const colorSchemeMedia = window.matchMedia('(prefers-color-scheme: dark)');

  // Check saved manual preference
  const savedTheme = localStorage.getItem('portfolio-theme');

  if (savedTheme) {
    htmlRoot.setAttribute('data-theme', savedTheme);
    syncToggleButtons(savedTheme);
  } else {
    // Let CSS media queries govern automatically
    const isDark = colorSchemeMedia.matches;
    syncToggleButtons(isDark ? 'dark' : 'light', true);
  }

  // Bind click handlers to all theme toggle buttons (desktop sidebar & mobile header)
  themeToggleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const currentTheme = getEffectiveTheme();
      const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';

      htmlRoot.setAttribute('data-theme', nextTheme);
      localStorage.setItem('portfolio-theme', nextTheme);
      syncToggleButtons(nextTheme);
    });
  });

  // Listen for OS/Browser theme changes when no manual override exists
  colorSchemeMedia.addEventListener('change', (e) => {
    const hasManualOverride = localStorage.getItem('portfolio-theme');
    if (!hasManualOverride) {
      syncToggleButtons(e.matches ? 'dark' : 'light', true);
    }
  });

  function getEffectiveTheme() {
    const manualTheme = htmlRoot.getAttribute('data-theme');
    if (manualTheme) return manualTheme;
    return colorSchemeMedia.matches ? 'dark' : 'light';
  }

  function syncToggleButtons(theme, isAuto = false) {
    const isDark = theme === 'dark';
    themeToggleBtns.forEach(btn => {
      btn.setAttribute('aria-pressed', isDark ? 'true' : 'false');
      const tooltip = `Current theme: ${isDark ? 'Night Mode' : 'Lavender Mode'} ${isAuto ? '(Auto-detected from browser)' : '(Custom)'}. Click to switch.`;
      btn.setAttribute('title', tooltip);
    });
  }

  // --------------------------------------------------------------------------
  // 2. VERTICAL NAVIGATION BAR & MOBILE DRAWER
  // --------------------------------------------------------------------------
  const sidebar = document.getElementById('sidebar-container');
  const mobileNavToggle = document.getElementById('mobile-nav-toggle');
  const sidebarCloseBtn = document.getElementById('sidebar-close-btn');
  const navBackdrop = document.getElementById('nav-backdrop');
  const navLinks = document.querySelectorAll('.vertical-nav-link');

  function openMobileNav() {
    if (!sidebar) return;
    sidebar.classList.add('active');
    if (navBackdrop) navBackdrop.classList.add('active');
    if (mobileNavToggle) mobileNavToggle.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  function closeMobileNav() {
    if (!sidebar) return;
    sidebar.classList.remove('active');
    if (navBackdrop) navBackdrop.classList.remove('active');
    if (mobileNavToggle) mobileNavToggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  if (mobileNavToggle) {
    mobileNavToggle.addEventListener('click', () => {
      const isOpen = sidebar.classList.contains('active');
      if (isOpen) {
        closeMobileNav();
      } else {
        openMobileNav();
      }
    });
  }

  if (sidebarCloseBtn) {
    sidebarCloseBtn.addEventListener('click', closeMobileNav);
  }

  if (navBackdrop) {
    navBackdrop.addEventListener('click', closeMobileNav);
  }

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && sidebar && sidebar.classList.contains('active')) {
      closeMobileNav();
    }
  });

  // Close drawer on clicking any link (mobile)
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (window.innerWidth <= 1024) {
        closeMobileNav();
      }
    });
  });

  // --------------------------------------------------------------------------
  // 3. SCROLLSPY (ACTIVE LINK INDICATOR)
  // --------------------------------------------------------------------------
  const sections = document.querySelectorAll('section[id]');

  function updateActiveNavLink() {
    const scrollY = window.scrollY + 180;

    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop;
      const sectionId = current.getAttribute('id');

      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          link.removeAttribute('aria-current');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
            link.setAttribute('aria-current', 'page');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', updateActiveNavLink, { passive: true });
  updateActiveNavLink();

  // --------------------------------------------------------------------------
  // 4. INTERACTIVE CHAT ASSISTANT (STRICTLY FROM RESUME)
  // --------------------------------------------------------------------------
  const chatForm = document.getElementById('chat-input-form');
  const chatInput = document.getElementById('chat-user-input');
  const chatMessages = document.getElementById('chat-messages');
  const chatClearBtn = document.getElementById('chat-clear-btn');
  const suggestionChips = document.querySelectorAll('.suggestion-chip');

  // Resume knowledge base for instant accurate replies
  const resumeKnowledge = {
    programming: "Shivkarna's core programming proficiencies are **C**, **Python**, and **Java**.",
    skills: "As stated on the resume, Shivkarna has expertise in:\n• **Programming**: C, Python, Java\n• **Core Concepts**: OOPs, Data Structures and Algorithms, Operating Systems\n• **Areas of Interest**: Artificial Intelligence, Machine Learning, Software Development\n• **Soft Skills**: Communication, Teamwork, Problem Solving, Quick Learning, Adaptability.",
    animal: "**Smart Animal Detection System**:\n• Developed an AI-based animal detection system for identifying animals and generating alerts.\n• Applied programming and problem-solving concepts to develop the project.\n• Worked on the project as part of practical engineering learning.",
    crop: "**Crop Field Monitoring System**:\n• Developed a smart crop field monitoring project to observe field conditions.\n• Used sensors and technology for monitoring and timely alerts.\n• Applied technical knowledge to address a real-world agricultural problem.",
    projects: "Shivkarna has two featured practical projects on the resume:\n1. **Smart Animal Detection System** (AI-based animal identification & alert generation)\n2. **Crop Field Monitoring System** (Sensor technology for field conditions & agricultural alerts).",
    education: "Shivkarna is pursuing a **Bachelor of Engineering in Artificial Intelligence and Machine Learning** (3rd Semester) at **Adichunchanagiri Institute of Technology, Chikkamagaluru**.\n• **Academic Record**: Achieved an outstanding **9.40 CGPA** in the 1st year of engineering!\n• **Previous Education**: PUC from Shaheen PU College, Aurad, Bidar; SSLC from Government High School, Eekeler, Bidar.",
    certifications: "Shivkarna holds the following certifications & achievements:\n• Hackathon Participation Certificate\n• Python Programming Workshop Certificate\n• 3-Day Internship Certificate\n• Achieved 9.40 CGPA in the 1st year of engineering.",
    contact: "You can reach Shivkarna directly via:\n• **Email**: shivakarnab@gmail.com\n• **Phone**: +91 6363774957\n• **Location**: Bidar, Karnataka, India\n• **LinkedIn**: linkedin.com/in/shivakarna-biradar-92b8703ba\n• **GitHub**: github.com/shivkarnabi-hue\n• **Profile**: proofile.in/shivkarna",
    about: "I am **Shivkarna**, a 2nd year AIML engineering student at Adichunchanagiri Institute of Technology. I am passionate about Artificial Intelligence and software development. I am a hardworking and quick learner who enjoys learning new technologies. I love solving problems and listening to music in my free time!",
    music: "In free time, Shivkarna loves listening to music and solving analytical problems!",
    default: "Thank you for asking! Shivkarna is a 2nd year AIML engineering student at Adichunchanagiri Institute of Technology (9.40 CGPA), passionate about AI, software development, solving problems, and listening to music in free time. What would you like to know?"
  };

  function appendChatMessage(text, sender = 'bot') {
    if (!chatMessages) return;

    const msgDiv = document.createElement('div');
    msgDiv.className = `chat-message message-${sender}`;

    const bubbleDiv = document.createElement('div');
    bubbleDiv.className = 'message-bubble';

    // Parse bold text and line breaks simply
    const formattedText = text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\n/g, '<br>');

    const p = document.createElement('p');
    p.innerHTML = formattedText;

    const timeSpan = document.createElement('span');
    timeSpan.className = 'message-time';
    const now = new Date();
    timeSpan.textContent = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

    bubbleDiv.appendChild(p);
    bubbleDiv.appendChild(timeSpan);
    msgDiv.appendChild(bubbleDiv);

    chatMessages.appendChild(msgDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  function appendTypingIndicator(id) {
    if (!chatMessages) return;

    const msgDiv = document.createElement('div');
    msgDiv.className = `chat-message message-bot typing-msg`;
    msgDiv.id = id;

    const bubbleDiv = document.createElement('div');
    bubbleDiv.className = 'message-bubble';
    bubbleDiv.innerHTML = `
      <div class="typing-indicator">
        <span></span><span></span><span></span>
      </div>
    `;

    msgDiv.appendChild(bubbleDiv);
    chatMessages.appendChild(msgDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  function removeTypingIndicator(id) {
    const indicator = document.getElementById(id);
    if (indicator) {
      indicator.remove();
    }
  }

  function generateBotReply(userQuery) {
    const q = userQuery.toLowerCase();

    if (q.includes('c ') || q.includes('python') || q.includes('java') || q.includes('language') || q.includes('programming')) {
      return resumeKnowledge.programming;
    }
    if (q.includes('animal') || q.includes('detection')) {
      return resumeKnowledge.animal;
    }
    if (q.includes('crop') || q.includes('field') || q.includes('farm') || q.includes('agriculture') || q.includes('sensor')) {
      return resumeKnowledge.crop;
    }
    if (q.includes('project') || q.includes('work')) {
      return resumeKnowledge.projects;
    }
    if (q.includes('cgpa') || q.includes('college') || q.includes('education') || q.includes('adichunchanagiri') || q.includes('study') || q.includes('grade')) {
      return resumeKnowledge.education;
    }
    if (q.includes('skill') || q.includes('oops') || q.includes('data structure') || q.includes('operating system')) {
      return resumeKnowledge.skills;
    }
    if (q.includes('certificate') || q.includes('internship') || q.includes('hackathon') || q.includes('workshop')) {
      return resumeKnowledge.certifications;
    }
    if (q.includes('contact') || q.includes('email') || q.includes('phone') || q.includes('number') || q.includes('reach') || q.includes('linkedin') || q.includes('hire')) {
      return resumeKnowledge.contact;
    }
    if (q.includes('music') || q.includes('song') || q.includes('free time') || q.includes('hobby')) {
      return resumeKnowledge.music;
    }
    if (q.includes('about') || q.includes('who are you') || q.includes('who is') || q.includes('intro') || q.includes('shivkarna')) {
      return resumeKnowledge.about;
    }
    return resumeKnowledge.default;
  }

  if (chatForm && chatInput) {
    chatForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const query = chatInput.value.trim();
      if (!query) return;

      appendChatMessage(query, 'user');
      chatInput.value = '';

      // Simulate typing animation
      const typingId = 'typing-' + Date.now();
      appendTypingIndicator(typingId);

      // Simulate a realistic brief typing pause or API latency
      // NOTE: Here is where you could integrate a real AI API (like OpenAI's GPT-4, Anthropic's Claude, etc.)
      // fetch('https://api.openai.com/v1/chat/completions', { ... })
      setTimeout(() => {
        removeTypingIndicator(typingId);
        const reply = generateBotReply(query);
        appendChatMessage(reply, 'bot');
      }, 1200);
    });
  }

  // Handle quick suggestion chips
  suggestionChips.forEach(chip => {
    chip.addEventListener('click', () => {
      const query = chip.getAttribute('data-query');
      if (query && chatInput) {
        appendChatMessage(query, 'user');
        const typingId = 'typing-' + Date.now();
        appendTypingIndicator(typingId);
        
        setTimeout(() => {
          removeTypingIndicator(typingId);
          const reply = generateBotReply(query);
          appendChatMessage(reply, 'bot');
        }, 1200);
      }
    });
  });

  // Handle clear chat button
  if (chatClearBtn && chatMessages) {
    chatClearBtn.addEventListener('click', () => {
      chatMessages.innerHTML = `
        <div class="chat-message message-bot">
          <div class="message-bubble">
            <p>Chat reset! Ask any question about Shivkarna's education, skills (C, Python, Java), projects, and contact info based directly on the resume.</p>
            <span class="message-time">Just now</span>
          </div>
        </div>
      `;
    });
  }

  // --------------------------------------------------------------------------
  // 5. DYNAMIC FOOTER YEAR
  // --------------------------------------------------------------------------
  const yearElement = document.getElementById('current-year');
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }

  // --------------------------------------------------------------------------
  // 6. AVATAR VIEW SWITCHER (REAL PORTRAIT vs PIXEL-ART AVATAR)
  // --------------------------------------------------------------------------
  const btnShowPhoto = document.getElementById('btn-show-photo');
  const btnShowPixel = document.getElementById('btn-show-pixel');
  const photoView = document.getElementById('profile-photo-view');
  const pixelView = document.getElementById('profile-pixel-view');

  if (btnShowPhoto && btnShowPixel && photoView && pixelView) {
    btnShowPhoto.addEventListener('click', () => {
      btnShowPhoto.classList.add('active');
      btnShowPhoto.setAttribute('aria-pressed', 'true');
      btnShowPixel.classList.remove('active');
      btnShowPixel.setAttribute('aria-pressed', 'false');

      photoView.style.display = 'block';
      pixelView.style.display = 'none';
    });

    btnShowPixel.addEventListener('click', () => {
      btnShowPixel.classList.add('active');
      btnShowPixel.setAttribute('aria-pressed', 'true');
      btnShowPhoto.classList.remove('active');
      btnShowPhoto.setAttribute('aria-pressed', 'false');

      photoView.style.display = 'none';
      pixelView.style.display = 'block';
    });
  }

  // --------------------------------------------------------------------------
  // 7. INTERACTIVE SKILLS CATEGORY FILTERING & ANIMATION
  // --------------------------------------------------------------------------
  const filterBtns = document.querySelectorAll('.skills-filter-btn');
  const skillCards = document.querySelectorAll('.skill-category-card');

  if (filterBtns.length > 0 && skillCards.length > 0) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const filterVal = btn.getAttribute('data-filter');

        // Update active tab button state
        filterBtns.forEach(b => {
          b.classList.remove('active');
          b.setAttribute('aria-selected', 'false');
        });
        btn.classList.add('active');
        btn.setAttribute('aria-selected', 'true');

        // Filter cards smoothly
        skillCards.forEach(card => {
          const category = card.getAttribute('data-category');
          if (filterVal === 'all' || category === filterVal) {
            card.style.display = 'flex';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          } else {
            card.style.display = 'none';
            card.style.opacity = '0';
          }
        });
      });
    });
  }

  // --------------------------------------------------------------------------
  // 8. INTERACTIVE TIMELINE CATEGORY FILTERING
  // --------------------------------------------------------------------------
  const timelineFilterBtns = document.querySelectorAll('.timeline-filter-btn');
  const timelineCardItems = document.querySelectorAll('.timeline-card-item');

  if (timelineFilterBtns.length > 0 && timelineCardItems.length > 0) {
    timelineFilterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const filterVal = btn.getAttribute('data-filter');

        // Update active tab state
        timelineFilterBtns.forEach(b => {
          b.classList.remove('active');
          b.setAttribute('aria-selected', 'false');
        });
        btn.classList.add('active');
        btn.setAttribute('aria-selected', 'true');

        // Filter timeline cards with subtle fade
        timelineCardItems.forEach(item => {
          const category = item.getAttribute('data-category');
          if (filterVal === 'all' || category === filterVal) {
            item.style.display = 'block';
            item.style.opacity = '1';
          } else {
            item.style.display = 'none';
            item.style.opacity = '0';
          }
        });
      });
    });
  }

  // --------------------------------------------------------------------------
  // 9. PROJECT DETAIL MODALS (THUMBNAIL GALLERY MODALS)
  // --------------------------------------------------------------------------
  const modalTriggers = document.querySelectorAll('[data-modal]');
  const modalBackdrops = document.querySelectorAll('.project-modal-backdrop');
  const modalCloseBtns = document.querySelectorAll('.modal-close-btn');

  function openProjectModal(modalId) {
    const targetModal = document.getElementById(modalId);
    if (!targetModal) return;
    targetModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeAllModals() {
    modalBackdrops.forEach(m => m.classList.remove('active'));
    document.body.style.overflow = '';
  }

  modalTriggers.forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      const modalId = trigger.getAttribute('data-modal');
      if (modalId) {
        openProjectModal(modalId);
      }
    });

    // Support keyboard activation on role="button" wrappers
    trigger.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        const modalId = trigger.getAttribute('data-modal');
        if (modalId) {
          openProjectModal(modalId);
        }
      }
    });
  });

  modalCloseBtns.forEach(btn => {
    btn.addEventListener('click', closeAllModals);
  });

  modalBackdrops.forEach(backdrop => {
    backdrop.addEventListener('click', (e) => {
      if (e.target === backdrop) {
        closeAllModals();
      }
    });
  });

  // --------------------------------------------------------------------------
  // 10. RESPONSIVE VIDEO HIGHLIGHT CONTROLS & CHAPTER SELECTOR
  // --------------------------------------------------------------------------
  const videoIframe = document.getElementById('portfolio-youtube-iframe');
  const btnPlay = document.getElementById('video-ctrl-play');
  const iconPlay = btnPlay ? btnPlay.querySelector('.icon-play') : null;
  const iconPause = btnPlay ? btnPlay.querySelector('.icon-pause') : null;
  const btnMute = document.getElementById('video-ctrl-mute');
  const lblMute = document.getElementById('ctrl-mute-label');
  const btnReplay = document.getElementById('video-ctrl-replay');
  const btnFullscreen = document.getElementById('video-ctrl-fullscreen');
  const videoCardContainer = document.getElementById('video-showcase-container');
  const chapterBtns = document.querySelectorAll('.chapter-pill-btn');
  const captionText = document.getElementById('video-caption-text');
  const captionTags = document.getElementById('caption-tech-tags');
  const topicBadge = document.getElementById('video-topic-badge');
  const btnYtExternal = document.getElementById('btn-yt-external');

  let isPlaying = false;
  let isMuted = false;

  // Send command to YouTube iframe via postMessage
  function sendYtCommand(func, args = []) {
    if (videoIframe && videoIframe.contentWindow) {
      videoIframe.contentWindow.postMessage(JSON.stringify({
        event: 'command',
        func: func,
        args: args
      }), '*');
    }
  }

  // Play / Pause Toggle
  if (btnPlay) {
    btnPlay.addEventListener('click', () => {
      if (!isPlaying) {
        sendYtCommand('playVideo');
        isPlaying = true;
        if (iconPlay) iconPlay.style.display = 'none';
        if (iconPause) iconPause.style.display = 'inline-block';
        const label = document.getElementById('ctrl-play-label');
        if (label) label.textContent = 'Pause';
      } else {
        sendYtCommand('pauseVideo');
        isPlaying = false;
        if (iconPlay) iconPlay.style.display = 'inline-block';
        if (iconPause) iconPause.style.display = 'none';
        const label = document.getElementById('ctrl-play-label');
        if (label) label.textContent = 'Play';
      }
    });
  }

  // Audio Mute / Unmute Toggle
  if (btnMute) {
    btnMute.addEventListener('click', () => {
      if (!isMuted) {
        sendYtCommand('mute');
        isMuted = true;
        if (lblMute) lblMute.textContent = 'Unmute';
        btnMute.classList.add('muted');
      } else {
        sendYtCommand('unMute');
        isMuted = false;
        if (lblMute) lblMute.textContent = 'Mute Audio';
        btnMute.classList.remove('muted');
      }
    });
  }

  // Replay from start
  if (btnReplay) {
    btnReplay.addEventListener('click', () => {
      sendYtCommand('seekTo', [0, true]);
      sendYtCommand('playVideo');
      isPlaying = true;
      if (iconPlay) iconPlay.style.display = 'none';
      if (iconPause) iconPause.style.display = 'inline-block';
      const label = document.getElementById('ctrl-play-label');
      if (label) label.textContent = 'Pause';
    });
  }

  // Fullscreen Toggle
  if (btnFullscreen && videoCardContainer) {
    btnFullscreen.addEventListener('click', () => {
      if (!document.fullscreenElement) {
        if (videoCardContainer.requestFullscreen) {
          videoCardContainer.requestFullscreen();
        } else if (videoCardContainer.webkitRequestFullscreen) {
          videoCardContainer.webkitRequestFullscreen();
        }
      } else {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        }
      }
    });
  }

  // Video Chapter Details data
  const chapterData = {
    neural: {
      videoId: 'aircAruvnKk',
      badge: 'Neural Networks Core',
      caption: 'Featured highlight: A comprehensive visual walkthrough of artificial neural networks, weight matrix math, and gradient backpropagation — foundational computational theory behind Shivkarna\'s AI and Machine Learning models at Adichunchanagiri Institute of Technology.',
      tags: ['✦ Neural Networks', '✦ Deep Learning', '✦ Backpropagation', '✦ Python & PyTorch', '✦ 9.40 CGPA Rigor'],
      ytUrl: 'https://www.youtube.com/watch?v=aircAruvnKk'
    },
    vision: {
      videoId: 'bXv40UqF_jI',
      badge: 'Animal Vision AI',
      caption: 'Featured highlight: Real-time computer vision inference and object classification architecture — directly demonstrating the algorithmic principles behind Shivkarna\'s <strong>Smart Animal Detection System</strong> for wildlife identification and instantaneous safety alert generation.',
      tags: ['✦ Computer Vision', '✦ Species Classification', '✦ Real-Time Inference', '✦ OpenCV & Python', '✦ Instant Alerts'],
      ytUrl: 'https://www.youtube.com/watch?v=bXv40UqF_jI'
    },
    iot: {
      videoId: '6mBO2vqLv38',
      badge: 'IoT Crop Telemetry',
      caption: 'Featured highlight: Multi-sensor telemetry streaming and environmental data analysis — demonstrating the real-world IoT engineering architecture implemented in Shivkarna\'s <strong>Crop Field Monitoring System</strong> for smart agriculture condition tracking and timely alerts.',
      tags: ['✦ IoT Sensor Telemetry', '✦ Soil & Temp Monitoring', '✦ AgTech Innovation', '✦ Threshold Alerts', '✦ Python Telemetry'],
      ytUrl: 'https://www.youtube.com/watch?v=6mBO2vqLv38'
    }
  };

  // Chapter Switcher Handlers
  chapterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const chapterKey = btn.getAttribute('data-chapter');
      const data = chapterData[chapterKey];
      if (!data) return;

      // Update active chapter button styling
      chapterBtns.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');

      // Update iframe source
      if (videoIframe) {
        videoIframe.src = `https://www.youtube.com/embed/${data.videoId}?enablejsapi=1&rel=0&modestbranding=1&autoplay=1`;
        isPlaying = true;
        if (iconPlay) iconPlay.style.display = 'none';
        if (iconPause) iconPause.style.display = 'inline-block';
        const label = document.getElementById('ctrl-play-label');
        if (label) label.textContent = 'Pause';
      }

      // Update badge, caption, tags, and external link
      if (topicBadge) topicBadge.textContent = data.badge;
      if (captionText) captionText.innerHTML = data.caption;
      if (btnYtExternal) btnYtExternal.href = data.ytUrl;

      if (captionTags) {
        captionTags.innerHTML = data.tags.map(t => `<span class="pixel-tech-pill">${t}</span>`).join('');
      }
    });
  });

  // --------------------------------------------------------------------------
  // 11. INTERACTIVE TESTIMONIALS CATEGORY FILTERING
  // --------------------------------------------------------------------------
  const testimonialFilterBtns = document.querySelectorAll('.testimonial-filter-btn');
  const testimonialCards = document.querySelectorAll('.testimonial-card');

  if (testimonialFilterBtns.length > 0 && testimonialCards.length > 0) {
    testimonialFilterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const filterVal = btn.getAttribute('data-filter');

        // Update active tab button state
        testimonialFilterBtns.forEach(b => {
          b.classList.remove('active');
          b.setAttribute('aria-selected', 'false');
        });
        btn.classList.add('active');
        btn.setAttribute('aria-selected', 'true');

        // Filter cards smoothly
        testimonialCards.forEach(card => {
          const category = card.getAttribute('data-category');
          if (filterVal === 'all' || category === filterVal) {
            card.style.display = 'flex';
            card.style.opacity = '1';
          } else {
            card.style.display = 'none';
            card.style.opacity = '0';
          }
        });
      });
    });
  }

  // Global Escape Key Listener for Modals
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeAllModals();
    }
  });

  // --------------------------------------------------------------------------
  // 12. CONTACT FORM SUBMISSION HANDLING
  // --------------------------------------------------------------------------
  const contactForm = document.getElementById('contact-form');
  const successMessage = document.getElementById('form-success-message');
  const submitBtn = document.getElementById('contact-submit-btn');

  if (contactForm && successMessage && submitBtn) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      // Visual feedback for sending state
      const originalBtnHtml = submitBtn.innerHTML;
      submitBtn.innerHTML = '<span>Sending...</span>';
      submitBtn.disabled = true;
      submitBtn.style.opacity = '0.7';
      submitBtn.style.cursor = 'wait';

      // Simulate network request delay
      // NOTE: This is where you would integrate an email-sending service API.
      // Example with Resend API:
      /*
      fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer YOUR_RESEND_API_KEY',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          from: 'onboarding@resend.dev',
          to: 'shivakarnab@gmail.com',
          subject: 'New Portfolio Contact: ' + document.getElementById('contact-name').value,
          html: '<p>' + document.getElementById('contact-message').value + '</p><p>From: ' + document.getElementById('contact-email').value + '</p>'
        })
      }).then(response => { ... })
      */

      setTimeout(() => {
        // Reset button state
        submitBtn.innerHTML = originalBtnHtml;
        submitBtn.disabled = false;
        submitBtn.style.opacity = '1';
        submitBtn.style.cursor = 'pointer';

        // Hide button, show success message
        submitBtn.style.display = 'none';
        successMessage.style.display = 'flex';
        
        // Reset form fields
        contactForm.reset();

        // Optional: Re-show button after a few seconds to allow another message
        setTimeout(() => {
          successMessage.style.display = 'none';
          submitBtn.style.display = 'flex';
        }, 6000);
      }, 1500);
    });
  }

});



